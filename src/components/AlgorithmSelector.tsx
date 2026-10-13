import React from 'react'

export type AlgorithmType = 'brianKernighan' | 'dpHighestBit' | 'dpLowestBit' | 'dpLeastSignificantBit' | 'comparison'

interface AlgorithmSelectorProps {
  currentAlgorithm: AlgorithmType | null
  onSelectAlgorithm: (algorithm: AlgorithmType) => void
}

const algorithms: { id: AlgorithmType; name: string }[] = [
  { id: 'brianKernighan', name: 'Brian Kernighan' },
  { id: 'dpHighestBit', name: '动态规划 · 最高有效位' },
  { id: 'dpLowestBit', name: '动态规划 · 最低有效位' },
  { id: 'dpLeastSignificantBit', name: '动态规划 · 最低设置位' },
  { id: 'comparison', name: '算法比较' },
]

const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({ currentAlgorithm, onSelectAlgorithm }) => (
  <nav className="algorithm-selector" aria-label="选择算法">
    <div className="algorithm-buttons">
      {algorithms.map((algorithm, index) => (
        <button
          key={algorithm.id}
          type="button"
          className={`algorithm-button ${currentAlgorithm === algorithm.id ? 'active' : ''}`}
          onClick={() => onSelectAlgorithm(algorithm.id)}
          aria-current={currentAlgorithm === algorithm.id ? 'page' : undefined}
        >
          <span className="algorithm-marker" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <span>{algorithm.name}</span>
        </button>
      ))}
    </div>
  </nav>
)

export default AlgorithmSelector
