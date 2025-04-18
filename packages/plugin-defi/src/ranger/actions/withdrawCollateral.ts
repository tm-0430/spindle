import { z } from "zod";
import { RANGER_SOR_API_BASE } from "../index";

export const withdrawCollateralSchema = z.object({
  fee_payer: z.string(),
  symbol: z.string(),
  side: z.enum(["Long", "Short"]),
  collateral: z.number().positive(),
  collateral_denomination: z.literal("USDC"),
  adjustment_type: z.enum([
    "WithdrawCollateralFlash",
    "WithdrawCollateralJupiter",
    "WithdrawCollateralDrift",
  ]),
});

export type WithdrawCollateralInput = z.infer<typeof withdrawCollateralSchema>;

export async function withdrawCollateral(
  input: WithdrawCollateralInput,
  apiKey: string
) {
  const response = await fetch(
    `${RANGER_SOR_API_BASE}/v1/withdraw_collateral`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(input),
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Withdraw collateral request failed: ${error.message}`);
  }
  return response.json();
}
