import { NextRequest, NextResponse } from 'next/server';
import { seedDefaultPages } from '@/lib/cms-seed';

export async function POST(request: NextRequest) {
  try {
    const pages = await seedDefaultPages();
    return NextResponse.json({ success: true, pages, message: 'Pages seeded successfully' });
  } catch (error: any) {
    console.error('Error seeding pages:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to seed pages' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Use POST to seed pages' });
}

