import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Ensure prisma is properly initialized
    if (!prisma || !prisma.fAQ) {
      console.error('Prisma client not properly initialized');
      return NextResponse.json({ error: 'Database connection error' }, { status: 500 });
    }
    
    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(faqs);
  } catch (error: any) {
    console.error('Error fetching FAQs:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch FAQs',
      details: error?.message || 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { question, answer, category, order = 0, visible = true } = body;

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
        category,
        order,
        visible,
      },
    });

    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    return NextResponse.json({ error: 'Failed to create FAQ' }, { status: 500 });
  }
}

