// example.ts
import { SolanaAgentKit, KeypairWallet, createVercelAITools } from 'solana-agent-kit';
import { Keypair } from '@solana/web3.js';
import bs58 from 'bs58';
import OkxPlugin from '../../../packages/plugin-defi/src/okx';
import dotenv from 'dotenv';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import readline from 'readline';

// Use this to import the DefiPlugin if you want to use in tandem with other plugins
// import DefiPlugin from '@solana-agent-kit/plugin-defi';

dotenv.config();

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
};

// Helper function to print a separator
function printSeparator() {
  console.log(colors.gray + '─'.repeat(60) + colors.reset);
}

// Helper function to print a header
function printHeader(text: string) {
  console.log('\n' + colors.bright + colors.blue + text + colors.reset);
  printSeparator();
}

// Interface for swap context
interface SwapContext {
  fromToken?: string;
  toToken?: string;
  amount?: number;
  slippage?: string;
  quote?: any;
  lastAction?: 'quote' | 'swap';
}

async function runOkxExample() {
  printHeader('🚀 OKX DEX Chat');
  
  // Set up the wallet
  const keyPair = Keypair.fromSecretKey(
    bs58.decode(process.env.SOLANA_PRIVATE_KEY!)
  );
  
  const wallet = new KeypairWallet(keyPair, process.env.RPC_URL!);
  
  console.log(`${colors.green}✓${colors.reset} Wallet initialized`);
  console.log(`${colors.gray}  Address: ${wallet.publicKey.toBase58()}${colors.reset}`);
  
  // Initialize the agent with the OKX plugin
  const agent = new SolanaAgentKit(wallet, process.env.RPC_URL!, {
    OKX_API_KEY: process.env.OKX_API_KEY!,
    OKX_SECRET_KEY: process.env.OKX_SECRET_KEY!,
    OKX_API_PASSPHRASE: process.env.OKX_API_PASSPHRASE!,
    OKX_PROJECT_ID: process.env.OKX_PROJECT_ID || "",
  })
  .use(OkxPlugin);
  
  console.log(`${colors.green}✓${colors.reset} Agent initialized with OKX plugin`);
  
  // Set up chat interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const tools = createVercelAITools(agent, agent.actions);
  const openAI = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY!
  });

  // Initialize conversation context
  const context: SwapContext = {};
  let conversationHistory = '';

  console.log(`\n${colors.cyan}Chat started. Type your message or 'exit' to quit.${colors.reset}`);
  console.log(`${colors.yellow}Example commands:${colors.reset}`);
  console.log('  - "Get a quote for swapping .01 SOL to USDC"');
  console.log('  - "swap 0.01 SOL to USDC with 0.5% slippage"');
  
  async function chat() {
    rl.question(`\n${colors.cyan}You: ${colors.reset}`, async (input) => {
      if (input.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      try {
        // Update conversation history
        conversationHistory += `\nUser: ${input}\n`;

        const proceedWords = ['proceed', 'continue', 'yes', 'swap', 'do it', 'execute'];
        let prompt = input;
        let expectingSwap = false;

        const response = await generateText({
          model: openAI("gpt-4o"),
          tools,
          prompt,
          maxSteps: 5,
          system: `You are an agent that can call the following tools: ${Object.values(tools).map(t => (t as any).name).join(', ')}. 
When the user says to proceed with a swap, you must call the swap tool with the parameters from the last quote.`
        });

        // Update conversation history
        conversationHistory += `Assistant: ${response.text}\n`;

        // --- Store the actual tool result in context ---
        const toolResults = response.toolResults as any[] | undefined;
        let swapToolCalled = false;
        if (toolResults && toolResults.length > 0) {
          // If the tool result is a swap execution, clear the context
          const swapResult = toolResults.find(tr => tr.result && tr.result.signature);
          if (swapResult) {
            context.lastAction = 'swap';
            context.quote = undefined;
            swapToolCalled = true;
          }
        }

        // When proceeding with swap, use the GET_SWAP tool
        if (proceedWords.some(w => input.toLowerCase().includes(w))) {
          const swapTool = Object.values(tools).find((t: any) => t.id === "OKX_DEX_SWAP");
          if (!swapTool) throw new Error("Swap tool not found in tools");
          
          // Extract token direction from input
          const fromTokenMatch = input.match(/(?:^|\s)(\d*\.?\d+)\s+(\w+|[\w\d]{32,44})\s+to\s+(\w+|[\w\d]{32,44})/i);
          if (!fromTokenMatch) {
            console.log(colors.red + 'Could not parse token direction from input. Please use format: "swap X TOKEN to TOKEN" or "swap X TOKEN_ADDRESS to TOKEN_ADDRESS"' + colors.reset);
            chat();
            return;
          }

          const [_, amount, fromToken, toToken] = fromTokenMatch;
          const parsedAmount = parseFloat(amount);
          console.log(colors.gray + `[DEBUG] Parsed amount: ${parsedAmount} ${fromToken}` + colors.reset);
          
          // Get quote using swap tool with execute: false
          const quoteResult = await (swapTool as any).execute({
            fromToken: fromToken,
            toToken: toToken,
            amount: parsedAmount,
            slippage: "0.5",
            execute: false
          });

          if (quoteResult.status === "success" && quoteResult.routerResult) {
            const result = quoteResult.routerResult;
            
            // Format numbers for display
            const formatNumber = (num: string | number, decimals: number = 9) => {
              const n = typeof num === 'string' ? parseFloat(num) : num;
              const adjusted = n / Math.pow(10, decimals);
              if (adjusted >= 1) {
                return adjusted.toLocaleString(undefined, { maximumFractionDigits: 4 });
              } else {
                return adjusted.toLocaleString(undefined, { maximumSignificantDigits: 6 });
              }
            };

            // Display the quote to the user
            console.log(`\n${colors.cyan}Quote received:${colors.reset}`);
            console.log(`  From: ${formatNumber(result.fromTokenAmount, parseInt(result.fromToken.decimal))} ${result.fromToken.tokenSymbol}`);
            console.log(`  To: ${formatNumber(result.toTokenAmount, parseInt(result.toToken.decimal))} ${result.toToken.tokenSymbol}`);
            console.log(`  Exchange Rate: ${formatNumber(result.priceImpactPercentage)}%`);
            console.log(`  Price Impact: ${formatNumber(result.priceImpactPercentage)}%`);
            if (result.tradeFee) {
              console.log(`  Trade Fee: ${formatNumber(result.tradeFee, parseInt(result.toToken.decimal))} ${result.toToken.tokenSymbol}`);
            }
            if (result.estimateGasFee) {
              console.log(`  Estimated Gas Fee: ${formatNumber(result.estimateGasFee, 9)} SOL`);
            }
            
            // Ask for confirmation
            rl.question(`\n${colors.yellow}Would you like to proceed with this swap? (yes/no): ${colors.reset}`, async (answer) => {
              if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
                console.log(`\n${colors.cyan}Executing swap...${colors.reset}`);
                // Execute the swap
                const swapResult = await (swapTool as any).execute({
                  fromToken: fromToken,
                  toToken: toToken,
                  amount: parsedAmount,
                  slippage: "0.5",
                  execute: true
                });
                console.log(colors.green + '\nSwap executed!');
              } else {
                console.log(colors.yellow + '\nSwap cancelled.' + colors.reset);
              }
              context.lastAction = 'swap';
              context.quote = undefined;
              chat();
            });
            return;
          } else {
            console.log(colors.red + 'Error getting quote for swap:', JSON.stringify(quoteResult, null, 2) + colors.reset);
            chat();
          }
        }

        // Only proceed with the rest of the chat if we haven't started a swap flow
        if (!proceedWords.some(w => input.toLowerCase().includes(w))) {
          console.log(`\n${colors.green}Agent: ${colors.reset}`);
          const lines = response.text.split('\n');
          lines.forEach(line => {
            if (line.includes('**')) {
              console.log('  ' + line.replace(/\*\*(.*?)\*\*/g, colors.bright + '$1' + colors.reset));
            } else if (line.startsWith('-')) {
              console.log('  ' + colors.cyan + line + colors.reset);
            } else if (line.trim()) {
              console.log('  ' + line);
            }
          });
        }

        // Continue chat
        chat();
      } catch (error: any) {
        console.error(`\n${colors.red}Error: ${error.message}${colors.reset}`);
        chat();
      }
    });
  }


  // Start chat
  chat();
}

if (require.main === module) {
  runOkxExample().catch(console.error);
}