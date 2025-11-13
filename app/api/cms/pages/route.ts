import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const page = await prisma.page.findUnique({
        where: { slug },
      });
      return NextResponse.json(page ? [page] : []);
    }

    const pages = await prisma.page.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, status = 'draft', seoTitle, seoDesc, seoKeywords, sections = '[]', order = 0 } = body;

    const page = await prisma.page.create({
      data: {
        slug,
        title,
        status,
        seoTitle,
        seoDesc,
        seoKeywords,
        sections: typeof sections === 'string' ? sections : JSON.stringify(sections),
        order,
      },
    });

    return NextResponse.json(page, { status: 201 });
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: 'Failed to create page' }, { status: 500 });
  }
}

