import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import json from "@rollup/plugin-json";

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
      },
    ],
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ tsconfig: "./tsconfig.json" }),
      json(),
    ],
    external: [
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
