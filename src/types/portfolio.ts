import { LifiTokenSchema } from "@/types/lifi";
import { z } from "zod";

export const PortfolioItemSchema = z.object({
  balance: z.string(),
  token: LifiTokenSchema,
});
export type PortfolioItem = z.infer<typeof PortfolioItemSchema>;
