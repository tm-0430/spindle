// src/actions/okx-dex/chains_action.ts
import { Action } from "../../types/action";
import { SolanaAgentKit } from "../../agent";
import { z } from "zod";
import { getChains } from "../../tools/okx-dex";

const okxDexChainsAction: Action = {
  name: "OKX_DEX_CHAINS",
  similes: ["get chain data", "okx dex chain data"],
  description: "Get chain data from OKX DEX.",
  examples: [[
    {
      input: {},
      output: {
        status: "success",
        summary: {
          chains: [
            {
              symbol: "SOL",
              name: "Solana",
              address: "So11111111111111111111111111111111111111112"
            }
          ]
        }
      },
      explanation: "Getting chain data from OKX DEX"
    }
  ]],
  schema: z.object({}),
  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const chains = await getChains(agent);
    return {
      status: "success",
      summary: {
        chains: chains
      }
    };
  }
};

export default okxDexChainsAction;