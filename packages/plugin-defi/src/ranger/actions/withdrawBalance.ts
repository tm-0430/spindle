import { z } from "zod";
import { RANGER_SOR_API_BASE } from "../index";
import { Action } from "solana-agent-kit";

export const withdrawBalanceSchema = z.object({
  fee_payer: z.string(),
  symbol: z.string(),
  amount: z.number().positive(),
  sub_account_id: z.number().int().optional(),
  adjustment_type: z.literal("WithdrawBalanceDrift"),
});

export type WithdrawBalanceInput = z.infer<typeof withdrawBalanceSchema>;

export const withdrawBalanceAction: Action = {
  name: "WITHDRAW_BALANCE",
  similes: ["withdraw balance", "withdraw funds", "withdraw drift"],
  description:
    "Withdraw available balance from a Drift account using the Ranger SOR API.",
  examples: [
    [
      {
        input: {
          fee_payer: "YOUR_PUBLIC_KEY",
          symbol: "USDC",
          amount: 100.0,
          sub_account_id: 0,
          adjustment_type: "WithdrawBalanceDrift",
        },
        output: {
          message: "...",
          meta: { venue: "Drift", amount: 100.0, symbol: "USDC" },
        },
        explanation: "Withdraw 100 USDC from Drift.",
      },
    ],
  ],
  schema: withdrawBalanceSchema,
  handler: async (_agent, input, { apiKey }) => {
    const response = await fetch(`${RANGER_SOR_API_BASE}/v1/withdraw_balance`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
      body: JSON.stringify(input),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Withdraw balance request failed: ${error.message}`);
    }
    return response.json();
  },
};
