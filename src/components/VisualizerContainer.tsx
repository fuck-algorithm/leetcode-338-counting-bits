import React, { useState, useEffect } from 'react';
import { AlgorithmType } from './AlgorithmSelector';
import {
  BrianKernighanVisualizer,
  DPHighestBitVisualizer,
  DPLowestBitVisualizer,
  DPLeastSignificantBitVisualizer,
  AlgorithmComparisonVisualizer
} from '../visualizers';

interface VisualizerContainerProps {
  algorithm: AlgorithmType | null;
}

const VisualizerContainer: React.FC<VisualizerContainerProps> = ({ algorithm }) => {
  // 生成0-30之间的随机整数
  const getRandomN = () => Math.floor(Math.random() * 31);
  
  const [inputN, setInputN] = useState<number>(getRandomN());
  
  // 页面初始化时使用随机值
  useEffect(() => {
    setInputN(getRandomN());
  }, []);
  
  const handleNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 0 && value <= 30) {
      setInputN(value);
    }
  };
  
  const handleRandomClick = () => {
    setInputN(getRandomN());
  };
  
  if (!algorithm) {
    return (
      <div className="visualizer-container empty">
        <div className="welcome-message">
          <h2>LeetCode 338: 比特位计数</h2>
          <p>请从上方选择一种算法来查看动画演示。</p>
          <p>该问题的要求是：给你一个整数 n ，计算从 0 到 n 的每个整数的二进制表示中 1 的个数。</p>
          <div className="n-input-container">
            <label htmlFor="n-input">设置 n 的值 (0-30):</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                id="n-input"
                type="number"
                min="0"
                max="30"
                value={inputN}
                onChange={handleNChange}
              />
              <button 
                onClick={handleRandomClick}
                style={{ 
                  marginLeft: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  background: '#f8f9fa',
                  cursor: 'pointer'
                }}
                title="随机生成一个值"
              >
                🎲
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="visualizer-container">
      <div className="n-input-container">
        <label htmlFor="n-input">设置 n 的值 (0-30):</label>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <input
            id="n-input"
            type="number"
            min="0"
            max="30"
            value={inputN}
            onChange={handleNChange}
          />
          <button 
            onClick={handleRandomClick}
            style={{ 
              marginLeft: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '4px 8px',
              background: '#f8f9fa',
              cursor: 'pointer'
            }}
            title="随机生成一个值"
          >
            🎲
          </button>
        </div>
      </div>
      
      <div className="visualizer-wrapper">
        {algorithm === 'brianKernighan' && <BrianKernighanVisualizer n={inputN} />}
        {algorithm === 'dpHighestBit' && <DPHighestBitVisualizer n={inputN} />}
        {algorithm === 'dpLowestBit' && <DPLowestBitVisualizer n={inputN} />}
        {algorithm === 'dpLeastSignificantBit' && <DPLeastSignificantBitVisualizer n={inputN} />}
        {algorithm === 'comparison' && <AlgorithmComparisonVisualizer n={inputN} />}
      </div>
    </div>
  );
};

export default VisualizerContainer; 