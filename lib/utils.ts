import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function parseImages(images: string | string[] | any): string[] {
  if (!images) return [];
  
  if (Array.isArray(images)) {
    return images.filter((img) => img && typeof img === 'string');
  }
  
  if (typeof images === 'string') {
    try {
      const parsed = JSON.parse(images);
      if (Array.isArray(parsed)) {
        return parsed.filter((img) => img && typeof img === 'string');
      }
      return [];
    } catch {
      return [];
    }
  }
  
  return [];
}

export function stringifyImages(images: string[]): string {
  return JSON.stringify(images);
}

