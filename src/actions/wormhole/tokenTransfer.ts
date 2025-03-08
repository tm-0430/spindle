import { SolanaAgentKit } from "../../agent";
import { TokenTransferInput } from "../../types";
import { z } from "zod";
import { Action } from "../../types/action";

export const tokenTransferAction: Action = {
  name: "token_transfer",
  description: "Transfer a token from Solana to another chain",

  similes: [
    "transfer token",
    "transfer 0.1 sol to BaseSepolia",
    "transfer 0.1 sol to BaseMainnet",

    "transfer 0.1 sol to Avalanche Mainnet",
  ],
  examples: [
    [
      {
        input: {
          destinationChain: "BaseSepolia",
          transferAmount: "0.1",
          network: "Testnet",
        },
        output: {
          status: "success",
          message: "Token transferred successfully",
        },
        explanation: "Transfer 0.1 sol to BaseSepolia",
      },
    ],
  ],

  schema: z.object({
    destinationChain: z.string(),
    network: z.string(),
    transferAmount: z.string(),
    tokenAddress: z.string().optional(),
  }),

  handler: async (agent: SolanaAgentKit, input: Record<string, any>) => {
    const result = await agent.tokenTransfer(input as TokenTransferInput);
    return result;
  },
};

export default tokenTransferAction;
