import { z } from "zod";
import { RANGER_SOR_API_BASE } from "../index";

export const withdrawBalanceSchema = z.object({
  fee_payer: z.string(),
  symbol: z.string(),
  amount: z.number().positive(),
  sub_account_id: z.number().int().optional(),
  adjustment_type: z.literal("WithdrawBalanceDrift"),
});

export type WithdrawBalanceInput = z.infer<typeof withdrawBalanceSchema>;

export async function withdrawBalance(
  input: WithdrawBalanceInput,
  apiKey: string
) {
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
}
