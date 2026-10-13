export type AlgorithmType = 'brianKernighan' | 'dpHighestBit' | 'dpLowestBit' | 'dpLeastSignificantBit' | 'comparison'

interface AlgorithmSelectorProps {
  currentAlgorithm: AlgorithmType | null
  onSelectAlgorithm: (_selectedAlgorithm: AlgorithmType) => void
}

const algorithms: { id: AlgorithmType; name: string }[] = [
  { id: 'brianKernighan', name: '逐个数 1' },
  { id: 'dpHighestBit', name: '找最高位' },
  { id: 'dpLowestBit', name: '看最低位' },
  { id: 'dpLeastSignificantBit', name: '清除最低位' },
  { id: 'comparison', name: '四种方法对比' },
]

export default function AlgorithmSelector({ currentAlgorithm, onSelectAlgorithm }: AlgorithmSelectorProps) {
  return (
    <nav className="lesson-tabs" aria-label="选择解法">
      {algorithms.map((algorithm, index) => (
        <button
          className={`lesson-tab ${currentAlgorithm === algorithm.id ? 'lesson-tab-active' : ''} ${algorithm.id === 'comparison' ? 'lesson-tab-compare' : ''}`}
          key={algorithm.id}
          onClick={() => onSelectAlgorithm(algorithm.id)}
          type="button"
          aria-pressed={currentAlgorithm === algorithm.id}
        >
          {algorithm.id !== 'comparison' && <span className="tab-index">{String(index + 1).padStart(2, '0')}</span>}
          <span>{algorithm.name}</span>
        </button>
      ))}
    </nav>
  )
}
