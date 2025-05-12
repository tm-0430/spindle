// okx/actions/OkxDexQuote.ts
import { Action } from "solana-agent-kit";
import { z } from "zod";
import { okx_dex_quote } from "../tools";

const OkxDexQuote: Action = {
  name: "OKX_DEX_QUOTE",
  similes: ["get quote", "check price", "okx dex quote", "swap price"],
  description: "Get a quote for swapping tokens on OKX DEX.",
  examples: [
    [
      {
        input: {
          fromToken: "sol",
          toToken: "usdc",
          amount: 0.1,
        },
        output: {
          status: "success",
          summary: {
            fromToken: "SOL",
            toToken: "USDC",
            fromAmount: 0.1,
            toAmount: 10.5,
            exchangeRate: 105,
            priceImpact: "0.01%",
          },
        },
        explanation: "Getting a quote for swapping 0.1 SOL to USDC",
      },
    ],
  ],
  schema: z.object({
    fromToken: z.string().describe("Source token symbol or address"),
    toToken: z.string().describe("Target token symbol or address"),
    amount: z.number().describe("Amount to swap"),
    slippage: z
      .string()
      .optional()
      .describe("Slippage tolerance (default: 0.5%)"),
  }),
  handler: async (agent, input) => {
    try {
      const { fromToken, toToken, amount, slippage } = input;
      
      // Convert amount to base units based on token decimals
      let baseUnits;
      if (fromToken.toLowerCase() === "sol") {
        baseUnits = (amount * 1e9).toString(); // SOL has 9 decimals
      } else {
        baseUnits = (amount * 1e6).toString(); // Most tokens have 6 decimals
      }
      
      // Call the quote tool function
      return await okx_dex_quote(
        fromToken,
        toToken,
        baseUnits,
        slippage,
      );
    } catch (error: any) {
      return {
        status: "error",
        message: `OKX DEX quote failed: ${error.message}`,
      };
    }
  },
};

export default OkxDexQuote;