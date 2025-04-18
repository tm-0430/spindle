import { z } from "zod";
import { RANGER_DATA_API_BASE } from "../index";

export const getFundingRateArbsSchema = z.object({
  min_diff: z.number().optional(),
});
export type GetFundingRateArbsInput = z.infer<typeof getFundingRateArbsSchema>;

export async function getFundingRateArbs(
  input: GetFundingRateArbsInput,
  apiKey: string
) {
  const params = new URLSearchParams();
  if (input.min_diff !== undefined)
    params.set("min_diff", input.min_diff.toString());

  const response = await fetch(
    `${RANGER_DATA_API_BASE}/v1/funding_rates/arbs?${params.toString()}`,
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
    throw new Error(`Get funding rate arbs request failed: ${error.message}`);
  }
  return response.json();
}
