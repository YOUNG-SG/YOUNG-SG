import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import babel from "@rollup/plugin-babel";

export default defineConfig({
  plugins: [
    react(),
    babel({
      babelHelpers: "runtime",
      extensions: [".js", ".jsx", ".ts", ".tsx"],
      include: ["src/**/*"],
      plugins: [
        [
          "@babel/plugin-transform-runtime",
          {
            regenerator: true,
          },
        ],
      ],
    }),
  ],
});
