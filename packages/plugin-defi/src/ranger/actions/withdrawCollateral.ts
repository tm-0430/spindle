import { z } from "zod";
import { RANGER_SOR_API_BASE } from "../index";
import { Action } from "solana-agent-kit";

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

export const withdrawCollateralAction: Action = {
  name: "WITHDRAW_COLLATERAL",
  similes: ["withdraw collateral", "remove margin", "remove funds"],
  description:
    "Withdraw collateral from a perp position using the Ranger SOR API.",
  examples: [
    [
      {
        input: {
          fee_payer: "YOUR_PUBLIC_KEY",
          symbol: "SOL",
          side: "Long",
          collateral: 50.0,
          collateral_denomination: "USDC",
          adjustment_type: "WithdrawCollateralFlash",
        },
        output: { message: "...", meta: { venues: [] } },
        explanation:
          "Withdraw 50 USDC collateral from a long SOL position via Flash.",
      },
    ],
  ],
  schema: withdrawCollateralSchema,
  handler: async (_agent, input, { apiKey }) => {
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
  },
};
