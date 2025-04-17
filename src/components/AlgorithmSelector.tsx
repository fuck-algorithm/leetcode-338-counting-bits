import React from 'react';

export type AlgorithmType = 'brianKernighan' | 'dpHighestBit' | 'dpLowestBit' | 'dpLeastSignificantBit';

interface AlgorithmSelectorProps {
  currentAlgorithm: AlgorithmType | null;
  onSelectAlgorithm: (algorithm: AlgorithmType) => void;
}

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({ 
  currentAlgorithm, 
  onSelectAlgorithm 
}) => {
  const algorithms = [
    { id: 'brianKernighan', name: '方法一：Brian Kernighan算法' },
    { id: 'dpHighestBit', name: '方法二：动态规划——最高有效位' },
    { id: 'dpLowestBit', name: '方法三：动态规划——最低有效位' },
    { id: 'dpLeastSignificantBit', name: '方法四：动态规划——最低设置位' },
  ];

  return (
    <div className="algorithm-selector">
      <h2>选择算法演示</h2>
      <div className="algorithm-buttons">
        {algorithms.map((algorithm) => (
          <button
            key={algorithm.id}
            className={`algorithm-button ${currentAlgorithm === algorithm.id ? 'active' : ''}`}
            onClick={() => onSelectAlgorithm(algorithm.id as AlgorithmType)}
          >
            {algorithm.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AlgorithmSelector; 