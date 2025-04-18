import { z } from "zod";

export const getFundingRatesTrendSchema = z.object({
  symbol: z.string(),
  platform: z.string().optional(),
});
export type GetFundingRatesTrendInput = z.infer<
  typeof getFundingRatesTrendSchema
>;

export async function getFundingRatesTrend(
  input: GetFundingRatesTrendInput,
  apiKey: string,
  baseUrl = "https://data-api-staging-437363704888.asia-northeast1.run.app"
) {
  const params = new URLSearchParams();
  params.set("symbol", input.symbol);
  if (input.platform) params.set("platform", input.platform);

  const response = await fetch(
    `${baseUrl}/v1/funding_rates/trend?${params.toString()}`,
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
    throw new Error(`Get funding rates trend request failed: ${error.message}`);
  }
  return response.json();
}
