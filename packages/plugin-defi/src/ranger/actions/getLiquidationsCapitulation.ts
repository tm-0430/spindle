import { z } from "zod";

export const getLiquidationsCapitulationSchema = z.object({
  granularity: z.string().optional(),
  threshold: z.number().optional(),
});
export type GetLiquidationsCapitulationInput = z.infer<
  typeof getLiquidationsCapitulationSchema
>;

export async function getLiquidationsCapitulation(
  input: GetLiquidationsCapitulationInput,
  apiKey: string,
  baseUrl = "https://data-api-staging-437363704888.asia-northeast1.run.app"
) {
  const params = new URLSearchParams();
  if (input.granularity) params.set("granularity", input.granularity);
  if (input.threshold !== undefined)
    params.set("threshold", input.threshold.toString());

  const response = await fetch(
    `${baseUrl}/v1/liquidations/capitulation?${params.toString()}`,
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
      `Get liquidations capitulation request failed: ${error.message}`
    );
  }
  return response.json();
}
