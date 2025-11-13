# How to Update Contact Information

## Quick Guide

To update your contact information (Instagram, WeChat, WhatsApp), simply edit the file:

**`config/contact.ts`**

## Steps

1. Open the file `config/contact.ts` in your code editor
2. Update the values:
   ```typescript
   export const contactInfo = {
     instagramUrl: 'https://instagram.com/your-actual-instagram',
     wechatId: 'your-actual-wechat-id',
     whatsappNumber: '1234567890', // Include country code
     businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM',
     email: 'your-email@example.com',
   };
   ```

3. Save the file
4. The changes will appear automatically on your website!

## Examples

### Instagram
- Full URL: `https://instagram.com/vaamcarsale`
- Or just username: `vaamcarsale` (we'll add the URL)

### WhatsApp
- Include country code: `1234567890` (for US)
- For other countries: `441234567890` (UK), `861234567890` (China)

### WeChat
- Just the ID: `vaamcarsale123`

## Notes

- WhatsApp number should NOT include the `+` sign
- Instagram can be full URL or just username
- Changes take effect immediately after saving

