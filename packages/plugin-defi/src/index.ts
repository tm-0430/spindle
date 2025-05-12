import { Plugin, SolanaAgentKit } from "solana-agent-kit";

import OkxDexQuote from "./okx/actions/OkxDexQuote";
import { okx_dex_quote } from "./okx/tools/okx_dex_quote";


// Define and export the plugin
const DefiPlugin = {
  name: "defi",

  // Combine all tools
  methods: {
    okx_dex_quote,
  },

  // Combine all actions
  actions: [
    OkxDexQuote,
  ],

  // Initialize function
  initialize: function (agent: SolanaAgentKit): void {
    // Initialize all methods with the agent instance
    Object.entries(this.methods).forEach(([methodName, method]) => {
      if (typeof method === "function") {
        this.methods[methodName] = method.bind(null, agent);
      }
    });
  },
} satisfies Plugin;

// Default export for convenience
export default DefiPlugin;
