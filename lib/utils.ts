import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type HexColor = `#${string}`;
export const DEFAULT_COLORS = [
  "#7AC555",
  "#760DDE",
  "#FFA500",
  "#76A5EA",
  "#FF6B6B",
  "#4ECDC4",
  "#FFD93D",
  "#5F6CAF",
  "#D7263D",
] as const satisfies HexColor[];

export function getColorByString(value: string, colorArray: readonly string[]) {
  let hash = 2166136261;

  for (let i = 0; i < value.length; i++) {
    hash ^= value.charCodeAt(i);
    hash *= 16777619;
  }

  const index = Math.abs(hash) % colorArray.length;
  return colorArray[index];
}
