import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { del } from '@vercel/blob';

async function deleteFolderRecursively(folderId: string) {
  // 1. Encontrar subpastas
  const subfolders = await prisma.folder.findMany({
    where: { parentId: folderId },
  });

  for (const subfolder of subfolders) {
    await deleteFolderRecursively(subfolder.id);
  }

  // 2. Encontrar arquivos nesta pasta
  const files = await prisma.file.findMany({
    where: { folderId: folderId },
  });

  // 3. Deletar blobs dos arquivos
  for (const file of files) {
    if (file.storageUrl) {
      try {
        await del(file.storageUrl);
        console.log(`Blob deletado para arquivo: ${file.id}`);
      } catch (error) {
        console.error(`Erro ao deletar blob do arquivo ${file.id}:`, error);
      }
    }
  }

  // Nota: A deleção dos registros do banco (files e subfolders) acontecerá 
  // automaticamente quando deletarmos a pasta pai devido ao onDelete: Cascade no schema.
  // Mas deletar os blobs é manual e crucial.
}

export async function GET(request: Request) {
  // Verificação de segurança simples (opcional para Vercel Cron se configurado como privado, 
  // mas aqui deixaremos aberto ou verificaríamos um header 'Authorization' se tivéssemos CRON_SECRET)
  // const authHeader = request.headers.get('authorization');
  // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
  //   return new NextResponse('Unauthorized', { status: 401 });
  // }

  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // Para teste imediato, você pode comentar a linha acima e usar:
    // const thirtyDaysAgo = new Date(); // Deleta tudo que está na lixeira agora

    console.log(`Iniciando limpeza da lixeira. Corte: ${thirtyDaysAgo.toISOString()}`);

    // 1. Limpar Arquivos Vencidos (que estão explicitamente na lixeira)
    const expiredFiles = await prisma.file.findMany({
      where: {
        inTrash: true,
        deletedAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    console.log(`Encontrados ${expiredFiles.length} arquivos vencidos.`);

    for (const file of expiredFiles) {
      if (file.storageUrl) {
        try {
          await del(file.storageUrl);
        } catch (error) {
          console.error(`Erro ao deletar blob do arquivo ${file.id}:`, error);
        }
      }
      // Deletar do banco
      await prisma.file.delete({ where: { id: file.id } });
    }

    // 2. Limpar Pastas Vencidas
    const expiredFolders = await prisma.folder.findMany({
      where: {
        inTrash: true,
        deletedAt: {
          lt: thirtyDaysAgo,
        },
      },
    });

    console.log(`Encontradas ${expiredFolders.length} pastas vencidas.`);

    for (const folder of expiredFolders) {
      // Antes de deletar a pasta, precisamos garantir que os blobs de todos os arquivos 
      // dentro dela (recursivamente) sejam deletados.
      await deleteFolderRecursively(folder.id);

      // Finalmente deletar a pasta do banco
      await prisma.folder.delete({ where: { id: folder.id } });
    }

    return NextResponse.json({
      success: true,
      deletedFiles: expiredFiles.length,
      deletedFolders: expiredFolders.length,
    });
  } catch (error) {
    console.error('Erro no cron de limpeza:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
