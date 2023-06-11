import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: "src/main.ts",
    output: {
      dir: "out/",
      format: "iife",
    },
    plugins: [
      nodeResolve(),
      typescript({
        module: "es6",
        allowJs: true,
        sourceMap: !production,
        inlineSources: !production,
        noImplicitAny: true,
      }),
    ],
  },
];
