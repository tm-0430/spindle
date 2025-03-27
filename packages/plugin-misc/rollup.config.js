import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import json from "@rollup/plugin-json";

/**
 * Plugin to replace relative workspace imports with absolute imports
 */
function replaceWorkspaceImportsPlugin() {
  return {
    name: "replace-workspace-imports",
    transform(code, id) {
      // Replace relative imports of workspace.js with absolute imports
      const replacedCode = code
        // Replace require('./workspace.js')
        .replace(
          /require\(['"]\.\/workspace\.js['"]\)/g,
          "require('@coral-xyz/anchor/dist/cjs/workspace.js')",
        )
        // Replace import from './workspace.js'
        .replace(
          /from\s+['"]\.\/workspace\.js['"]/g,
          "from '@coral-xyz/anchor/dist/cjs/workspace.js'",
        )
        // Replace dynamic import('./workspace.js')
        .replace(
          /import\(['"]\.\/workspace\.js['"]\)/g,
          "import('@coral-xyz/anchor/dist/cjs/workspace.js')",
        )
        // Replace require('./nodewallet.js')
        .replace(
          /require\(['"]\.\/nodewallet\.js['"]\)/g,
          "require('@coral-xyz/anchor/dist/cjs/nodewallet.js')",
        )
        // Replace import from './nodewallet.js'
        .replace(
          /from\s+['"]\.\/nodewallet\.js['"]/g,
          "from '@coral-xyz/anchor/dist/cjs/nodewallet.js'",
        )
        // Replace dynamic import('./nodewallet.js')
        .replace(
          /import\(['"]\.\/nodewallet\.js['"]\)/g,
          "import('@coral-xyz/anchor/dist/cjs/nodewallet.js')",
        );

      return {
        code: replacedCode,
        map: null,
      };
    },
  };
}

/** @type {import('rollup').RollupOptions[]} */
const config = [
  // JavaScript bundles
  {
    input: "src/index.ts",
    output: [
      {
        file: "dist/index.cjs",
        format: "cjs",
        sourcemap: true,
      },
      {
        file: "dist/index.mjs",
        format: "esm",
        sourcemap: true,
        preserveModules: false,
        esModule: true,
      },
    ],
    plugins: [
      nodeResolve(),
      commonjs({
        transformMixedEsModules: true,
        // This is important for handling default exports correctly in ESM
        requireReturnsDefault: "preferred",
        // Ensure named exports are preserved
        esmExternals: true,
      }),
      typescript({ tsconfig: "./tsconfig.json" }),
      json(),
      replaceWorkspaceImportsPlugin(),
    ],
    external: [
      "rpc-websockets",
      "@solana/codecs",
      // List external dependencies here
      // e.g., 'react', 'lodash'
    ],
  },
  // Type definitions bundle
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.ts",
      format: "es",
    },
    plugins: [dts()],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.d.cts",
      format: "commonjs",
    },
    plugins: [dts()],
  },
];

export default config;
