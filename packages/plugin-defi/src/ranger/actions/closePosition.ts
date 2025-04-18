import { z } from "zod";
import { RANGER_SOR_API_BASE } from "../index";

export const closePositionSchema = z.object({
  fee_payer: z.string(),
  symbol: z.string(),
  side: z.enum(["Long", "Short"]),
  adjustment_type: z.enum([
    "CloseFlash",
    "CloseJupiter",
    "CloseDrift",
    "CloseAdrena",
    "CloseAll",
  ]),
  slippage_bps: z.number().int().optional(),
  priority_fee_micro_lamports: z.number().int().optional(),
  expected_price: z.number().optional(),
});

export type ClosePositionInput = z.infer<typeof closePositionSchema>;

export async function closePosition(input: ClosePositionInput, apiKey: string) {
  const response = await fetch(`${RANGER_SOR_API_BASE}/v1/close_position`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Close position request failed: ${error.message}`);
  }
  return response.json();
}
