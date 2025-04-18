import { z } from "zod";
import { RANGER_SOR_API_BASE } from "../index";

export const depositCollateralSchema = z.object({
  fee_payer: z.string(),
  symbol: z.string(),
  side: z.enum(["Long", "Short"]),
  collateral: z.number().positive(),
  collateral_denomination: z.literal("USDC"),
  adjustment_type: z.enum([
    "DepositCollateralFlash",
    "DepositCollateralJupiter",
    "DepositCollateralDrift",
  ]),
});

export type DepositCollateralInput = z.infer<typeof depositCollateralSchema>;

export async function depositCollateral(
  input: DepositCollateralInput,
  apiKey: string
) {
  const response = await fetch(`${RANGER_SOR_API_BASE}/v1/deposit_collateral`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Deposit collateral request failed: ${error.message}`);
  }
  return response.json();
}
