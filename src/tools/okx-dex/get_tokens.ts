import { SolanaAgentKit } from "../../index";
import { OKXDexClient } from '@okx-dex/okx-dex-sdk';

/**
 * Get list of tokens supported by OKX DEX
 * @param agent SolanaAgentKit instance
 * @returns List of supported tokens
 */
export async function getTokens(agent: SolanaAgentKit): Promise<any> {
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

    const tokens = await dexClient.dex.getTokens('501');

    // Format the token list for better readability
    const formattedTokens = tokens.data.map((token: any) => ({
      symbol: token.symbol,
      name: token.name,
      address: token.address,
      decimals: token.decimal
    }));

    return {
      status: "success",
      summary: `Found ${formattedTokens.length} tokens on Solana via OKX DEX`,
      tokens: formattedTokens.slice(0, 10), // Include first 10 tokens in summary
      data: tokens
    };
  } catch (error: any) {
    return {
      status: "error",
      message: error.message || "Failed to get tokens"
    };
  }
}