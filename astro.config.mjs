// @ts-check
import { defineConfig, fontProviders } from "astro/config";

// https://astro.build/config
export default defineConfig({
  fonts: [
    {
      provider: fontProviders.local(),
      name: "JK Gothic",
      cssVariable: "--font-jk-gothic",
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/JKG-L_3.woff2"],
            weight: "normal",
            style: "normal",
          },
        ],
      },
    },
  ],
});
