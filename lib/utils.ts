import { isAxiosError } from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const formatError = (error: unknown) => {
  if (isAxiosError(error)) {
    return error.response?.data?.error;
  } else if (error instanceof Error) {
    return error.message;
  } else {
    return "unknown error";
  }
};

export const sleep = (time: number) =>
  new Promise((resolve) => setTimeout(resolve, time));
