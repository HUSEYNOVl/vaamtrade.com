# How to Add Cars to Your Website

## Quick Steps

1. **Go to Admin Panel**
   - Visit: `http://localhost:3000/admin`
   - Or click "Admin Panel" link in the footer

2. **Login**
   - Password: `admin123` (default)
   - You can change this in the `.env` file

3. **Add a Car**
   - Click "Add New Car" button
   - Fill in the car details:
     - **Make** (required): e.g., Toyota, BMW, Mercedes
     - **Model** (required): e.g., Camry, X5, C-Class
     - **Year** (required): e.g., 2020
     - **Price** (required): e.g., 25000
     - **Currency**: USD, EUR, GBP, CNY, or RUB
     - **Condition**: New or Used
     - **Mileage**: Optional (for used cars)
     - **Transmission**: Automatic or Manual
     - **Fuel Type**: Petrol, Diesel, Electric, or Hybrid
     - **Color**: Optional
     - **Description**: Optional details about the car
     - **Images**: Add image URLs (one at a time)
     - **Featured**: Check if you want to highlight this car

4. **Save**
   - Click "Create Car"
   - The car will appear on your homepage immediately!

## Tips

- **Image URLs**: You can use images from:
  - Image hosting services (Imgur, Cloudinary, etc.)
  - Your own server
  - Any publicly accessible image URL

- **To Edit or Delete**: 
  - Go to "Manage Cars" in admin panel
  - Click "Edit" to modify a car
  - Click "Delete" to remove a car

## Change Admin Password

Edit the `.env` file and change:
```
ADMIN_PASSWORD="your-new-password"
NEXT_PUBLIC_ADMIN_PASSWORD="your-new-password"
```

Then restart the server.

