# LeetCode 338: Counting Bits

这是一个演示LeetCode 338题"计数比特位"的React+TypeScript应用。

## 题目描述

给你一个整数 n ，计算从 0 到 n 的每个整数的二进制表示中 1 的个数。

## 解题思路

本应用提供了多种算法实现，并通过动画可视化展示每种算法的实现过程：

1. **Brian Kernighan算法**：利用 `n & (n-1)` 来消除最低位的1，每执行一次操作就计数加1，直到n变为0。

2. **动态规划 - 最高有效位**：
   - 对于2的幂次方数，其二进制表示中只有一个1
   - 对于其他数字，其1的个数等于 `bits[i - highBit] + 1`，其中highBit是小于等于i的最大2的幂次方

3. **动态规划 - 最低有效位**：
   - bits[i] = bits[i >> 1] + (i & 1)
   - 即i的1的个数 = i/2的1的个数 + i的最低位是否为1

4. **动态规划 - 最低设置位**：
   - bits[i] = bits[i & (i-1)] + 1
   - 利用Brian Kernighan算法的思想进行动态规划

5. **算法比较视图**：
   - 可同时展示多种算法的执行效果
   - 支持实时对比不同算法在相同数据集上的表现
   - 通过不同颜色的曲线直观展示各算法结果

## 项目技术栈

- React 19
- TypeScript
- Vite
- D3.js (数据可视化)
- GitHub Pages

## 主要功能

- 交互式算法可视化
- 二进制位动画展示
- 算法多步骤执行展示
- 多算法性能比较
- 响应式设计，适配不同屏幕大小

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
