import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const namespace = searchParams.get('namespace');
    const locale = searchParams.get('locale');

    const where: any = {};
    if (namespace) where.namespace = namespace;
    if (locale) where.locale = locale;

    const translations = await prisma.translation.findMany({
      where,
      orderBy: [{ namespace: 'asc' }, { key: 'asc' }],
    });

    return NextResponse.json(translations);
  } catch (error) {
    console.error('Error fetching translations:', error);
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { key, locale, value, namespace = 'common' } = body;

    const translation = await prisma.translation.upsert({
      where: {
        key_locale_namespace: {
          key,
          locale,
          namespace,
        },
      },
      update: {
        value,
      },
      create: {
        key,
        locale,
        value,
        namespace,
      },
    });

    return NextResponse.json(translation, { status: 201 });
  } catch (error) {
    console.error('Error creating translation:', error);
    return NextResponse.json({ error: 'Failed to create translation' }, { status: 500 });
  }
}

