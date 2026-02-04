import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const session = await auth();
        if (!session?.user?.email) {
          throw new Error('Unauthorized');
        }

        return {
          allowedContentTypes: [
            'image/jpeg', 
            'image/png', 
            'image/gif',
            'application/pdf',
            'text/plain',
            'video/mp4',
            // Office Documents
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
            'application/vnd.ms-excel', // xls
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
            'application/msword', // doc
            'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
            'application/vnd.ms-powerpoint', // ppt
            'text/csv' // csv
          ],
          tokenPayload: JSON.stringify({
            email: session.user.email,
          }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Webhook handler - útil para consistência em produção
        // Mas lidaremos com a criação no DB no lado do cliente (sucesso) para feedback imediato na UI
        // TODO: Implementar webhook para robustez (ver PENDING.md)
        console.log('Blob uploaded', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
