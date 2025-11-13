import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import { join } from 'path';

const CONTACT_CONFIG_PATH = join(process.cwd(), 'config', 'contact.ts');

export async function GET() {
  try {
    // Read the config file
    const fileContent = await readFile(CONTACT_CONFIG_PATH, 'utf-8');
    
    // Extract the contactInfo object using regex
    const match = fileContent.match(/export const contactInfo = ({[\s\S]*?});/);
    if (!match) {
      return NextResponse.json({ error: 'Could not parse config file' }, { status: 500 });
    }

    // Parse the object (simple parsing - for production, use a proper parser)
    const contactInfo: any = {};
    const instagramMatch = fileContent.match(/instagramUrl:\s*['"]([^'"]+)['"]/);
    const wechatMatch = fileContent.match(/wechatId:\s*['"]([^'"]+)['"]/);
    const whatsappMatch = fileContent.match(/whatsappNumber:\s*['"]([^'"]+)['"]/);
    const hoursMatch = fileContent.match(/businessHours:\s*['"]([^'"]+)['"]/);
    const emailMatch = fileContent.match(/email:\s*['"]([^'"]+)['"]/);

    if (instagramMatch) contactInfo.instagramUrl = instagramMatch[1];
    if (wechatMatch) contactInfo.wechatId = wechatMatch[1];
    if (whatsappMatch) contactInfo.whatsappNumber = whatsappMatch[1];
    if (hoursMatch) contactInfo.businessHours = hoursMatch[1];
    if (emailMatch) contactInfo.email = emailMatch[1];

    return NextResponse.json(contactInfo);
  } catch (error) {
    console.error('Error reading contact info:', error);
    return NextResponse.json({ error: 'Failed to read contact info' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { instagramUrl, wechatId, whatsappNumber, businessHours, email } = body;

    // Create the new config file content
    const newContent = `// Contact Information Configuration
// Edit these values to update your contact information

export const contactInfo = {
  instagramUrl: '${instagramUrl || ''}',
  wechatId: '${wechatId || ''}',
  whatsappNumber: '${whatsappNumber || ''}', // Include country code, e.g., '1234567890' for US
  businessHours: '${businessHours || ''}',
  email: '${email || ''}', // Optional: for contact form
};
`;

    // Write the new config file
    await writeFile(CONTACT_CONFIG_PATH, newContent, 'utf-8');

    return NextResponse.json({ message: 'Contact information updated successfully' });
  } catch (error) {
    console.error('Error updating contact info:', error);
    return NextResponse.json({ error: 'Failed to update contact info' }, { status: 500 });
  }
}

