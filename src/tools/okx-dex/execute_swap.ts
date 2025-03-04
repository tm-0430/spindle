import { SolanaAgentKit } from "../../index";
import { OKXDexClient } from '@okx-dex/okx-dex-sdk';
import * as dotenv from "dotenv";

dotenv.config();

// Initialize the OKX DEX client
const initDexClient = () => {
  return new OKXDexClient({
    apiKey: process.env.OKX_API_KEY!,
    secretKey: process.env.OKX_SECRET_KEY!,
    apiPassphrase: process.env.OKX_API_PASSPHRASE!,
    projectId: process.env.OKX_PROJECT_ID!,
    solana: {
      connection: {
        rpcUrl: process.env.RPC_URL!,
        confirmTransactionInitialTimeout: 60000
      },
      privateKey: process.env.OKX_SOLANA_PRIVATE_KEY!,
      walletAddress: process.env.OKX_SOLANA_WALLET_ADDRESS!
    }
  });
};

/**
 * Execute a token swap on OKX DEX
 * @param agent SolanaAgentKit instance
 * @param fromTokenAddress Source token address
 * @param toTokenAddress Target token address
 * @param amount Amount to swap (in token base units)
 * @param slippage Slippage tolerance as a decimal (default: 0.005 = 0.5%)
 * @param autoSlippage Use auto slippage (default: true)
 * @param maxAutoSlippageBps Maximum auto slippage in basis points (default: 100 = 1%)
 * @returns Swap result with transaction ID
 */
export async function executeSwap(
  agent: SolanaAgentKit,
  fromTokenAddress: string,
  toTokenAddress: string,
  amount: string,
  slippage: string = "0.005",
  autoSlippage: boolean = true,
  maxAutoSlippageBps: string = "100"
): Promise<any> {
  try {
    // Initialize a new OKX DEX client
    const dexClient = initDexClient();

    // First get token info for better reporting
    const quote = await dexClient.dex.getQuote({
      chainId: '501',
      fromTokenAddress,
      toTokenAddress,
      amount,
      slippage: autoSlippage ? "0" : slippage
    });

    const quoteData = quote.data[0];
    const fromAmount = parseFloat(quoteData.fromTokenAmount) / Math.pow(10, parseInt(quoteData.fromToken.decimal));
    const toAmount = parseFloat(quoteData.toTokenAmount) / Math.pow(10, parseInt(quoteData.toToken.decimal));

    // Execute the swap
    const swapResult = await dexClient.dex.executeSwap({
      chainId: '501',
      fromTokenAddress,
      toTokenAddress,
      amount,
      slippage,
      autoSlippage,
      maxAutoSlippage: maxAutoSlippageBps,
      userWalletAddress: process.env.OKX_SOLANA_WALLET_ADDRESS!
    });

    return {
      status: "success",
      summary: {
        fromToken: quoteData.fromToken.tokenSymbol,
        toToken: quoteData.toToken.tokenSymbol,
        fromAmount,
        toAmount,
        exchangeRate: toAmount / fromAmount,
        txId: swapResult.transactionId,
        explorerUrl: swapResult.explorerUrl || `https://www.okx.com/web3/explorer/sol/tx/${swapResult.transactionId}`
      },
      data: swapResult
    };
  } catch (error: any) {
    console.error("Detailed swap error:", error);
    return {
      status: "error",
      message: error.message || "Failed to execute swap",
      details: error.response?.data || error.stack
    };
  }
}