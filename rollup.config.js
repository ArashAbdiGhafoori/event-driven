import { nodeResolve } from "@rollup/plugin-node-resolve";
import ts from "rollup-plugin-ts";

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: "src/main.ts",
    output: {
      name: "index",
      dir: "lib/",
      format: "iife",
    },
    plugins: [
      nodeResolve(),
      // typescript({
      //   module: "es6",
      //   allowJs: true,
      //   sourceMap: !production,
      //   inlineSources: !production,
      //   noImplicitAny: true,
      // }),
      ts({ tsconfig: production ? "tsconfig.json" : "tsconfig.json" }),
    ],
  },
];
