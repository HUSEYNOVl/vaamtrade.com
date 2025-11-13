import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Ensure prisma is properly initialized
    if (!prisma || !prisma.video) {
      console.error('Prisma client not properly initialized');
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }
    
    const videos = await prisma.video.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(videos);
  } catch (error: any) {
    console.error('Error fetching videos:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch videos',
      details: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, thumbnailUrl, videoUrl, type = 'youtube', order = 0, visible = true } = body;

    const video = await prisma.video.create({
      data: {
        title,
        description,
        thumbnailUrl,
        videoUrl,
        type,
        order,
        visible,
      },
    });

    return NextResponse.json(video, { status: 201 });
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json({ error: 'Failed to create video' }, { status: 500 });
  }
}

