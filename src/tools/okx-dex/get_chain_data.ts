import { SolanaAgentKit } from "../../index";
import { OKXDexClient } from '@okx-dex/okx-dex-sdk';

/**
 * Get chain data from OKX DEX
 * @param agent SolanaAgentKit instance
 * @returns Chain data from OKX DEX
 */
export async function getChainData(agent: SolanaAgentKit): Promise<any> {
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
    
    const chains = await dexClient.dex.getChainData('501');
    return chains;
  } catch (error: any) {
    return {
      status: "error",
      message: error.message || "Failed to get chain data"
    };
  }
}