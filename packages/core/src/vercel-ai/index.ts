import { tool, type CoreTool } from "ai";
import type { SolanaAgentKit } from "../agent";
import { executeAction } from "../utils/actionExecutor";
import type { Action } from "../types/action";

export function createSolanaTools(
  solanaAgentKit: SolanaAgentKit,
  actions: Action[],
): Record<string, CoreTool> {
  const tools: Record<string, CoreTool> = {};

  for (const [index, action] of actions.entries()) {
    tools[index.toString()] = tool({
      id: action.name as `${string}.${string}`,
      description: `
      ${action.description}

      Similes: ${action.similes.map(
        (simile) => `
        ${simile}
      `,
      )}

      Examples: ${action.examples.map(
        (example) => `
        Input: ${JSON.stringify(example[0].input)}
        Output: ${JSON.stringify(example[0].output)}
        Explanation: ${example[0].explanation}
      `,
      )}
      `.slice(0, 1023),
      parameters: action.schema,
      execute: async (params: Record<string, unknown>) =>
        await executeAction(action, solanaAgentKit, params),
    });
  }

  return tools;
}
