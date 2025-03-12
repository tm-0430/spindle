import { SolanaAgentKit } from "../../src/agent";
import dotenv from "dotenv";

dotenv.config();

async function testOkxDexTokens() {
  console.log("Testing OKX DEX Tokens API...");
  
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
    console.log("Fetching tokens from OKX DEX...");
    const tokens = await agent.getOkxTokens();
    
    if (tokens && tokens.data && tokens.data.length > 0) {
      console.log("Successfully fetched tokens from OKX DEX");
      console.log(`Found ${tokens.data.length} tokens`);
      
      // Check for common tokens
      const commonTokens = ["SOL", "USDC", "USDT"];
      for (const symbol of commonTokens) {
        const found = tokens.data.some(token => 
          token.tokenSymbol?.toUpperCase() === symbol);
        
        console.log(`${symbol} token ${found ? 'found' : 'not found'}`);
      }
      
      // Show first 3 tokens as sample
      console.log("\nSample tokens:");
      tokens.data.slice(0, 3).forEach((token, i) => {
        console.log(`${i+1}. ${token.tokenSymbol} (${token.address})`);
      });
      
      console.log("\nTokens test passed!");
    } else {
      console.log("Failed to get tokens or empty response:", tokens);
      console.log("Tokens test failed!");
    }
  } catch (error) {
    console.error("Error fetching tokens from OKX DEX:", error);
    console.log("Tokens test failed!");
  }
}

// Run the test
testOkxDexTokens().catch(console.error);