import { SolanaAgentKit } from "../../src/agent";
import dotenv from "dotenv";

dotenv.config();

async function testOkxDexConnection() {
  console.log("Testing OKX DEX API Connection...");
  
  // Create a configuration object with explicit defaults for optional values
  const config = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
    // Add defaults for the OKX configuration values to avoid undefined
    OKX_API_KEY: process.env.OKX_API_KEY || "",
    OKX_SECRET_KEY: process.env.OKX_SECRET_KEY || "",
    OKX_API_PASSPHRASE: process.env.OKX_API_PASSPHRASE || "",
    OKX_PROJECT_ID: process.env.OKX_PROJECT_ID || ""
  };
  
  // Initialize SolanaAgentKit with proper config
  const agent = new SolanaAgentKit(
    process.env.SOLANA_PRIVATE_KEY!,
    process.env.RPC_URL!,   
    config
  );

  console.log("Wallet address:", agent.wallet_address.toString());

  try {
    // Test chain data as a simple connection test
    console.log("Fetching chain data to verify connection...");
    const chainData = await agent.getOkxChainData();
    
    if (chainData && chainData.data) {
      console.log("Successfully connected to OKX DEX API");
      console.log(`Found ${chainData.data.length} chains`);
      console.log("Connection test passed!");
    } else {
      console.log("Failed to get chain data. Response:", chainData);
      console.log("Connection test failed!");
    }
  } catch (error) {
    console.error("Error connecting to OKX DEX API:", error);
    console.log("Connection test failed!");
  }
}

// Run the test
testOkxDexConnection().catch(console.error);