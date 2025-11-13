import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Ensure prisma is properly initialized
    if (!prisma || !prisma.certificate) {
      console.error('Prisma client not properly initialized');
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }
    
    const certificates = await prisma.certificate.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(certificates);
  } catch (error: any) {
    console.error('Error fetching certificates:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch certificates',
      details: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, imageUrl, order = 0, visible = true } = body;

    const certificate = await prisma.certificate.create({
      data: {
        title,
        description,
        imageUrl,
        order,
        visible,
      },
    });

    return NextResponse.json(certificate, { status: 201 });
  } catch (error) {
    console.error('Error creating certificate:', error);
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 });
  }
}

