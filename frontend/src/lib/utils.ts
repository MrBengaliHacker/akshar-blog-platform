import type { User } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getUsername = (
  user: Pick<User, 'firstName' | 'lastName' | 'username'>,
): string => {
  const { firstName, lastName, username } = user;

  const fullName = [firstName, lastName].filter(Boolean).join(' ');

  return fullName || username;
};

export const getReadingTime = (content: string): number => {
  const AVG_READING_WPM = 150;

  return Math.ceil(content.split(' ').length / AVG_READING_WPM);
};