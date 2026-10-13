import React, { useState } from 'react'
import { AlgorithmType } from './AlgorithmSelector'
import {
  BrianKernighanVisualizer,
  DPHighestBitVisualizer,
  DPLowestBitVisualizer,
  DPLeastSignificantBitVisualizer,
  AlgorithmComparisonVisualizer,
} from '../visualizers'

interface VisualizerContainerProps {
  algorithm: AlgorithmType | null
}

const VisualizerContainer: React.FC<VisualizerContainerProps> = ({ algorithm }) => {
  const [inputN, setInputN] = useState(() => Math.floor(Math.random() * 31))

  const handleNChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(event.target.value, 10)
    if (Number.isInteger(value) && value >= 0 && value <= 30) {
      setInputN(value)
    }
  }

  const handleRandomClick = () => {
    setInputN(Math.floor(Math.random() * 31))
  }

  return (
    <div className="visualizer-container">
      <div className="workspace-toolbar">
        <div className="workspace-title">
          <span className="workspace-kicker">BITWISE LAB <span aria-hidden="true">/</span> 338</span>
          <h1>比特位计数</h1>
          <p>计算 0 到 n 中，每个整数二进制表示里 1 的数量。</p>
        </div>
        <div className="n-input-container">
          <label htmlFor="n-input">上限 <span>n</span></label>
          <input
            id="n-input"
            type="number"
            min="0"
            max="30"
            value={inputN}
            onChange={handleNChange}
            aria-label="设置 n 的值，范围 0 到 30"
          />
          <button
            className="random-button"
            type="button"
            onClick={handleRandomClick}
            title="随机生成一个值"
            aria-label="随机生成 n 值"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M15.5 3.5h2v5h-5v-2h2.1l-3.1 3.1-3-3-5.8 5.8-1.4-1.4 7.2-7.2 3 3 2.5-2.5h-2.5v-2h4zM4.3 16.5H2.9l4.5-4.5 3 3 1.8-1.8 1.4 1.4-3.2 3.2-3-3-1.7 1.7z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="visualizer-wrapper">
        {algorithm === 'brianKernighan' && <BrianKernighanVisualizer n={inputN} />}
        {algorithm === 'dpHighestBit' && <DPHighestBitVisualizer n={inputN} />}
        {algorithm === 'dpLowestBit' && <DPLowestBitVisualizer n={inputN} />}
        {algorithm === 'dpLeastSignificantBit' && <DPLeastSignificantBitVisualizer n={inputN} />}
        {algorithm === 'comparison' && <AlgorithmComparisonVisualizer n={inputN} />}
        {!algorithm && <div className="empty-workspace">从左侧选择一种算法，查看它如何逐步得到结果。</div>}
      </div>
    </div>
  )
}

export default VisualizerContainer
