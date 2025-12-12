
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(value: number, showCurrency: boolean = true): string {
  if (isNaN(value)) return "Đang cập nhật";
  return new Intl.NumberFormat('vi-VN', { 
    style: showCurrency ? 'currency' : 'decimal', 
    currency: 'VND', 
    minimumFractionDigits: 0 
  }).format(value);
}
