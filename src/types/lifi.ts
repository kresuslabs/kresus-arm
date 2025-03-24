import { z } from "zod";

export const LifiTokenSchema = z.object({
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number(),
  logoURI: z.string().nullable().optional(),
  chainId: z.number(),
  priceUSD: z.string().nullable(),
});
export type LifiToken = z.infer<typeof LifiTokenSchema>;
