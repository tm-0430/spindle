import { CancelJupiterOrderRequest, SolanaAgentKit } from "../../index";
import { cancelOrdersApi } from "./common/jupiterLimitApi";
import {
  deserializeTransaction,
  signAndSendTransactions,
} from "./common/transactions";

export async function cancelLimitOrders(
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
    };
  } catch (error) {
    const errorMessage = `Error canceling limit orders: ${error}`;
    console.error(errorMessage);
    return {
      signatures: [],
      success: false,
      error: errorMessage,
    };
  }
}
