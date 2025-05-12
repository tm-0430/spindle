// example.ts - Example usage of OKX Plugin with Send AI v2
import { SolanaAgentKit, KeypairWallet, createVercelAITools } from 'solana-agent-kit';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import OkxPlugin from '@solana-agent-kit/plugin-defi';
import dotenv from 'dotenv';
import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';

dotenv.config();

async function runOkxExample() {
  // Step 1: Set up the wallet using KeypairWallet instead of direct private key
  const privateKey = process.env.SOLANA_PRIVATE_KEY!;
  const keyPair = Keypair.fromSecretKey(bs58.decode(privateKey));
  const wallet = new KeypairWallet(keyPair, process.env.RPC_URL!);
  
  console.log("Wallet set up with address:", wallet.publicKey.toBase58());
  
  // Step 2: Initialize the agent with the OKX plugin
  const agent = new SolanaAgentKit(
    wallet, // Use the wallet interface instead of private key
    process.env.RPC_URL!, 
    {
      OKX_API_KEY: process.env.OKX_API_KEY!,
      OKX_SECRET_KEY: process.env.OKX_SECRET_KEY!,
      OKX_API_PASSPHRASE: process.env.OKX_API_PASSPHRASE!,
      OKX_PROJECT_ID: process.env.OKX_PROJECT_ID || "",
      OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
    }
  ).use(OkxPlugin); // Use the plugin pattern
  
  console.log("Agent initialized with OKX plugin");
  
  // Example 1: Use the plugin method directly
  console.log("\nExample 1: Getting quote directly with agent.methods.getOkxQuote()");
  try {
    // SOL to USDC quote
    const fromTokenAddress = "So11111111111111111111111111111111111111112"; // Wrapped SOL
    const toTokenAddress = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"; // USDC
    const amount = "100000000"; // 0.1 SOL in lamports
    
    // Use the method via agent.methods as per v2 architecture
    const quoteResult = await agent.methods.okx_dex_quote(
      agent,
      fromTokenAddress, 
      toTokenAddress,
      amount,
      "0.5"
    );
    
    console.log("Quote result summary:", quoteResult.summary);
    
    // Display exchange rate
    if (quoteResult.summary) {
      console.log(
        `\nExchange rate: 1 ${quoteResult.summary.fromToken} = ${quoteResult.summary.exchangeRate.toFixed(6)} ${quoteResult.summary.toToken}`
      );
      console.log(`Price impact: ${quoteResult.summary.priceImpact}%`);
    }
  } catch (error) {
    console.error("Error getting quote:", error);
  }
  
  // Example 2: Use with Vercel AI
  console.log("\nExample 2: Using the OKX plugin with Vercel AI");
  try {
    // Create AI tools from agent's actions
    const tools = createVercelAITools(agent, agent.actions);
    
    const openai = createOpenAI({
      apiKey: process.env.OPENAI_API_KEY!
    });
    
    // Generate a response using the AI with OKX tools
    console.log("Asking AI to get a quote for swapping SOL to USDC...");
    const response = await streamText({
      model: openai("gpt-4"),
      messages: [
        {
          role: "user",
          content: "Get a quote for swapping 0.1 SOL to USDC and tell me what the exchange rate is."
        }
      ],
      tools,
      system: "You are a helpful agent that can interact onchain using the Solana Agent Kit. When getting quotes, use the token symbols 'sol' and 'usdc' as the plugin will handle the conversion to addresses.",
      maxSteps: 5,
    });

    process.stdout.write("Agent: ");
    for await (const textPart of response.textStream) {
      process.stdout.write(textPart);
    }
    console.log();
  } catch (error) {
    console.error("Error in AI example:", error);
  }
}

// Run the example
if (require.main === module) {
  runOkxExample().catch(console.error);
}