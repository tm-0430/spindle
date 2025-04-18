import { z } from "zod";
import { RANGER_SOR_API_BASE } from "../index";

export const increasePositionSchema = z.object({
  fee_payer: z.string(),
  symbol: z.string(),
  side: z.enum(["Long", "Short"]),
  size: z.number().positive(),
  collateral: z.number().positive(),
  size_denomination: z.string(),
  collateral_denomination: z.literal("USDC"),
  adjustment_type: z.literal("Increase"),
  target_venues: z.array(z.enum(["Jupiter", "Flash", "Drift"])).optional(),
  slippage_bps: z.number().int().optional(),
  priority_fee_micro_lamports: z.number().int().optional(),
  expected_price: z.number().optional(),
});

export type IncreasePositionInput = z.infer<typeof increasePositionSchema>;

export async function increasePosition(
  input: IncreasePositionInput,
  apiKey: string
) {
  const response = await fetch(`${RANGER_SOR_API_BASE}/v1/increase_position`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Increase position request failed: ${error.message}`);
  }
  return response.json();
}
