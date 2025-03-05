import { SolanaAgentKit } from "../../src/agent";
import * as dotenv from "dotenv";
import * as readline from "readline";
import bs58 from "bs58";

dotenv.config();

export const OKX_SOLANA_WALLET_ADDRESS = process.env.OKX_SOLANA_WALLET_ADDRESS || "";

interface TokenInfo {
  symbol: string;
  address: string;
  decimals: number;
}

let tokenInfoCache: Record<string, TokenInfo> = {};

function updateTokenInfo(quote: any) {
  if (quote?.tokens) {
    Object.entries(quote.tokens).forEach(([address, info]: [string, any]) => {
      const symbol = info.symbol || address.slice(0, 8);
      if (info.decimals) {
        tokenInfoCache[address] = {
          symbol,
          address,
          decimals: parseInt(info.decimals)
        };
      }
    });
  }
}

function getTokenInfo(address: string): TokenInfo | undefined {
  return tokenInfoCache[address];
}

function formatTokenAmount(amount: string, address: string): string {
  const tokenInfo = getTokenInfo(address);
  const decimals = tokenInfo?.decimals || 9; // Default to 9 decimals if unknown
  const symbol = tokenInfo?.symbol || address.slice(0, 8);
  
  const value = parseFloat(amount) / Math.pow(10, decimals);
  return `${value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: decimals
  })} ${symbol}`;
}

function validateAndFormatAmount(amount: string, address: string): { isValid: boolean; formatted: string; humanReadable: string } {
  try {
    const cleanAmount = amount.replace(/,/g, '').trim();
    
    if (!/^\d*\.?\d+$/.test(cleanAmount)) {
      return { isValid: false, formatted: "0", humanReadable: "0" };
    }

    const value = parseFloat(cleanAmount);
    if (isNaN(value) || value <= 0) {
      return { isValid: false, formatted: "0", humanReadable: "0" };
    }

    const tokenInfo = getTokenInfo(address);
    const decimals = tokenInfo?.decimals || 9;
    const symbol = tokenInfo?.symbol || address.slice(0, 8);
    const baseUnits = Math.round(value * Math.pow(10, decimals));
    
    return {
      isValid: true,
      formatted: baseUnits.toString(),
      humanReadable: `${value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: decimals
      })} ${symbol}`
    };
  } catch (err) {
    return { isValid: false, formatted: "0", humanReadable: "0" };
  }
}

function formatQuoteResult(quote: any, fromAddress: string, toAddress: string): void {
  if (quote.status === "error") {
    console.log("\nQuote Error:");
    console.log("  Message:", quote.message || "Unknown error");
    return;
  }

  updateTokenInfo(quote);

  const expectedOutput = formatTokenAmount(quote.expectedOutput || "0", toAddress);
  const minOutput = formatTokenAmount(quote.minOutput || "0", toAddress);
  const priceImpact = parseFloat(quote.priceImpact || "0") * 100;

  console.log("\nQuote Details:");
  console.log("  Expected Output:", expectedOutput);
  console.log("  Minimum Output:", minOutput);
  console.log("  Price Impact:", `${priceImpact.toFixed(2)}%`);
  
  if (quote.tokens) {
    console.log("\nToken Details:");
    Object.entries(quote.tokens).forEach(([address, info]: [string, any]) => {
      const symbol = info.symbol || address.slice(0, 8);
      console.log(`  ${symbol}:`);
      console.log(`    Address: ${address}`);
      console.log(`    Decimals: ${info.decimals}`);
      if (info.price) console.log(`    Price: $${parseFloat(info.price).toFixed(4)}`);
    });
  }

  if (quote.route) {
    console.log("\nRoute:", quote.route);
  }
}

function formatSwapResult(result: any, fromAddress: string, toAddress: string): void {
  if (result.status === "error") {
    console.log("\nSwap Error:");
    console.log("  Message:", result.message || "Unknown error");
    return;
  }

  console.log("\nSwap Success!");
  if (result.txHash) {
    console.log("  Transaction Hash:", result.txHash);
  }
  if (result.outputAmount) {
    console.log("  Received:", formatTokenAmount(result.outputAmount, toAddress));
  }
}

