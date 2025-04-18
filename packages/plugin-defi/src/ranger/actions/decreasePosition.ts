import { z } from "zod";
import { RANGER_SOR_API_BASE } from "../index";

export const decreasePositionSchema = z.object({
  fee_payer: z.string(),
  symbol: z.string(),
  side: z.enum(["Long", "Short"]),
  size: z.number().positive(),
  collateral: z.number().positive(),
  size_denomination: z.string(),
  collateral_denomination: z.literal("USDC"),
  adjustment_type: z.enum([
    "DecreaseFlash",
    "DecreaseJupiter",
    "DecreaseDrift",
    "DecreaseAdrena",
  ]),
  target_venues: z.array(z.enum(["Jupiter", "Flash", "Drift"])).optional(),
  slippage_bps: z.number().int().optional(),
  priority_fee_micro_lamports: z.number().int().optional(),
  expected_price: z.number().optional(),
});

export type DecreasePositionInput = z.infer<typeof decreasePositionSchema>;

export async function decreasePosition(
  input: DecreasePositionInput,
  apiKey: string
) {
  const response = await fetch(`${RANGER_SOR_API_BASE}/v1/decrease_position`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Decrease position request failed: ${error.message}`);
  }
  return response.json();
}
