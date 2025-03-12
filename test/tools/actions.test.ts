  import { SolanaAgentKit } from "../../src/agent";
import { ACTIONS } from "../../src/actions";
import dotenv from "dotenv";

dotenv.config();

async function testOkxDexActions() {
  console.log("Testing OKX DEX Actions...");
  
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
    // Test tokens action
    console.log("\n==== Testing OKX_DEX_TOKENS_ACTION ====");
    const tokensResult = await ACTIONS.OKX_DEX_TOKENS_ACTION.handler(agent, {});
    console.log(`Tokens action result: ${tokensResult.status === "success" ? "Success" : "Failed"}`);
    console.log(`Found ${tokensResult.summary?.tokens?.length || 0} tokens`);
    
    // Test chain data action
    console.log("\n==== Testing OKX_DEX_CHAIN_DATA_ACTION ====");
    const chainDataResult = await ACTIONS.OKX_DEX_CHAIN_DATA_ACTION.handler(agent, {});
    console.log(`Chain data action result: ${chainDataResult.status === "success" ? "Success" : "Failed"}`);
    
    // Test liquidity action
    console.log("\n==== Testing OKX_DEX_LIQUIDITY_ACTION ====");
    const liquidityResult = await ACTIONS.OKX_DEX_LIQUIDITY_ACTION.handler(agent, {});
    console.log(`Liquidity action result: ${liquidityResult.status === "success" ? "Success" : "Failed"}`);
    
    // Test quote action
    console.log("\n==== Testing OKX_DEX_QUOTE_ACTION ====");
    const quoteResult = await ACTIONS.OKX_DEX_QUOTE_ACTION.handler(agent, {
      fromToken: "So11111111111111111111111111111111111111112", // SOL
      toToken: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // USDC
      amount: 0.001,
      slippage: "0.5"
    });
    
    if (quoteResult && quoteResult.data && quoteResult.data.length > 0) {
      console.log(`Quote action result: Success`);
      const quoteData = quoteResult.data[0];
      console.log(`Quote: ${quoteData.fromToken.tokenSymbol} → ${quoteData.toToken.tokenSymbol}`);
    } else {
      console.log(`Quote action result: Failed`);
    }
    
    console.log("\nAll action tests completed!");
  } catch (error) {
    console.error("Error testing OKX DEX actions:", error);
    console.log("Actions test failed!");
  }
}

// Run the test
testOkxDexActions().catch(console.error);