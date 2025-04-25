import React from 'react';
import { AlgorithmType } from './AlgorithmSelector';

interface AlgorithmInfoProps {
  algorithm: AlgorithmType;
}

const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({ algorithm }) => {
  const algorithmDetails = {
    brianKernighan: {
      name: 'Brian Kernighan算法 (简单计数法)',
      description: '像玩消消乐一样，每次消掉一个1，看消了几次就知道有几个1',
      timecomplexity: '速度：中等',
      spacecomplexity: '内存：节省',
      steps: [
        '问题：计算0到n每个数的二进制中有多少个1',
        '方法：每次消除最右边的1，记录消除了几次',
        '特点：就像打地鼠游戏，每次打掉一个地鼠并计数',
        '举例：数字10 (二进制1010)，消掉右边1变成1000，再消掉变成0000，共消了2次，所以有2个1'
      ]
    },
    dpHighestBit: {
      name: '最高位法 (找规律)',
      description: '利用已知结果加速计算，像堆积木一样复用之前的结果',
      timecomplexity: '速度：快',
      spacecomplexity: '内存：节省',
      steps: [
        '把数字想象成两部分：最高位的1，和剩下的部分',
        '举例：数字9 (二进制1001) = 最高位(8) + 剩余部分(1)',
        '聪明方法：9中1的个数 = 1中1的个数 + 1（最高位贡献的1）',
        '像解谜游戏，用已知的小块拼出新的大块'
      ]
    },
    dpLowestBit: {
      name: '最低位法 (分奇偶)',
      description: '像拆积木一样，把数字拆成两半，一半我们已经知道答案',
      timecomplexity: '速度：快',
      spacecomplexity: '内存：节省',
      steps: [
        '把数字分成两部分：右移一位的结果，和最低位',
        '举例：7 (二进制111) = 3(11)右移 + 最低位1',
        '奇数：比它除以2的结果多一个1',
        '偶数：和它除以2的结果1的个数相同',
        '像分类游戏，奇数和偶数走不同的路'
      ]
    },
    dpLeastSignificantBit: {
      name: '最低有效位法 (去掉一个1)',
      description: '像剥洋葱，一层层剥掉最外面的1，直到全部剥完',
      timecomplexity: '速度：快',
      spacecomplexity: '内存：节省',
      steps: [
        '每个数都可以变成：消掉一个1后的数字 + 1',
        '举例：数字6 (二进制110)，消掉一个1变成4 (100)',
        '所以6中1的个数 = 4中1的个数 + 1',
        '像接力赛跑，每次传递一个1，看传了几次'
      ]
    },
    comparison: {
      name: '算法对比 (哪个更好)',
      description: '像赛车比赛，看看哪种算法跑得更快、更省油',
      timecomplexity: '各有不同',
      spacecomplexity: '各有不同',
      steps: [
        '把不同方法放在同一起跑线比较',
        '用不同颜色区分每种方法',
        '可以随时切换看不同的方法',
        '直观看出哪种方法更简单、更高效'
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
        <h4>简单理解：</h4>
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