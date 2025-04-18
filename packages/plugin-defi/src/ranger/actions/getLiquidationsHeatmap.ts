import { z } from "zod";
import { RANGER_DATA_API_BASE } from "../index";

export const getLiquidationsHeatmapSchema = z.object({
  granularity: z.string().optional(),
});
export type GetLiquidationsHeatmapInput = z.infer<
  typeof getLiquidationsHeatmapSchema
>;

export async function getLiquidationsHeatmap(
  input: GetLiquidationsHeatmapInput,
  apiKey: string
) {
  const params = new URLSearchParams();
  if (input.granularity) params.set("granularity", input.granularity);

  const response = await fetch(
    `${RANGER_DATA_API_BASE}/v1/liquidations/heatmap?${params.toString()}`,
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
      `Get liquidations heatmap request failed: ${error.message}`
    );
  }
  return response.json();
}
