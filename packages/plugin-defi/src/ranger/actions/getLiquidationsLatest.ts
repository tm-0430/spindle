import { z } from "zod";

export const getLiquidationsLatestSchema = z.object({});
export type GetLiquidationsLatestInput = z.infer<
  typeof getLiquidationsLatestSchema
>;

export async function getLiquidationsLatest(
  _input: GetLiquidationsLatestInput,
  apiKey: string,
  baseUrl = "https://data-api-staging-437363704888.asia-northeast1.run.app"
) {
  const response = await fetch(`${baseUrl}/v1/liquidations/latest`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Get liquidations latest request failed: ${error.message}`);
  }
  return response.json();
}
