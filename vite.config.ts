import { defineConfig, loadEnv } from "vite";
import path from "node:path";
import react from "@vitejs/plugin-react";
import viteImagemin from "vite-plugin-imagemin";
import viteCompression from "vite-plugin-compression";
// import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    base: "/", // 基础公共路径
    resolve: {
      alias: {
        // 别名配置
        "~": path.resolve(__dirname, "./"),
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 3100,
      host: true,
      open: true,
      proxy: {
        "/dev-api": {
          target: env.VITE_APP_BASE_API_URL,
          changeOrigin: true,
          rewrite: p => p.replace(/^\/dev-api/, ""),
        },
      },
    },
    plugins: [
      react(),
      // visualizer({
      //   open: false, // 依赖分析,不自动打开页面
      // }),
      // 图片压缩
      viteImagemin({
        verbose: true, // 是否在控制台输出压缩结果
        gifsicle: { optimizationLevel: 7, interlaced: false },
        optipng: { optimizationLevel: 7 }, // 无损压缩配置，无损压缩下图片质量不会变差
        mozjpeg: { quality: 20 },
        pngquant: { quality: [0.8, 0.9], speed: 4 }, // 有损压缩配置，有损压缩下图片质量可能会变差
        webp: { quality: 75 },
        svgo: {
          plugins: [{ name: "removeViewBox" }, { name: "removeEmptyAttrs", active: false }],
        },
      }),
      // gzip
      viteCompression({
        verbose: true, // 默认即可
        disable: false, // 开启压缩(不禁用)，默认即可
        deleteOriginFile: false, // 删除源文件
        threshold: 4 * 1024, // 压缩前最小文件大小
        algorithm: "gzip", // 压缩算法
        ext: ".gz", // 文件类型
      }),
    ],
    build: {
      rollupOptions: {
        // external: ["axios", "echarts"], // 忽略依赖
        output: {
          chunkFileNames: "static/js/[name]-[hash].js", // 引入文件名的名称
          entryFileNames: "static/js/[name]-[hash].js", // 包的入口文件名称
          assetFileNames: "static/[ext]/[name]-[hash].[ext]", // 资源文件像 字体，图片等
          // 合并路由打包
          manualChunks: {
            react: ["react", "react-dom", "react-router-dom"],
            store: ["redux", "react-redux", "@reduxjs/toolkit", "redux-persist"]
          },
        },
      },
      commonjsOptions: {
        // 将 CommonJS 模块转换为 ES6 模块的配置项。可以通过该选项来优化 CommonJS 模块的加载方式，以提升打包速度和代码质量。
        transformMixedEsModules: true,
      },
      // 文件内联的大小限制。可以通过该选项来控制文件内联的大小，以提升加载速度
      assetsInlineLimit: 10 * 1024, // 默认 4096 资源内联大小限制（单位：字节），小于此值的资源将被内联为 base64
    },
  };
});
