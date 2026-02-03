import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Unisce le classi CSS risolvendo i conflitti di Tailwind.
 * Esempio: cn("bg-red-500", condizione && "bg-blue-500") -> vince "bg-blue-500"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}