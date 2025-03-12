import { SolanaAgentKit } from "../../index";
import { OKXDexClient } from '@okx-dex/okx-dex-sdk';

/**
 * Get quote for token swap on OKX DEX
 * @param agent SolanaAgentKit instance
 * @param fromTokenAddress Source token address
 * @param toTokenAddress Target token address
 * @param amount Amount to swap in base units
 * @param slippage Slippage tolerance (optional)
 * @returns Quote response
 */
export async function getQuote(
  agent: SolanaAgentKit,
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: string,
  slippage: string = "0.5"
): Promise<any> {
  try {
    // Validate the required config parameters are present
    if (!agent.config.OKX_API_KEY || 
        !agent.config.OKX_SECRET_KEY || 
        !agent.config.OKX_API_PASSPHRASE || 
        !agent.config.OKX_PROJECT_ID) {
      throw new Error("Missing required OKX DEX configuration in agent config");
    }

    // Initialize OKX DEX client using agent's config
    const dexClient = new OKXDexClient({
      apiKey: agent.config.OKX_API_KEY,
      secretKey: agent.config.OKX_SECRET_KEY,
      apiPassphrase: agent.config.OKX_API_PASSPHRASE,
      projectId: agent.config.OKX_PROJECT_ID,
      solana: {
        connection: {
          rpcUrl: agent.connection.rpcEndpoint,
          confirmTransactionInitialTimeout: 60000
        },
        privateKey: Buffer.from(agent.wallet.secretKey).toString('base64'),
        walletAddress: agent.wallet_address.toString()
      }
    });
    
    const quote = await dexClient.dex.getQuote({
      chainId: '501',
      fromTokenAddress,
      toTokenAddress,
      amount,
      slippage
    });
    return quote;
  } catch (error: any) {
    return {
      status: "error",
      message: error.message || "Failed to get quote"
    };
  }
}