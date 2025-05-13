import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format date to YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

// Format date to YYYY-MM-DD HH:MM:SS
export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${date.toTimeString().split(' ')[0]}`;
}
