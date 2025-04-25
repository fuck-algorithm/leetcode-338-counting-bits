# LeetCode 338: 比特位计数 - 算法可视化

[![Deploy to GitHub Pages](https://github.com/fuck-algorithm/leetcode-338-counting-bits/actions/workflows/deploy.yml/badge.svg)](https://github.com/fuck-algorithm/leetcode-338-counting-bits/actions/workflows/deploy.yml)

一个互动式算法可视化工具，帮助你理解 LeetCode 338 "比特位计数" 问题的多种解法。直观展示不同算法的执行过程，让抽象概念变得具体可见。

## 🔥 在线演示

**[点击此处访问在线演示](https://fuck-algorithm.github.io/leetcode-338-counting-bits/)**

## 📝 题目描述

给你一个整数 `n`，计算从 `0` 到 `n` 的每个整数的二进制表示中 `1` 的个数，并以数组形式返回。

**示例:**
```
输入: n = 5
输出: [0,1,1,2,1,2]
解释:
0 --> 0     (0个1)
1 --> 1     (1个1)
2 --> 10    (1个1)
3 --> 11    (2个1)
4 --> 100   (1个1)
5 --> 101   (2个1)
```

## 🧠 算法实现

本应用实现并可视化了多种解决方案：

### 1. Brian Kernighan算法
- 利用位运算技巧 `n & (n-1)` 消除最低位的1
- 每次操作计数加1，直到数字变为0
- 时间复杂度：O(∑bits)，其中bits为所有数字中1的个数总和

### 2. 动态规划 - 最高有效位 (High Bit)
- 对于2的幂，二进制表示中只有一个1
- 对于其他数字 `i`，`bits[i] = bits[i - highBit] + 1`
- 其中`highBit`是小于等于`i`的最大2的幂
- 时间复杂度：O(n)

### 3. 动态规划 - 最低有效位 (Low Bit)
- 公式：`bits[i] = bits[i >> 1] + (i & 1)`
- 右移一位后1的个数，再加上最低位是否为1
- 时间复杂度：O(n)

### 4. 动态规划 - 最低设置位 (Least Significant Bit)
- 公式：`bits[i] = bits[i & (i-1)] + 1`
- 结合Brian Kernighan算法思想和动态规划
- 时间复杂度：O(n)

## ✨ 项目特点

- **交互式动画**: 逐步展示算法执行过程
- **可视化图表**: 直观展示数字与1的个数关系
- **二进制位展示**: 清晰显示二进制表示和位操作
- **多算法对比**: 同时比较不同算法的执行结果
- **键盘快捷键**: 支持左右方向键、空格键和R键控制动画
- **随机数生成**: 一键生成随机测试用例
- **响应式设计**: 适配不同设备屏幕

## 🖥️ 使用指南

1. 从页面顶部选择您想要探索的算法
2. 使用数字输入框设置n的值(0-30)，或点击🎲骰子按钮生成随机值
3. 使用控制面板或键盘快捷键操作动画:
   - **⏮️ 或 ←**: 上一步
   - **▶️/⏸️ 或 空格**: 播放/暂停
   - **⏭️ 或 →**: 下一步
   - **重置 或 R**: 重置动画
4. 观察右侧面板查看每一步的详细解释
5. 在算法比较视图中勾选多种算法进行比较

## 🔧 本地开发

```bash
# 克隆仓库
git clone https://github.com/fuck-algorithm/leetcode-338-counting-bits.git
cd leetcode-338-counting-bits

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 🛠️ 技术栈

- **React 19** - 用户界面构建
- **TypeScript** - 类型安全
- **Vite** - 快速开发和构建
- **D3.js** - 数据可视化
- **GitHub Pages** - 托管部署

## 📚 相关资源

- [LeetCode 338题原题](https://leetcode.cn/problems/counting-bits/)
- [Brian Kernighan算法介绍](https://leetcode.cn/problems/counting-bits/solutions/11511/c-dong-tai-gui-hua-si-lu-xiang-jie-by-de-5y9q/)
- [位运算与动态规划](https://leetcode.cn/problems/counting-bits/solutions/6913/hen-qing-xi-de-si-lu-by-duadua/)

## 📄 许可证

[MIT License](LICENSE)

---

项目由 [fuck-algorithm](https://github.com/fuck-algorithm) 开发与维护
