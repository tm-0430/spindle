import { SolanaAgentKit } from "solana-agent-kit";
import TokenPlugin from "@solana-agent-kit/plugin-token";
import bs58 from "bs58";
import { Keypair, PublicKey } from "@solana/web3.js";
import { KeypairWallet } from "solana-agent-kit";
import dotenv from "dotenv";

dotenv.config();

const rpcUrl = process.env.RPC_URL ?? "https://api.mainnet-beta.solana.com";

const keyPair = Keypair.fromSecretKey(
  bs58.decode(process.env.SOLANA_PRIVATE_KEY!),
);
const wallet = new KeypairWallet(keyPair, rpcUrl);

const agent = new SolanaAgentKit(wallet, rpcUrl, {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY ?? "",
}).use(TokenPlugin);

const mintAddress = "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263";
const newMint = new PublicKey(mintAddress);

async function getTokenPrice() {
  try {
    const response = await agent.methods.fetchPrice(newMint);
    console.log(response);
  } catch (error) {
    console.error("Error fetching price:", error);
  }
}

getTokenPrice();
