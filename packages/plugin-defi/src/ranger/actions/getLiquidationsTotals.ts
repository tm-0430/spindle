import { z } from "zod";
import { RANGER_DATA_API_BASE } from "../index";

export const getLiquidationsTotalsSchema = z.object({});
export type GetLiquidationsTotalsInput = z.infer<
  typeof getLiquidationsTotalsSchema
>;

export async function getLiquidationsTotals(
  _input: GetLiquidationsTotalsInput,
  apiKey: string
) {
  const response = await fetch(
    `${RANGER_DATA_API_BASE}/v1/liquidations/totals`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    }
  );
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Get liquidations totals request failed: ${error.message}`);
  }
  return response.json();
}
