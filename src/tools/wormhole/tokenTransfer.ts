import { tool } from "@langchain/core/tools";
import solana from "@wormhole-foundation/sdk/solana";
import { getTokenDecimals, getSigner } from "./helper";
import evm from "@wormhole-foundation/sdk/evm";
import { TokenTransferInput } from "../../types";
import {
  wormhole,
  Chain,
  TokenId,
  Wormhole,
  amount,
  Network,
  TokenTransfer,
} from "@wormhole-foundation/sdk";
import { z } from "zod";
import sui from "@wormhole-foundation/sdk/sui";
import aptos from "@wormhole-foundation/sdk/aptos";

export const tokenTransfer = async (
  input: TokenTransferInput,
): Promise<any> => {
  try {
    const { destinationChain, network, transferAmount, tokenAddress } = input;

    // Initialize the Wormhole SDK with all platforms
    const wh = await wormhole(network || "Testnet", [evm, solana, sui, aptos]);

    // Ensure chain names are valid and properly formatted
    const sourceChainName = "Solana";
    let destChainName = destinationChain;

    // Get chain contexts - handle potential errors
    const sendChain = wh.getChain(sourceChainName);
    const source = await getSigner(sendChain);

    // Get destination chain
    const rcvChain = wh.getChain(destChainName);
    const destination = await getSigner(rcvChain);

    // Use tokenAddress if provided, otherwise use native token
    const token = tokenAddress || Wormhole.tokenId(sendChain.chain, "native");

    const amt = transferAmount ?? "0.01";
    const automatic = false;

    const decimals = await getTokenDecimals(wh, token, sendChain);

    // Create a TokenTransfer object to track the state of the transfer
    const xfer = await wh.tokenTransfer(
      token,
      amount.units(amount.parse(amt, decimals)),
      source.address,
      destination.address,
      automatic,
    );

    // Get a quote for the transfer
    const quote = await TokenTransfer.quoteTransfer(
      wh,
      source.chain,
      destination.chain,
      xfer.transfer,
    );

    if (xfer.transfer.automatic && quote.destinationToken.amount < 0) {
      throw "The amount requested is too low to cover the fee and any native gas requested.";
    }

    // Submit the transactions to the source chain
    console.log("Starting transfer");
    const srcTxids = await xfer.initiateTransfer(source.signer);
    console.log(`Source Transaction ID: ${srcTxids[0]}`);
    console.log(`Wormhole Transaction ID: ${srcTxids[1] ?? srcTxids[0]}`);

    // If automatic, we're done
    if (automatic) {
      return {
        success: true,
        sourceTransactionIds: srcTxids,
        transferId: xfer.txids[0],
      };
    }

    // Wait for the VAA to be signed and ready
    console.log("Getting Attestation");
    let attestation = null;
    let attempts = 0;
    const maxAttempts = 10;

    while (!attestation && attempts < maxAttempts) {
      try {
        attestation = await xfer.fetchAttestation(60_000);
        console.log("Got Attestation:", attestation);
      } catch (error) {
        attempts++;
        console.log(
          `Attestation attempt ${attempts}/${maxAttempts} failed, retrying...`,
        );
        // Wait 30 seconds between attempts
        await new Promise((resolve) => setTimeout(resolve, 30000));
      }
    }

    if (!attestation) {
      throw new Error("Failed to get attestation after multiple attempts");
    }

    // Redeem the VAA on the destination chain
    console.log("Completing Transfer");
    const destTxids = await xfer.completeTransfer(destination.signer);
    console.log(`Completed Transfer: `, destTxids);

    return {
      success: true,
      sourceTransactionIds: srcTxids,
      destinationTransactionIds: destTxids,
      transferId: xfer.txids[0],
    };
  } catch (error) {
    console.error("Token transfer error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
