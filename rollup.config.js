import { nodeResolve } from "@rollup/plugin-node-resolve";
import ts from "rollup-plugin-ts";

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: "src/index.ts",
    output: [
      { file: "lib/index.mjs", format: "es" },
      {
        dir: "lib/",
        format: "cjs",
      },
    ],
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
