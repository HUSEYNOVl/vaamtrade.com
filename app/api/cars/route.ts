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
    // Check if Prisma is available
    if (!prisma || !prisma.car) {
      console.error('Prisma client not initialized');
      return NextResponse.json(
        { error: 'Database connection error. Please check your database configuration.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log('Received car data:', { ...body, images: Array.isArray(body.images) ? `${body.images.length} images` : 'not an array' });

    const { images, ...carData } = body;

    // Validate required fields with detailed error messages
    if (!carData.make || typeof carData.make !== 'string' || carData.make.trim().length === 0) {
      return NextResponse.json(
        { error: 'Make is required and must be a non-empty string' },
        { status: 400 }
      );
    }
    if (!carData.model || typeof carData.model !== 'string' || carData.model.trim().length === 0) {
      return NextResponse.json(
        { error: 'Model is required and must be a non-empty string' },
        { status: 400 }
      );
    }
    if (!carData.year || typeof carData.year !== 'number' || carData.year < 1900 || carData.year > new Date().getFullYear() + 1) {
      return NextResponse.json(
        { error: 'Year is required and must be a valid year' },
        { status: 400 }
      );
    }
    if (!carData.price || typeof carData.price !== 'number' || carData.price <= 0) {
      return NextResponse.json(
        { error: 'Price is required and must be greater than 0' },
        { status: 400 }
      );
    }

    // Ensure images is an array and filter out invalid values
    let imagesArray: string[] = [];
    if (Array.isArray(images)) {
      imagesArray = images.filter((img) => img && typeof img === 'string' && img.trim().length > 0);
    } else if (images && typeof images === 'string') {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed)) {
          imagesArray = parsed.filter((img) => img && typeof img === 'string' && img.trim().length > 0);
        }
      } catch (e) {
        console.warn('Could not parse images string:', e);
      }
    }

    console.log('Processed images array:', imagesArray.length, 'images');

    // Clean car data
    const cleanCarData = {
      make: carData.make.trim(),
      model: carData.model.trim(),
      year: parseInt(carData.year.toString()),
      price: parseFloat(carData.price.toString()),
      currency: carData.currency || 'USD',
      mileage: carData.mileage ? parseInt(carData.mileage.toString()) : null,
      condition: carData.condition || 'Used',
      transmission: carData.transmission || null,
      fuelType: carData.fuelType || null,
      color: carData.color || null,
      description: carData.description || null,
      featured: carData.featured === true || carData.featured === 'true',
      videoUrl: carData.videoUrl || null,
    };

    const car = await prisma.car.create({
      data: {
        ...cleanCarData,
        images: stringifyImages(imagesArray),
      },
    });

    console.log('Car created successfully:', car.id);

    // Parse images safely for response
    let parsedImages: string[] = [];
    try {
      if (typeof car.images === 'string') {
        parsedImages = JSON.parse(car.images);
      } else if (Array.isArray(car.images)) {
        parsedImages = car.images;
      }
    } catch (e) {
      console.error('Error parsing images in response:', e);
      parsedImages = imagesArray; // Fallback to what we sent
    }

    return NextResponse.json({ ...car, images: parsedImages }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating car:', error);
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack,
    });
    
    // Provide more specific error messages
    let errorMessage = 'Failed to create car. Please check all fields and try again.';
    
    if (error?.code === 'P2002') {
      errorMessage = 'A car with this information already exists.';
    } else if (error?.code === 'P1001') {
      errorMessage = 'Cannot reach database. Please check your database connection.';
    } else if (error?.message) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage, details: process.env.NODE_ENV === 'development' ? error?.message : undefined },
      { status: 500 }
    );
  }
}

