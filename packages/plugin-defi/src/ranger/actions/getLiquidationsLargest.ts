import { z } from "zod";
import { RANGER_DATA_API_BASE } from "../index";

export const getLiquidationsLargestSchema = z.object({
  granularity: z.string().optional(),
  limit: z.number().int().optional(),
});
export type GetLiquidationsLargestInput = z.infer<
  typeof getLiquidationsLargestSchema
>;

export async function getLiquidationsLargest(
  input: GetLiquidationsLargestInput,
  apiKey: string
) {
  const params = new URLSearchParams();
  if (input.granularity) params.set("granularity", input.granularity);
  if (input.limit !== undefined) params.set("limit", input.limit.toString());

  const response = await fetch(
    `${RANGER_DATA_API_BASE}/v1/liquidations/largest?${params.toString()}`,
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
