import { z } from "zod";

export const getLiquidationsTotalsSchema = z.object({});
export type GetLiquidationsTotalsInput = z.infer<
  typeof getLiquidationsTotalsSchema
>;

export async function getLiquidationsTotals(
  _input: GetLiquidationsTotalsInput,
  apiKey: string,
  baseUrl = "https://data-api-staging-437363704888.asia-northeast1.run.app"
) {
  const response = await fetch(`${baseUrl}/v1/liquidations/totals`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Get liquidations totals request failed: ${error.message}`);
  }
  return response.json();
}
