import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const setting = await prisma.setting.findUnique({
      where: { key },
    });

    if (!setting) {
      return NextResponse.json({ error: 'Setting not found' }, { status: 404 });
    }

    let value = setting.value;
    // Parse JSON values
    if (setting.type === 'json' || setting.type === 'boolean' || setting.type === 'number') {
      try {
        value = JSON.parse(setting.value);
      } catch {
        // Keep as string if parsing fails
      }
    }

    return NextResponse.json({ ...setting, value });
  } catch (error) {
    console.error('Error fetching setting:', error);
    return NextResponse.json({ error: 'Failed to fetch setting' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    const body = await request.json();
    const { value, type, category, locale } = body;

    // Convert value to string
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);

    const setting = await prisma.setting.upsert({
      where: { key },
      update: {
        value: stringValue,
        type: type || 'text',
        category: category || 'general',
        locale: locale || null,
      },
      create: {
        key,
        value: stringValue,
        type: type || 'text',
        category: category || 'general',
        locale: locale || null,
      },
    });

    let parsedValue = setting.value;
    if (setting.type === 'json' || setting.type === 'boolean' || setting.type === 'number') {
      try {
        parsedValue = JSON.parse(setting.value);
      } catch {
        // Keep as string if parsing fails
      }
    }

    return NextResponse.json({ ...setting, value: parsedValue });
  } catch (error) {
    console.error('Error updating setting:', error);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;
    await prisma.setting.delete({
      where: { key },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting setting:', error);
    return NextResponse.json({ error: 'Failed to delete setting' }, { status: 500 });
  }
}

