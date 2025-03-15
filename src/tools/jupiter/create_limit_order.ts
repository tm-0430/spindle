import { CreateJupiterOrderRequest, SolanaAgentKit } from "../../index";
import { createOrderApi } from "./common/jupiterLimitApi";
import {
  deserializeTransaction,
  signAndSendTransaction,
} from "./common/transactions";

export async function createLimitOrder(
  agent: SolanaAgentKit,
  params: CreateJupiterOrderRequest,
) {
  const wallet = agent.wallet.publicKey.toString();
  params.maker = params.payer = wallet;

  try {
    const data = await createOrderApi(params);
    const transaction = deserializeTransaction(data.tx);
    const signature = await signAndSendTransaction(
      agent.connection,
      transaction,
      agent.wallet,
    );

    return {
      signature,
      order: data.order,
      success: true,
      explanation: "Order created and sent successfully.",
    };
  } catch (error) {
    const errorMessage = `Error creating and sending limit order: ${error}`;
    console.error(errorMessage);
    return {
      order: null,
      success: false,
      error: errorMessage,
      explanation: "Failed to create and send the order.",
    };
  }
}
