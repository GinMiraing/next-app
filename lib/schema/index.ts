import { z } from "zod";

export * from "./login";

export const IdSchema = z.number().int().min(0);
