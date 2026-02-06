import { type NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// We need to define the expected payload structure
interface BlobUploadCompletedEvent {
  type: 'blob.upload-completed';
  payload: {
    userId: string;
    folderId: string | null;
    filename: string | null;
  };
  blob: {
    url: string;
    pathname: string;
    size: number;
    contentType: string;
    downloadUrl: string;
  };
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const event = body as BlobUploadCompletedEvent;

  if (event.type !== 'blob.upload-completed') {
    return NextResponse.json({ message: 'Ignored event type' }, { status: 400 });
  }

  const { payload, blob } = event;

  if (!payload?.userId) {
    console.error('Webhook missing userId in payload', event);
    return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
  }

  try {
    // Check if file already exists to avoid duplicates (Client-side upload might have already created it)
    const existingFile = await prisma.file.findFirst({
      where: { storageUrl: blob.url }
    });

    if (existingFile) {
      console.log('File already registered:', blob.url);
      return NextResponse.json({ message: 'File already exists' });
    }

    // Create file record
    await prisma.file.create({
      data: {
        userId: payload.userId,
        folderId: payload.folderId,
        name: payload.filename || blob.pathname, // Prefer original filename
        sizeBytes: BigInt(blob.size),
        mimeType: blob.contentType,
        storageKey: blob.url, // Using url as key for now
        storageUrl: blob.url,
      }
    });

    console.log('File registered via webhook:', blob.url);
    return NextResponse.json({ message: 'File registered' });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
