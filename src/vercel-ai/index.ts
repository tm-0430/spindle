import { tool, type CoreTool } from "ai";
import { SolanaAgentKit } from "../agent";
import { executeAction } from "../utils/actionExecutor";
import { ACTIONS } from "../actions";
import { Action } from "../types";
import { z } from "zod";

export function createSolanaTools(
  solanaAgentKit: SolanaAgentKit,
): Record<string, CoreTool> {
  const tools: Record<string, CoreTool> = {};
  const actionKeys = Object.keys(ACTIONS);

  for (const key of actionKeys) {
    const action = ACTIONS[key as keyof typeof ACTIONS] as Action;
    tools[key] = tool({
      id: `solana.${action.name}` as `${string}.${string}`,
      description: `
      ${action.description}

      Similes: ${action.similes.map(
        (simile) => `
        ${simile}
      `,
      )}
      `.slice(0, 1023),
      parameters: action.schema ?? z.object({}),
      execute: async (params) =>
        await executeAction(action, solanaAgentKit, params),
    });
  }

  return tools;
}
