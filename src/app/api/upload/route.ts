import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from "@/lib/prisma";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;
  console.log("Upload API chamada. Body:", JSON.stringify(body));

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        console.log("Gerando token para:", pathname);
        const session = await auth();
        console.log("Sessão encontrada:", session?.user?.email);

        if (!session?.user?.email) {
          console.error("Erro: Usuário não autenticado");
          throw new Error('Unauthorized');
        }

        // Parse clientPayload
        let fileSize = 0;
        let folderId: string | null = null;
        let filename: string | null = null;
        
        if (clientPayload) {
            try {
                const payload = JSON.parse(clientPayload);
                fileSize = payload.size || 0;
                folderId = payload.folderId || null;
                filename = payload.filename || null;
            } catch (e) {
                console.error("Error parsing clientPayload", e);
            }
        }

        // 1. File size limit (10MB)
        if (fileSize > 10 * 1024 * 1024) {
            throw new Error("Arquivo excede o limite de 10MB");
        }

        // 2. User storage limit (1GB)
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: { files: { select: { sizeBytes: true } } }
        });

        if (user) {
            const currentUsage = user.files.reduce((acc, file) => acc + BigInt(file.sizeBytes), BigInt(0));
            const newUsage = currentUsage + BigInt(fileSize);
            const limit = BigInt(1024 * 1024 * 1024); // 1GB

            if (newUsage > limit) {
                throw new Error("Limite de armazenamento excedido (1GB)");
            }
        }

        return {
          allowedContentTypes: [
            'image/jpeg', 
            'image/png', 
            'image/gif',
            'application/pdf',
            'text/plain',
            'video/mp4',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-excel',
            'application/excel',
            'application/x-excel',
            'application/x-msexcel',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'application/vnd.ms-powerpoint',
            'text/csv',
            'application/zip',
            'application/x-zip-compressed',
            'application/x-rar-compressed',
            'application/x-7z-compressed',
            'application/x-tar',
            'application/gzip'
          ],
          tokenPayload: JSON.stringify({
            email: session.user.email,
          }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // TODO: Implementar webhook para robustez (ver PENDING.md)
        // console.log('Blob uploaded', blob.url);
        
        // Return payload for webhook
        return {
          userId: session.user.id,
          folderId: folderId,
          filename: filename
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("Erro fatal no upload route:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
