import { z } from "zod";

export const getFundingRatesOiWeightedSchema = z.object({});
export type GetFundingRatesOiWeightedInput = z.infer<
  typeof getFundingRatesOiWeightedSchema
>;

export async function getFundingRatesOiWeighted(
  _input: GetFundingRatesOiWeightedInput,
  apiKey: string,
  baseUrl = "https://data-api-staging-437363704888.asia-northeast1.run.app"
) {
  const response = await fetch(`${baseUrl}/v1/funding_rates/oi_weighted`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Get funding rates oi weighted request failed: ${error.message}`
    );
  }
  return response.json();
}
