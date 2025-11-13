import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const page = await prisma.page.findUnique({
      where: { id },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Parse sections JSON
    let sections = [];
    try {
      sections = typeof page.sections === 'string' ? JSON.parse(page.sections) : page.sections;
    } catch {
      sections = [];
    }

    return NextResponse.json({ ...page, sections });
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json({ error: 'Failed to fetch page' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { slug, title, status, seoTitle, seoDesc, seoKeywords, sections, order } = body;

    const page = await prisma.page.update({
      where: { id },
      data: {
        slug: slug !== undefined ? slug : undefined,
        title: title !== undefined ? title : undefined,
        status: status !== undefined ? status : undefined,
        seoTitle: seoTitle !== undefined ? seoTitle : undefined,
        seoDesc: seoDesc !== undefined ? seoDesc : undefined,
        seoKeywords: seoKeywords !== undefined ? seoKeywords : undefined,
        sections: sections !== undefined ? (typeof sections === 'string' ? sections : JSON.stringify(sections)) : undefined,
        order: order !== undefined ? order : undefined,
      },
    });

    let parsedSections = [];
    try {
      parsedSections = typeof page.sections === 'string' ? JSON.parse(page.sections) : page.sections;
    } catch {
      parsedSections = [];
    }

    return NextResponse.json({ ...page, sections: parsedSections });
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json({ error: 'Failed to update page' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.page.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: 'Failed to delete page' }, { status: 500 });
  }
}

