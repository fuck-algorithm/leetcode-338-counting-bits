import React from 'react';
import { AlgorithmType } from './AlgorithmSelector';

interface AlgorithmInfoProps {
  algorithm: AlgorithmType;
}

const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({ algorithm }) => {
  const algorithmDetails = {
    brianKernighan: {
      name: 'Brian Kernighan算法',
      description: '利用位运算的技巧，使用 x & (x-1) 来快速消除二进制表示中最低位的1',
      timecomplexity: 'O(nlogn)',
      spacecomplexity: 'O(1)',
      steps: [
        '初始化结果数组 result，长度为n+1，初始值全部为0',
        '从1到n遍历每个数字i',
        '对每个数字i，使用countOnes函数计算i中1的个数',
        'countOnes函数原理：每次操作x & (x-1)可以消除二进制中最低位的1',
        '重复此操作直到x变为0，统计操作次数即为1的个数'
      ]
    },
    dpHighestBit: {
      name: '动态规划——最高有效位',
      description: '利用动态规划，结合最高有效位的性质计算比特位',
      timecomplexity: 'O(n)',
      spacecomplexity: 'O(1)',
      steps: [
        '初始化结果数组 bits，长度为n+1，bits[0] = 0',
        '初始化 highBit = 0，表示当前处理数字的二进制表示中的最高有效位',
        '从1到n遍历每个数字i',
        '如果 i & (i-1) == 0，说明i是2的幂，更新 highBit = i',
        '动态规划状态转移：bits[i] = bits[i - highBit] + 1'
      ]
    },
    dpLowestBit: {
      name: '动态规划——最低有效位',
      description: '利用动态规划，结合最低有效位计算比特位',
      timecomplexity: 'O(n)',
      spacecomplexity: 'O(1)',
      steps: [
        '初始化结果数组 bits，长度为n+1，bits[0] = 0',
        '从1到n遍历每个数字i',
        '将i右移一位，即 i>>1，表示去掉最低位的数字',
        '判断i的最低位是否为1，即 i&1',
        '动态规划状态转移：bits[i] = bits[i>>1] + (i&1)'
      ]
    },
    dpLeastSignificantBit: {
      name: '动态规划——最低设置位',
      description: '利用动态规划，使用i & (i-1)计算比特位',
      timecomplexity: 'O(n)',
      spacecomplexity: 'O(1)',
      steps: [
        '初始化结果数组 bits，长度为n+1，bits[0] = 0',
        '从1到n遍历每个数字i',
        '计算 i & (i-1)，这会消除i中最低位的1',
        '动态规划状态转移：bits[i] = bits[i & (i-1)] + 1'
      ]
    },
    comparison: {
      name: '算法比较视图',
      description: '比较不同算法在计算比特位时的执行过程和结果',
      timecomplexity: '因算法而异',
      spacecomplexity: '因算法而异',
      steps: [
        '将多种算法应用于相同的输入范围',
        '通过不同颜色的曲线区分各算法的结果',
        '支持实时切换需要展示的算法',
        '提供直观的对比视图以便理解算法差异'
      ]
    }
  };

  const details = algorithmDetails[algorithm] || algorithmDetails.brianKernighan;

  return (
    <div className="algorithm-info">
      <h3>{details.name}</h3>
      <p className="description">{details.description}</p>
      
      <div className="complexity">
        <p><strong>时间复杂度：</strong> {details.timecomplexity}</p>
        <p><strong>空间复杂度：</strong> {details.spacecomplexity}</p>
      </div>
      
      <div className="steps">
        <h4>算法步骤：</h4>
        <ol>
          {details.steps.map((step: string, index: number) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default AlgorithmInfo; 