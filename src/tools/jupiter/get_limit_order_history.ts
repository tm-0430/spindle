import { SolanaAgentKit } from "../../index";
import { getOrderHistoryApi } from "./common/jupiterLimitApi";

export async function getLimitOrderHistory(agent: SolanaAgentKit) {
  try {
    const history = await getOrderHistoryApi(agent.wallet.publicKey.toString());
    return { history, success: true };
  } catch (error) {
    const errorMessage = `Error fetching order history: ${error}`;
    console.error(errorMessage);
    return { history: null, success: false, error: errorMessage };
  }
}
