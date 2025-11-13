import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all settings or filtered by category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const locale = searchParams.get('locale');

    const where: any = {};
    if (category) where.category = category;
    if (locale) where.locale = locale;

    const settings = await prisma.setting.findMany({
      where,
      orderBy: { category: 'asc' },
    });

    // Convert to key-value object for easier access
    const settingsObj: Record<string, any> = {};
    settings.forEach((setting) => {
      let value = setting.value;
      // Parse JSON values
      if (setting.type === 'json' || setting.type === 'boolean' || setting.type === 'number') {
        try {
          value = JSON.parse(setting.value);
        } catch {
          // Keep as string if parsing fails
        }
      }
      settingsObj[setting.key] = value;
    });

    return NextResponse.json(settingsObj);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

// POST - Create or update settings (bulk)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const settings = Array.isArray(body) ? body : [body];

    const results = await Promise.all(
      settings.map(async (setting: any) => {
        const { key, value, type = 'text', category = 'general', locale = null } = setting;

        // Convert value to string
        let stringValue = typeof value === 'string' ? value : JSON.stringify(value);

        return await prisma.setting.upsert({
          where: { key },
          update: {
            value: stringValue,
            type,
            category,
            locale,
          },
          create: {
            key,
            value: stringValue,
            type,
            category,
            locale,
          },
        });
      })
    );

    return NextResponse.json({ success: true, settings: results });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

