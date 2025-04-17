// 方法一：Brian Kernighan算法
export function countBitsBrianKernighan(n: number): number[] {
  const result = new Array(n + 1).fill(0);
  
  for (let i = 1; i <= n; i++) {
    result[i] = countOnes(i);
  }
  
  return result;
}

// Brian Kernighan算法计算一个数中1的个数
// 该算法的原理是：x & (x-1) 可以消除 x 二进制表示中最低位的1
export function countOnes(x: number): number {
  let ones = 0;
  while (x > 0) {
    x &= (x - 1); // 消除最低位的1
    ones++;
  }
  return ones;
}

// 方法二：动态规划——最高有效位
export function countBitsDPHighestBit(n: number): number[] {
  const bits = new Array(n + 1).fill(0);
  let highBit = 0;
  
  for (let i = 1; i <= n; i++) {
    // 如果 i 是 2 的幂，更新 highBit
    if ((i & (i - 1)) === 0) {
      highBit = i;
    }
    bits[i] = bits[i - highBit] + 1;
  }
  
  return bits;
}

// 方法三：动态规划——最低有效位
export function countBitsDPLowestBit(n: number): number[] {
  const bits = new Array(n + 1).fill(0);
  
  for (let i = 1; i <= n; i++) {
    // i>>1 是去掉最低位的数，i&1 是判断最低位是否为1
    bits[i] = bits[i >> 1] + (i & 1);
  }
  
  return bits;
}

// 方法四：动态规划——最低设置位
export function countBitsDPLeastSignificantBit(n: number): number[] {
  const bits = new Array(n + 1).fill(0);
  
  for (let i = 1; i <= n; i++) {
    // i & (i-1) 可以消除最低位的1
    bits[i] = bits[i & (i - 1)] + 1;
  }
  
  return bits;
}

// 生成演示用的动画数据
export function generateAnimationData(algorithm: (n: number) => number[], n: number): { x: number; y: number }[] {
  const results = algorithm(n);
  return results.map((count, index) => ({
    x: index,
    y: count,
  }));
}

// 将数字转换为二进制字符串并填充到指定长度
export function toBinaryString(num: number, padding: number = 0): string {
  return num.toString(2).padStart(padding, '0');
}

// 获取一个数的二进制长度
export function getBinaryLength(n: number): number {
  return n.toString(2).length;
} 