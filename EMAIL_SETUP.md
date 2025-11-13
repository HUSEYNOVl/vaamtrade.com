# Email Setup Guide

This guide will help you set up email notifications for contact form submissions.

## Quick Setup (5 minutes)

### Step 1: Create Resend Account

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day free)
3. Verify your email address

### Step 2: Get API Key

1. In Resend dashboard, go to **API Keys**
2. Click **Create API Key**
3. Name it "VAAM Car Sale" (or any name)
4. Copy the API key (starts with `re_`)

### Step 3: Add to Environment Variables

Create a `.env.local` file in your project root (if it doesn't exist):

```bash
# Email Configuration
RESEND_API_KEY="re_your_actual_api_key_here"
CONTACT_EMAIL="sarhanhuseynov77@gmail.com"
```

**Important:** 
- Replace `re_your_actual_api_key_here` with your actual Resend API key
- The contact email is already set to your email: `sarhanhuseynov77@gmail.com`

### Step 4: Verify Your Domain (Optional but Recommended)

For production, you should verify your domain with Resend:

1. In Resend dashboard → **Domains**
2. Click **Add Domain**
3. Enter your domain (e.g., `vaamcarsale.com`)
4. Add the DNS records shown to your domain registrar
5. Wait for verification (usually a few minutes)

Once verified, update the `from` email in `app/api/contact/route.ts`:
```typescript
from: 'VAAM Car Sale <noreply@yourdomain.com>',
```

### Step 5: Test

1. Restart your development server:
```bash
npm run dev
```

2. Go to your contact page
3. Fill out and submit the form
4. Check your email inbox!

---

## For Production Deployment

When deploying to Vercel or other platforms:

1. Go to your project settings
2. Add environment variables:
   - `RESEND_API_KEY` = your Resend API key
   - `CONTACT_EMAIL` = `sarhanhuseynov77@gmail.com`

---

## Troubleshooting

### Emails Not Sending?

1. **Check API Key**: Make sure `RESEND_API_KEY` is set correctly
2. **Check Email**: Verify `CONTACT_EMAIL` is correct
3. **Check Resend Dashboard**: Look for errors in Resend dashboard
4. **Check Console**: Look for error messages in your server logs

### Using Default "onboarding@resend.dev"

- This works for testing but has limitations
- You can only send to verified email addresses
- For production, verify your domain

### Free Tier Limits

- Resend free tier: 100 emails/day
- Perfect for small businesses
- Upgrade if you need more

---

## Alternative Email Services

If you prefer other services:

### SendGrid
- Free tier: 100 emails/day
- Update `app/api/contact/route.ts` to use SendGrid SDK

### Nodemailer (Gmail/SMTP)
- Works with Gmail, Outlook, etc.
- Requires SMTP credentials
- Update `app/api/contact/route.ts` to use Nodemailer

---

## Current Configuration

- **Recipient Email**: `sarhanhuseynov77@gmail.com`
- **Service**: Resend
- **Status**: Ready to configure

Just add your Resend API key and you're done! 🎉

