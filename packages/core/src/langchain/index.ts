import { SolanaAgentKit } from "@/agent";
import { Action } from "@/types";
import { transformToZodObject } from "@/utils/zod";
import { tool } from "@langchain/core/tools";

export function createLangchainTools(
  solanaAgentKit: SolanaAgentKit,
  actions: Action[],
) {
  const tools = actions.map((action) => {
    const toolInstance = tool(
      async (inputs) =>
        JSON.stringify(await action.handler(solanaAgentKit, inputs)),
      {
        name: action.name,
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
      )}`,
        // convert action.schema from ZodType to ZodObject
        schema: transformToZodObject(action.schema),
      },
    );

    return toolInstance;
  });

  return tools;
}
