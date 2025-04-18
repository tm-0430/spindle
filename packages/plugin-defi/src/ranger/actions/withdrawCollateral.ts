import { z } from "zod";

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
  apiKey: string,
  baseUrl = "https://staging-sor-api-437363704888.asia-northeast1.run.app"
) {
  const response = await fetch(`${baseUrl}/v1/withdraw_collateral`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Withdraw collateral request failed: ${error.message}`);
  }
  return response.json();
}
