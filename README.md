# LeetCode 338: Counting Bits

这是一个演示LeetCode 338题"计数比特位"的React+TypeScript应用。

## 题目描述

给你一个整数 n ，计算从 0 到 n 的每个整数的二进制表示中 1 的个数。

## 解题思路

本应用使用动态规划方法解决问题：
- i的1的个数 = i/2的1的个数 + i的最低位是否为1
- 公式：bits[i] = bits[i >> 1] + (i & 1)

## 项目技术栈

- React 19
- TypeScript
- Vite
- GitHub Pages

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 部署到GitHub Pages
npm run deploy
```

## 在线演示

访问 [https://cc11001100.github.io/fuck-algorithm/leetcode-338-counting-bits](https://cc11001100.github.io/fuck-algorithm/leetcode-338-counting-bits) 查看在线演示。
