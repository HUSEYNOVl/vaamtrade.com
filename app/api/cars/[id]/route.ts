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
    console.log('Updating car:', id, { ...body, images: Array.isArray(body.images) ? `${body.images.length} images` : 'not an array' });

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

    const car = await prisma.car.update({
      where: { id },
      data: {
        ...cleanCarData,
        images: stringifyImages(imagesArray),
      },
    });

    console.log('Car updated successfully:', car.id);

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

    return NextResponse.json({ ...car, images: parsedImages });
  } catch (error: any) {
    console.error('Error updating car:', error);
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Car not found' }, { status: 404 });
    }
    return NextResponse.json(
      { error: error?.message || 'Failed to update car. Please check all fields and try again.' },
      { status: 500 }
    );
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

