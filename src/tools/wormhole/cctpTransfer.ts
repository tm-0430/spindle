import { tool } from "@langchain/core/tools";
import { z } from "zod";
import {
  wormhole,
  Chain,
  CircleTransfer,
  amount,
} from "@wormhole-foundation/sdk";
import evm from "@wormhole-foundation/sdk/evm";
import solana from "@wormhole-foundation/sdk/solana";
import sui from "@wormhole-foundation/sdk/sui";
import aptos from "@wormhole-foundation/sdk/aptos";
import { getSigner } from "./helper";
import { CctpTransferInput } from "../../types";

// Main USDC transfer function using Circle's CCTP
export const cctpTransfer = async (input: CctpTransferInput) => {
  const {
    destinationChain,
    transferAmount,
    network,
    automatic,
    nativeGasAmount,
  } = input;
  const sourceChain = "Solana";
  try {
    // Initialize the Wormhole SDK
    const wh = await wormhole(network, [evm, solana, sui, aptos]);

    // Get chain contexts
    const sendChain = wh.getChain(sourceChain);
    const rcvChain = wh.getChain(destinationChain);

    // Get signers
    const src = await getSigner(sendChain);
    const dst = await getSigner(rcvChain);

    // Parse the amount (USDC has 6 decimals)
    const amt = amount.units(amount.parse(transferAmount, 6));

    // Calculate native gas if required
    const nativeGas =
      automatic && nativeGasAmount
        ? amount.units(amount.parse(nativeGasAmount, 6))
        : 0n;

    // Create the USDC transfer
    const xfer = await wh.circleTransfer(
      amt,
      src.address,
      dst.address,
      automatic,
      undefined, // No payload
      nativeGas,
    );

    // Get a quote for the transfer
    const quote = await CircleTransfer.quoteTransfer(
      src.chain,
      dst.chain,
      xfer.transfer,
    );
    console.log("USDC Transfer Quote:", quote);

    // Start the transfer
    console.log("Starting USDC Transfer");
    const srcTxids = await xfer.initiateTransfer(src.signer);
    console.log("Started USDC Transfer:", srcTxids);

    // For automatic transfers, wait for relay

    // For manual transfers, get attestation and complete
    console.log("Waiting for Attestation");
    const attestIds = await xfer.fetchAttestation(60_000);
    console.log("Got Attestation:", attestIds);

    console.log("Completing Transfer");
    const dstTxids = await xfer.completeTransfer(dst.signer);
    console.log("Completed Transfer:", dstTxids);

    return {
      success: true,
      status: "Completed",
      sourceChain: sourceChain,
      destinationChain: destinationChain,
      amount: transferAmount,
      sourceTransaction: srcTxids,
      attestation: attestIds,
      destinationTransaction: dstTxids,
      automatic: false,
    };
  } catch (error) {
    console.error("USDC transfer failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};
