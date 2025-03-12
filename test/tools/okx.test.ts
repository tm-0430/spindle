import { SolanaAgentKit } from "../../src/agent";
import dotenv from "dotenv";

dotenv.config();

async function testOkxDexComprehensive() {
  console.log("Running Comprehensive OKX DEX Integration Test");
  console.log("==============================================");
  
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

  console.log("Wallet address:", agent.wallet_address.toString());
  let testsPassed = 0;
  let testsFailed = 0;

  async function runTest(name: string, testFn: () => Promise<boolean>) {
    console.log(`\n------ Running Test: ${name} ------`);
    try {
      const passed = await testFn();
      if (passed) {
        console.log(`Test ${name} PASSED`);
        testsPassed++;
      } else {
        console.log(`Test ${name} FAILED`);
        testsFailed++;
      }
    } catch (error) {
      console.error(`Error in test ${name}:`, error);
      console.log(`Test ${name} FAILED`);
      testsFailed++;
    }
  }

  // Test 1: Chain Data
  await runTest("Chain Data", async () => {
    const chainData = await agent.getOkxChainData();
    console.log(`Chain data: Found ${chainData?.data?.length || 0} chains`);
    return !!(chainData && chainData.data && chainData.data.length > 0);
  });

  // Test 2: Tokens
  await runTest("Tokens", async () => {
    const tokens = await agent.getOkxTokens();
    console.log(`Tokens: Found ${tokens?.data?.length || 0} tokens`);
    if (tokens?.data?.length > 0) {
      console.log("First token:", tokens.data[0].tokenSymbol);
      return true;
    }
    return false;
  });

  // Test 3: Liquidity Sources
  await runTest("Liquidity Sources", async () => {
    const liquidity = await agent.getOkxLiquidity();
    console.log(`Liquidity: Found ${liquidity?.data?.length || 0} sources`);
    return !!(liquidity && liquidity.data && liquidity.data.length > 0);
  });

  // Test 4: Quote
  await runTest("Quote", async () => {
    const fromToken = "So11111111111111111111111111111111111111112"; // SOL
    const toToken = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
    const amount = "1000000"; // 0.001 SOL (in lamports)
    
    const quote = await agent.getOkxQuote(fromToken, toToken, amount);
    
    if (quote && quote.data && quote.data.length > 0) {
      const quoteData = quote.data[0];
      console.log(`Quote: ${quoteData.fromToken.tokenSymbol} → ${quoteData.toToken.tokenSymbol}`);
      console.log(`Amount: ${quoteData.fromTokenAmount} → ${quoteData.toTokenAmount}`);
      return true;
    }
    return false;
  });

  // Summary
  console.log("\n==============================================");
  console.log(`Comprehensive Test Summary:`);
  console.log(`Tests Passed: ${testsPassed}`);
  console.log(`Tests Failed: ${testsFailed}`);
  console.log(`Overall Status: ${testsFailed === 0 ? "ALL TESTS PASSED" : "SOME TESTS FAILED"}`);
  console.log("==============================================");

  return testsFailed === 0;
}

// Run the comprehensive test
testOkxDexComprehensive()
  .then(success => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error("Fatal error:", error);
    process.exit(1);
  });