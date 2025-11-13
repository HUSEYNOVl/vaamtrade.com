# Environment Variables Setup

Create a `.env.local` file in your project root with these variables:

```bash
# Database
DATABASE_URL="file:./prisma/dev.db"

# Admin Panel Password
ADMIN_PASSWORD="your-secure-password-here"

# Email Configuration (Required for contact form)
# Get your API key from https://resend.com/api-keys
RESEND_API_KEY="re_your_api_key_here"

# Contact Email (where you receive contact form messages)
CONTACT_EMAIL="sarhanhuseynov77@gmail.com"
```

## Quick Setup Steps:

1. **Get Resend API Key:**
   - Go to https://resend.com
   - Sign up (free - 100 emails/day)
   - Go to API Keys → Create API Key
   - Copy the key (starts with `re_`)

2. **Create `.env.local` file:**
   - In your project root directory
   - Add the variables above
   - Replace `re_your_api_key_here` with your actual key

3. **Restart your server:**
   ```bash
   npm run dev
   ```

4. **Test it:**
   - Go to contact page
   - Submit the form
   - Check your email!

See `EMAIL_SETUP.md` for detailed instructions.

