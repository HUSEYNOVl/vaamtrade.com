# Quick Start Guide

## 🚗 How to Add Cars

1. **Go to Admin Panel**: `http://localhost:3000/admin`
2. **Login**: Password is `admin123` (default)
3. **Click "Add New Car"**
4. **Fill in the details** and add image URLs
5. **Click "Create Car"** - it will appear on your homepage immediately!

**See `HOW_TO_ADD_CARS.md` for detailed instructions.**

---

## 📞 How to Update Contact Information

1. **Open the file**: `config/contact.ts`
2. **Edit the values**:
   ```typescript
   export const contactInfo = {
     instagramUrl: 'your-instagram-username',  // or full URL
     wechatId: 'your-wechat-id',
     whatsappNumber: '1234567890',  // with country code
     businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM',
   };
   ```
3. **Save the file** - changes appear automatically!

**See `HOW_TO_UPDATE_CONTACT.md` for detailed instructions.**

---

## 🔑 Admin Panel Access

- **URL**: `http://localhost:3000/admin`
- **Default Password**: `admin123`
- **Change Password**: Edit `.env` file

---

## 📝 Notes

- **Instagram**: You can use just the username (e.g., `vaamcarsale`) or full URL
- **WhatsApp**: Include country code without `+` (e.g., `1234567890` for US)
- **Images**: Use publicly accessible image URLs (Imgur, Cloudinary, etc.)

