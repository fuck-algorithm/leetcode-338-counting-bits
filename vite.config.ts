import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/fuck-algorithm/leetcode-338-counting-bits/', // GitHub Pages子路径
  build: {
    outDir: 'dist', // 输出目录
    assetsDir: 'assets', // 静态资源目录
    emptyOutDir: true, // 构建前清空输出目录
    sourcemap: true, // 生成sourcemap文件
  },
  server: {
    open: true, // 自动打开浏览器
    port: 3000, // 开发服务器端口
  },
})
