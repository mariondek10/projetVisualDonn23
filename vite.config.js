import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
  plugins: [
    viteStaticCopy({
      targets: [
        {
          // copie fichiers csv
          src: "data/",
          dest: "../dist",
        },
        {
          // copie fichiers csv
          src: "src/img/",
          dest: "../dist",
        },
      ],
    }),
  ],
});
