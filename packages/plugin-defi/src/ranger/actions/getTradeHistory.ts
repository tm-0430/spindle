import { z } from "zod";

export const getTradeHistorySchema = z.object({
  public_key: z.string(),
  platforms: z.array(z.string()).optional(),
  symbols: z.array(z.string()).optional(),
  start_time: z.string().optional(),
  end_time: z.string().optional(),
});

export type GetTradeHistoryInput = z.infer<typeof getTradeHistorySchema>;

export async function getTradeHistory(
  input: GetTradeHistoryInput,
  apiKey: string,
  baseUrl = "https://data-api-staging-437363704888.asia-northeast1.run.app"
) {
  const params = new URLSearchParams();
  params.set("public_key", input.public_key);
  if (input.platforms) input.platforms.forEach((p) => params.append("platforms", p));
  if (input.symbols) input.symbols.forEach((s) => params.append("symbols", s));
  if (input.start_time) params.set("start_time", input.start_time);
  if (input.end_time) params.set("end_time", input.end_time);

  const response = await fetch(`${baseUrl}/v1/trade_history?${params.toString()}", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Get trade history request failed: ${error.message}`);
  }
  return response.json();
} 