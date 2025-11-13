import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { stringifyImages } from '@/lib/utils';

export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const carsWithParsedImages = cars.map((car) => {
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
      return {
        ...car,
        images,
      };
    });

    return NextResponse.json(carsWithParsedImages);
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json({ error: 'Failed to fetch cars' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { images, ...carData } = body;

    // Validate required fields
    if (!carData.make || !carData.model || !carData.year || !carData.price) {
      return NextResponse.json(
        { error: 'Missing required fields: make, model, year, and price are required' },
        { status: 400 }
      );
    }

    // Ensure images is an array
    const imagesArray = Array.isArray(images) ? images : [];

    const car = await prisma.car.create({
      data: {
        ...carData,
        images: stringifyImages(imagesArray),
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

    return NextResponse.json({ ...car, images: parsedImages }, { status: 201 });
  } catch (error) {
    console.error('Error creating car:', error);
    return NextResponse.json({ error: 'Failed to create car' }, { status: 500 });
  }
}

