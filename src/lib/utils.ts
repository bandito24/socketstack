import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getAvatarLetters(name: string): string {
  if (!name) return "";

  // Split by spaces, filter out empty parts
  const words = name
      .trim()
      .split(/[^a-zA-Z0-9]+/)
      .filter(Boolean);

  // Case 1: two or more words → use first letter of each
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  // Case 2: one word → take first two letters
  const firstWord = words[0];
  return firstWord.substring(0, 2).toUpperCase();
}
