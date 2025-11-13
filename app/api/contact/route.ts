import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Your email address where you want to receive messages
const RECIPIENT_EMAIL = process.env.CONTACT_EMAIL || 'sarhanhuseynov77@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      );
    }

    // Check if Resend API key is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      // If no API key, just log the message (for development)
      console.log('Contact form submission (email not configured):', {
        name,
        email,
        phone,
        message,
      });
      console.log('To enable email notifications, add RESEND_API_KEY to your .env.local file');
      console.log('See EMAIL_SETUP.md for instructions');
      
      // Still return success so the form works
      return NextResponse.json(
        { message: 'Message received. Email notifications not configured.' },
        { status: 200 }
      );
    }

    // Initialize Resend only if API key exists
    const resend = new Resend(resendApiKey);

    // Send email using Resend
    const emailSubject = `New Contact Form Message from ${name} - VAAM Motors`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626; border-bottom: 2px solid #dc2626; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        </div>
        
        <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #dc2626; margin: 20px 0;">
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px;">
          <p>This message was sent from the VAAM Motors website contact form.</p>
          <p>You can reply directly to this email to respond to ${name}.</p>
        </div>
      </div>
    `;

    const emailText = `
New Contact Form Submission

Name: ${name}
Email: ${email}
${phone ? `Phone: ${phone}` : ''}

Message:
${message}

---
This message was sent from the VAAM Motors website contact form.
You can reply directly to this email to respond to ${name}.
    `;

    // Send email
    const { data, error } = await resend.emails.send({
      from: 'VAAM Motors <onboarding@resend.dev>', // You'll need to verify your domain with Resend
      to: RECIPIENT_EMAIL,
      replyTo: email, // So you can reply directly to the customer
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later.' },
        { status: 500 }
      );
    }

    console.log('Email sent successfully:', data);

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

