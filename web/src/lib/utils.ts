import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility for merging class names with Tailwind CSS conflict resolution
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number with appropriate precision
 */
export function formatNumber(value: number, decimals: number = 2): string {
  if (value === 0) return "0";
  if (Math.abs(value) < 0.01) return value.toExponential(decimals);
  return value.toFixed(decimals);
}

/**
 * Clamp a value between min and max
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
