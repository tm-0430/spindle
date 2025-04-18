import { z } from "zod";

export const getBorrowRatesAccumulatedSchema = z.object({
  symbol: z.string().optional(),
  granularity: z.string().optional(),
  platform: z.string().optional(),
});
export type GetBorrowRatesAccumulatedInput = z.infer<
  typeof getBorrowRatesAccumulatedSchema
>;

export async function getBorrowRatesAccumulated(
  input: GetBorrowRatesAccumulatedInput,
  apiKey: string,
  baseUrl = "https://data-api-staging-437363704888.asia-northeast1.run.app"
) {
  const params = new URLSearchParams();
  if (input.symbol) params.set("symbol", input.symbol);
  if (input.granularity) params.set("granularity", input.granularity);
  if (input.platform) params.set("platform", input.platform);

  const response = await fetch(
    `${baseUrl}/v1/borrow_rates/accumulated?${params.toString()}`,
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
      `Get borrow rates accumulated request failed: ${error.message}`
    );
  }
  return response.json();
}
