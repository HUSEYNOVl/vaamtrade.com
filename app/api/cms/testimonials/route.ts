import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Ensure prisma is properly initialized
    if (!prisma || !prisma.testimonial) {
      console.error('Prisma client not properly initialized');
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }
    
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(testimonials);
  } catch (error: any) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch testimonials',
      details: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, role, company, content, imageUrl, rating, order = 0, visible = true } = body;

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role,
        company,
        content,
        imageUrl,
        rating,
        order,
        visible,
      },
    });

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}

