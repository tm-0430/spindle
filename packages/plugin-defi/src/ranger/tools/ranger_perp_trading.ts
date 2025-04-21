import type { SolanaAgentKit } from "solana-agent-kit";
import { signOrSendTX } from "solana-agent-kit";
import {
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
} from "@solana/web3.js";
import base64js from "base64-js";
import { RANGER_SOR_API_BASE } from "../index";

// TODO: Import or implement actual Ranger instruction builders

/**
 * Open perp trade on Ranger
 */
export async function openPerpTradeRanger({
  agent,
  price,
  symbol,
  side,
  collateralAmount,
  leverage,
  slippage,
}: {
  agent: SolanaAgentKit;
  price: number;
  symbol: string;
  side: "Long" | "Short";
  collateralAmount: number;
  leverage?: number;
  slippage?: number;
}) {
  // TODO: Build transaction instructions for opening a perp trade on Ranger
  const instructions: TransactionInstruction[] = [];
  // instructions.push(...buildOpenPerpTradeInstructions(...));
  return signOrSendTX(agent, instructions);
}

/**
 * Close perp trade on Ranger
 */
export async function closePerpTradeRanger({
  agent,
  symbol,
  side,
  price,
  slippage,
}: {
  agent: SolanaAgentKit;
  symbol: string;
  side: "Long" | "Short";
  price?: number;
  slippage?: number;
}) {
  // TODO: Build transaction instructions for closing a perp trade on Ranger
  const instructions: TransactionInstruction[] = [];
  // instructions.push(...buildClosePerpTradeInstructions(...));
  return signOrSendTX(agent, instructions);
}

/**
 * Increase perp position on Ranger
 */
export async function increasePerpPositionRanger({
  agent,
  symbol,
  side,
  size,
  collateral,
  leverage,
  slippage,
  apiKey,
  ...rest
}: {
  agent: SolanaAgentKit;
  symbol: string;
  side: "Long" | "Short";
  size: number;
  collateral: number;
  leverage?: number;
  slippage?: number;
  apiKey: string;
  [key: string]: any;
}) {
  const body = {
    fee_payer: agent.wallet.publicKey.toBase58(),
    symbol,
    side,
    size,
    collateral,
    size_denomination: symbol,
    collateral_denomination: "USDC",
    adjustment_type: "Increase",
    slippage_bps: slippage,
    ...rest,
  };
  const response = await fetch(`${RANGER_SOR_API_BASE}/v1/increase_position`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Increase position request failed: ${error.message}`);
  }
  const data = await response.json();
  const messageBase64 = data.message;
  const messageBytes = base64js.toByteArray(messageBase64);
  const transactionMessage = TransactionMessage.deserialize(messageBytes);
  const transaction = new VersionedTransaction(transactionMessage);
  const { blockhash } = await agent.connection.getLatestBlockhash();
  transaction.message.recentBlockhash = blockhash;
  return signOrSendTX(agent, transaction);
}

/**
 * Decrease perp position on Ranger
 */
export async function decreasePerpPositionRanger({
  agent,
  symbol,
  side,
  size,
  slippage,
}: {
  agent: SolanaAgentKit;
  symbol: string;
  side: "Long" | "Short";
  size: number;
  slippage?: number;
}) {
  // TODO: Build transaction instructions for decreasing a perp position on Ranger
  const instructions: TransactionInstruction[] = [];
  // instructions.push(...buildDecreasePerpPositionInstructions(...));
  return signOrSendTX(agent, instructions);
}

/**
 * Withdraw balance from Ranger
 */
export async function withdrawBalanceRanger({
  agent,
  symbol,
  amount,
}: {
  agent: SolanaAgentKit;
  symbol: string;
  amount: number;
}) {
  // TODO: Build transaction instructions for withdrawing balance from Ranger
  const instructions: TransactionInstruction[] = [];
  // instructions.push(...buildWithdrawBalanceInstructions(...));
  return signOrSendTX(agent, instructions);
}

/**
 * Withdraw collateral from Ranger
 */
export async function withdrawCollateralRanger({
  agent,
  symbol,
  side,
  collateral,
}: {
  agent: SolanaAgentKit;
  symbol: string;
  side: "Long" | "Short";
  collateral: number;
}) {
  // TODO: Build transaction instructions for withdrawing collateral from Ranger
  const instructions: TransactionInstruction[] = [];
  // instructions.push(...buildWithdrawCollateralInstructions(...));
  return signOrSendTX(agent, instructions);
}
