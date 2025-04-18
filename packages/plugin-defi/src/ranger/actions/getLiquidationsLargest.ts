import { z } from "zod";

export const getLiquidationsLargestSchema = z.object({
  granularity: z.string().optional(),
  limit: z.number().int().optional(),
});
export type GetLiquidationsLargestInput = z.infer<
  typeof getLiquidationsLargestSchema
>;

export async function getLiquidationsLargest(
  input: GetLiquidationsLargestInput,
  apiKey: string,
  baseUrl = "https://data-api-staging-437363704888.asia-northeast1.run.app"
) {
  const params = new URLSearchParams();
  if (input.granularity) params.set("granularity", input.granularity);
  if (input.limit !== undefined) params.set("limit", input.limit.toString());

  const response = await fetch(
    `${baseUrl}/v1/liquidations/largest?${params.toString()}`,
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
      `Get liquidations largest request failed: ${error.message}`
    );
  }
  return response.json();
}
