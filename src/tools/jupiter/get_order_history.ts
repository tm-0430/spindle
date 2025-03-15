import { SolanaAgentKit } from "../../index";
import { getOrderHistoryApi } from "./common/jupiterLimitApi";
export async function getOrderHistory(agent: SolanaAgentKit, page: number = 1) {
  try {
    const history = await getOrderHistoryApi(
      agent.wallet.publicKey.toString(),
      page,
    );
    return { history, success: true };
  } catch (error) {
    const errorMessage = `Error fetching order history: ${error}`;
    console.error(errorMessage);
    return { history: null, success: false, error: errorMessage };
  }
}