export async function initializeAgent() {
  if (!process.env.OKX_SOLANA_PRIVATE_KEY) {
    throw new Error("OKX_SOLANA_PRIVATE_KEY is required");
  }
  
  return new SolanaAgentKit(
    process.env.OKX_SOLANA_PRIVATE_KEY,
    process.env.RPC_URL || "https://api.mainnet-beta.solana.com",
    {
      OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
      OKX_API_KEY: process.env.OKX_API_KEY || "",
      OKX_SECRET_KEY: process.env.OKX_SECRET_KEY || "",
      OKX_API_PASSPHRASE: process.env.OKX_API_PASSPHRASE || "",
      OKX_PROJECT_ID: process.env.OKX_PROJECT_ID || "",
      OKX_SOLANA_WALLET_ADDRESS: process.env.OKX_SOLANA_WALLET_ADDRESS || "",
      OKX_SOLANA_PRIVATE_KEY: process.env.OKX_SOLANA_PRIVATE_KEY || ""
    }
  );
}

async function askQuestion(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function isValidAddress(address: string): boolean {
  return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

export async function getQuote(agent: SolanaAgentKit, fromAddress: string, toAddress: string, amount: string) {
  const { isValid, formatted: formattedAmount, humanReadable } = validateAndFormatAmount(amount, fromAddress);
  
  if (!isValid) {
    console.log("\nInvalid amount format");
    return { status: "error", message: "Invalid amount format" };
  }

  console.log(`\nGetting quote for swapping ${humanReadable} to ${toAddress}...`);
  const quote = await agent.getOkxQuote(
    fromAddress,
    toAddress,
    formattedAmount,
    "0.5"
  );
  formatQuoteResult(quote, fromAddress, toAddress);
  return quote;
}

export async function executeSwap(agent: SolanaAgentKit, quote: any, fromAddress: string, toAddress: string, amount: string) {
  if (!quote || quote.status === "error") {
    console.error("Invalid quote");
    return null;
  }

  try {
    console.log("\nExecuting swap...");
    const { isValid, formatted: formattedAmount } = validateAndFormatAmount(amount, fromAddress);
    
    if (!isValid) {
      throw new Error("Invalid amount format");
    }

    const swapResult = await agent.executeOkxSwap(
      fromAddress,
      toAddress,
      formattedAmount,
      "0.5",
      true,
      "100",
      OKX_SOLANA_WALLET_ADDRESS
    );
    formatSwapResult(swapResult, fromAddress, toAddress);
    return swapResult;
  } catch (err) {
    const error = err as Error;
    console.error("\nError during swap execution:", error.message || "Unknown error");
    return {
      status: "error",
      message: error.message || "Unknown error",
      details: error
    };
  }
}

async function showMenu(): Promise<void> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  try {
    console.log("\nInitializing OKX DEX Trading Bot...");
    const agent = await initializeAgent();
    console.log("Bot initialized successfully!");
    
    while (true) {
      console.log("\n=== OKX DEX Trading Bot ===");
      console.log("1. Get Quote for Swap");
      console.log("2. Execute Swap");
      console.log("3. Exit");
      
      const choice = await askQuestion(rl, "\nSelect an option (1-3): ");

      if (choice === "3") {
        console.log("\nGoodbye!");
        break;
      }

      if (choice === "1") {
        console.log("\nCommon tokens:");
        console.log("  SOL:  11111111111111111111111111111111");
        console.log("  USDC: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
        console.log("  USDT: Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB");
        
        const fromAddress = await askQuestion(rl, "\nEnter FROM token address: ");
        if (!isValidAddress(fromAddress)) {
          console.log("\nInvalid token address format");
          continue;
        }

        const toAddress = await askQuestion(rl, "Enter TO token address: ");
        if (!isValidAddress(toAddress)) {
          console.log("\nInvalid token address format");
          continue;
        }

        const amount = await askQuestion(rl, `Enter amount: `);

        const quote = await getQuote(agent, fromAddress, toAddress, amount);
        
        if (quote && quote.status !== "error") {
          const proceed = await askQuestion(rl, "\nWould you like to execute this swap? (yes/no): ");
          if (proceed.toLowerCase() === "yes") {
            await executeSwap(agent, quote, fromAddress, toAddress, amount);
          }
        }
      }

      if (choice === "2") {
        console.log("\nPlease get a quote first (option 1)");
      }
    }
  } catch (err) {
    const error = err as Error;
    console.error("\nError:", error.message || "Unknown error");
  } finally {
    rl.close();
  }
}

// Start the interactive menu when running directly
if (require.main === module) {
  showMenu().catch(console.error);
} 