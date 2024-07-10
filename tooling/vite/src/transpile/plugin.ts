import fs from "node:fs";
import path from "node:path";
import type * as Vite from "vite";
import { build } from "esbuild";

interface TranspileOptions {
  packages: string[];
}

// 트랜스파일된 코드를 저장할 디렉토리
const outputDir = path.resolve(__dirname, "pre_transpiled");

export type VitePlugin = (config: TranspileOptions) => Vite.Plugin[];

export const vitePlugin: VitePlugin = ({ packages }) => {
  return [
    {
      name: "vite-plugin-transpile",
      async buildStart() {
        for (const pkg of packages) {
          const pkgPath = path.join("../../node_modules", pkg);
          const outputFilePath = path.join(outputDir, `${pkg}.js`);

          // esbuild를 사용하여 패키지 트랜스파일
          await build({
            entryPoints: [pkgPath],
            outfile: outputFilePath,
            bundle: true,
            platform: "browser",
          });
        }
      },
      resolveId(source) {
        if (packages.includes(source)) {
          const resolvedPath = path.join(outputDir, `${source}.js`);
          if (fs.existsSync(resolvedPath)) {
            return resolvedPath;
          }
        }
        return null;
      },
      load(id) {
        if (id.startsWith(outputDir)) {
          return fs.readFileSync(id, "utf8");
        }
        return null;
      },
    },
  ];
};
