import { z } from "zod";
import { RANGER_DATA_API_BASE } from "../index";

export const getFundingRatesOiWeightedSchema = z.object({});
export type GetFundingRatesOiWeightedInput = z.infer<
  typeof getFundingRatesOiWeightedSchema
>;

export async function getFundingRatesOiWeighted(
  _input: GetFundingRatesOiWeightedInput,
  apiKey: string
) {
  const response = await fetch(
    `${RANGER_DATA_API_BASE}/v1/funding_rates/oi_weighted`,
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
      `Get funding rates oi weighted request failed: ${error.message}`
    );
  }
  return response.json();
}
