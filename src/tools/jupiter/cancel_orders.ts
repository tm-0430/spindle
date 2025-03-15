import { CancelJupiterOrderRequest, SolanaAgentKit } from "../../index";
import { cancelOrdersApi } from "./common/jupiterLimitApi";
import {
  deserializeTransaction,
  signAndSendTransactions,
} from "./common/transactions";

export async function cancelOrders(
  agent: SolanaAgentKit,
  params: CancelJupiterOrderRequest,
) {
  params.maker = agent.wallet.publicKey.toString();
  try {
    const data = await cancelOrdersApi(params);
    const transactions = data.txs.map((tx: string) =>
      deserializeTransaction(tx),
    );

    const signatures = await signAndSendTransactions(
      agent.connection,
      transactions,
      agent.wallet,
    );

    return {
      signatures,
      success: true,
      explanation: "Orders canceled successfully.",
    };
  } catch (error) {
    const errorMessage = `Error canceling orders: ${error}`;
    console.error(errorMessage);
    return {
      signatures: [],
      success: false,
      error: errorMessage,
      explanation: "Failed to cancel orders.",
    };
  }
}
