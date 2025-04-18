import { useState } from 'react'
import './App.css'
import AlgorithmSelector, { AlgorithmType } from './components/AlgorithmSelector'
import VisualizerContainer from './components/VisualizerContainer'

function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType | null>(null);

  const handleSelectAlgorithm = (algorithm: AlgorithmType) => {
    setSelectedAlgorithm(algorithm);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="nav-left">
            <a 
              href="https://fuck-algorithm.github.io/leetcode-hot-100/" 
              className="back-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              &larr; 返回LeetCode Hot 100
            </a>
          </div>
          
          <h1>
            <a 
              href="https://leetcode.cn/problems/counting-bits" 
              target="_blank" 
              rel="noopener noreferrer"
              className="title-link"
            >
              LeetCode 338: 比特位计数 - 算法动画演示
            </a>
          </h1>
          
          <div className="nav-right">
            <a 
              href="https://github.com/fuck-algorithm/leetcode-338-counting-bits" 
              className="github-link"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub仓库"
            >
              <svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor">
                <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
            </a>
          </div>
        </div>
        
        <p className="app-description">
          通过动画演示直观理解不同的比特位计数算法，包括Brian Kernighan算法和各种动态规划方法。
        </p>
      </header>
      
      <main className="app-main">
        <div className="selector-section">
          <AlgorithmSelector 
            currentAlgorithm={selectedAlgorithm} 
            onSelectAlgorithm={handleSelectAlgorithm} 
          />
        </div>
        
        <div className="visualizer-section">
          <VisualizerContainer algorithm={selectedAlgorithm} />
        </div>
      </main>
      
      <footer className="app-footer">
        <p>LeetCode 338: 比特位计数 - 算法可视化 &copy; 2023</p>
      </footer>
    </div>
  )
}

export default App
