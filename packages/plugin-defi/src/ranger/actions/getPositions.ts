import { z } from "zod";

export const getPositionsSchema = z.object({
  public_key: z.string().describe("User's Solana wallet address."),
  platforms: z
    .array(z.enum(["DRIFT", "FLASH", "JUPITER", "ADRENA"]))
    .optional()
    .describe("Optional list of platforms to filter by."),
  symbols: z
    .array(z.string())
    .optional()
    .describe(
      "Optional list of symbols to filter by (e.g., ['SOL-PERP', 'BTC-PERP'])."
    ),
  from: z
    .string()
    .datetime()
    .optional()
    .describe(
      "Optional earliest position date (ISO 8601 format) to fetch (defaults to 2 days ago in API)."
    ),
});

export type GetPositionsInput = z.infer<typeof getPositionsSchema>;

export async function getPositions(
  input: GetPositionsInput,
  apiKey: string,
  baseUrl = "https://data-api-staging-437363704888.asia-northeast1.run.app"
) {
  const params = new URLSearchParams();
  params.set("public_key", input.public_key);
  if (input.platforms)
    input.platforms.forEach((p) => params.append("platforms", p));
  if (input.symbols) input.symbols.forEach((s) => params.append("symbols", s));
  if (input.from) params.set("from", input.from);

  const response = await fetch(`${baseUrl}/v1/positions?${params.toString()}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Get positions request failed: ${error.message}`);
  }
  return response.json();
}
