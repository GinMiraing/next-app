import { z } from "zod";

export * from "./login";
export * from "./comment";
export * from "./user";

export const IdSchema = z.number().int().min(0);
