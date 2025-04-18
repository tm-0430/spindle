import { z } from "zod";

export const getFundingRatesAccumulatedSchema = z.object({
  symbol: z.string().optional(),
  granularity: z.string().optional(),
  platform: z.string().optional(),
});
export type GetFundingRatesAccumulatedInput = z.infer<
  typeof getFundingRatesAccumulatedSchema
>;

export async function getFundingRatesAccumulated(
  input: GetFundingRatesAccumulatedInput,
  apiKey: string,
  baseUrl = "https://data-api-staging-437363704888.asia-northeast1.run.app"
) {
  const params = new URLSearchParams();
  if (input.symbol) params.set("symbol", input.symbol);
  if (input.granularity) params.set("granularity", input.granularity);
  if (input.platform) params.set("platform", input.platform);

  const response = await fetch(
    `${baseUrl}/v1/funding_rates/accumulated?${params.toString()}`,
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
      `Get funding rates accumulated request failed: ${error.message}`
    );
  }
  return response.json();
}
