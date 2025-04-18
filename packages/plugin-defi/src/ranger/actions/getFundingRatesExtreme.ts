import { z } from "zod";
import { RANGER_DATA_API_BASE } from "../index";

export const getFundingRatesExtremeSchema = z.object({
  granularity: z.string().optional(),
  limit: z.number().int().optional(),
});
export type GetFundingRatesExtremeInput = z.infer<
  typeof getFundingRatesExtremeSchema
>;

export async function getFundingRatesExtreme(
  input: GetFundingRatesExtremeInput,
  apiKey: string
) {
  const params = new URLSearchParams();
  if (input.granularity) params.set("granularity", input.granularity);
  if (input.limit !== undefined) params.set("limit", input.limit.toString());

  const response = await fetch(
    `${RANGER_DATA_API_BASE}/v1/funding_rates/extreme?${params.toString()}`,
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
    throw new Error(
      `Get funding rates extreme request failed: ${error.message}`
    );
  }
  return response.json();
}
