import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stringifyImages } from '@/lib/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const car = await prisma.car.findUnique({
      where: { id },
    });

    if (!car) {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }

    // Parse images safely
    let images = [];
    try {
      if (typeof car.images === 'string') {
        images = JSON.parse(car.images);
      } else if (Array.isArray(car.images)) {
        images = car.images;
      }
    } catch (e) {
      console.error('Error parsing images:', e);
      images = [];
    }

    return NextResponse.json({ ...car, images });
  } catch (error) {
    console.error('Error fetching car:', error);
    return NextResponse.json({ error: 'Failed to fetch car' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { images, ...carData } = body;

    // Validate required fields
    if (!carData.make || !carData.model || !carData.year || !carData.price) {
      return NextResponse.json(
        { error: 'Missing required fields: make, model, year, and price are required' },
        { status: 400 }
      );
    }

    const car = await prisma.car.update({
      where: { id },
      data: {
        ...carData,
        images: stringifyImages(images || []),
      },
    });

    // Parse images safely for response
    let parsedImages = [];
    try {
      if (typeof car.images === 'string') {
        parsedImages = JSON.parse(car.images);
      } else if (Array.isArray(car.images)) {
        parsedImages = car.images;
      }
    } catch (e) {
      console.error('Error parsing images in response:', e);
      parsedImages = [];
    }

    return NextResponse.json({ ...car, images: parsedImages });
  } catch (error) {
    console.error('Error updating car:', error);
    return NextResponse.json({ error: 'Failed to update car' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.car.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Car deleted successfully' });
  } catch (error) {
    console.error('Error deleting car:', error);
    return NextResponse.json({ error: 'Failed to delete car' }, { status: 500 });
  }
}

