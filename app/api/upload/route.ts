import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    // Check if we're on Vercel (read-only filesystem)
    const isVercel = process.env.VERCEL === '1';
    
    if (isVercel) {
      // On Vercel, we need to use a different approach
      // For now, return an error with instructions
      return NextResponse.json(
        { 
          error: 'File uploads are not supported on Vercel. Please use a cloud storage service like Vercel Blob, AWS S3, or Cloudinary.',
          details: 'Vercel has a read-only filesystem. You need to configure cloud storage for file uploads.',
        },
        { status: 501 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('No file in form data');
      console.error('FormData keys:', Array.from(formData.keys()));
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('Received file:', file.name, file.type, file.size, 'bytes');
    
    // Check if file is actually a File object
    if (!(file instanceof File)) {
      console.error('Invalid file object:', typeof file, file);
      return NextResponse.json({ error: 'Invalid file object' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads');
    
    try {
      if (!existsSync(uploadsDir)) {
        await mkdir(uploadsDir, { recursive: true });
        console.log('Created uploads directory:', uploadsDir);
      }
    } catch (dirError: any) {
      console.error('Error creating uploads directory:', dirError);
      return NextResponse.json(
        { error: 'Failed to create uploads directory', details: dirError?.message },
        { status: 500 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${timestamp}-${sanitizedName}`;
    const filepath = join(uploadsDir, filename);

    // Write file
    try {
      await writeFile(filepath, buffer);
      console.log('File saved to:', filepath);
    } catch (writeError: any) {
      console.error('Error writing file:', writeError);
      return NextResponse.json(
        { 
          error: 'Failed to save file', 
          details: writeError?.message,
          code: writeError?.code,
        },
        { status: 500 }
      );
    }

    // Return the URL path
    const url = `/uploads/${filename}`;
    console.log('File uploaded successfully. URL:', url);
    return NextResponse.json({ url }, { status: 200 });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      errno: error?.errno,
      path: error?.path,
      stack: error?.stack,
    });
    
    let errorMessage = 'Failed to upload file';
    if (error?.code === 'EACCES' || error?.code === 'EPERM') {
      errorMessage = 'Permission denied. Cannot write to uploads directory.';
    } else if (error?.code === 'ENOSPC') {
      errorMessage = 'No space left on device.';
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage, details: process.env.NODE_ENV === 'development' ? error?.message : undefined },
      { status: 500 }
    );
  }
}

