export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  mileage?: number | null;
  condition: string;
  transmission?: string | null;
  fuelType?: string | null;
  color?: string | null;
  description?: string | null;
  images: string[];
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CarFormData {
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  mileage?: number;
  condition: string;
  transmission?: string;
  fuelType?: string;
  color?: string;
  description?: string;
  images: string[];
  featured: boolean;
}

