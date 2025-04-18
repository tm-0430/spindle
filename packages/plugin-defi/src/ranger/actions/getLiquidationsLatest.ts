import { z } from "zod";
import { RANGER_DATA_API_BASE } from "../index";

export const getLiquidationsLatestSchema = z.object({});
export type GetLiquidationsLatestInput = z.infer<
  typeof getLiquidationsLatestSchema
>;

export async function getLiquidationsLatest(
  _input: GetLiquidationsLatestInput,
  apiKey: string
) {
  const response = await fetch(
    `${RANGER_DATA_API_BASE}/v1/liquidations/latest`,
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
    throw new Error(`Get liquidations latest request failed: ${error.message}`);
  }
  return response.json();
}
