import { SolanaAgentKit } from "../../src/agent";
import dotenv from "dotenv";

dotenv.config();

async function testOkxDexQuote() {
  console.log("Testing OKX DEX Quote API...");
  
  // Initialize SolanaAgentKit
  const agent = new SolanaAgentKit(
    process.env.SOLANA_PRIVATE_KEY!,
    process.env.RPC_URL!,
    { 
      OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
      OKX_API_KEY: process.env.OKX_API_KEY,
      OKX_SECRET_KEY: process.env.OKX_SECRET_KEY,
      OKX_API_PASSPHRASE: process.env.OKX_API_PASSPHRASE,
      OKX_PROJECT_ID: process.env.OKX_PROJECT_ID
    }
  );

  try {
    // SOL to USDC quote
    const fromToken = "So11111111111111111111111111111111111111112"; // SOL
    const toToken = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
    const amount = "1000000"; // 0.001 SOL (in lamports)
    
    console.log(`Getting quote to swap 0.001 SOL to USDC...`);
    const quote = await agent.getOkxQuote(fromToken, toToken, amount);
    
    if (quote && quote.data && quote.data.length > 0) {
      console.log("Successfully got quote from OKX DEX");
      
      const quoteData = quote.data[0];
      const fromAmount = parseInt(quoteData.fromTokenAmount) / Math.pow(10, parseInt(quoteData.fromToken.decimal));
      const toAmount = parseInt(quoteData.toTokenAmount) / Math.pow(10, parseInt(quoteData.toToken.decimal));
      
      console.log(`\nQuote Details:`);
      console.log(`From: ${fromAmount} ${quoteData.fromToken.tokenSymbol}`);
      console.log(`To: ${toAmount} ${quoteData.toToken.tokenSymbol}`);
      console.log(`Rate: 1 ${quoteData.fromToken.tokenSymbol} = ${toAmount/fromAmount} ${quoteData.toToken.tokenSymbol}`);
      
      console.log("\nQuote test passed!");
    } else {
      console.log("Failed to get quote or empty response:", quote);
      console.log("Quote test failed!");
    }
  } catch (error) {
    console.error("Error getting quote from OKX DEX:", error);
    console.log("Quote test failed!");
  }
}

// Run the test
testOkxDexQuote().catch(console.error);