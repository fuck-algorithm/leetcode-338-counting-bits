import './App.css'
import VisualizerContainer from './components/VisualizerContainer'

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <a className="brand-mark" href="https://fuck-algorithm.github.io/leetcode-hot-100/" aria-label="返回 LeetCode Hot 100">
          <span className="brand-symbol" aria-hidden="true">&amp;</span>
          <span className="brand-copy">
            <strong>算法拆解室</strong>
            <span>把每一步都看明白</span>
          </span>
        </a>
        <div className="header-meta">
          <span className="header-status"><i aria-hidden="true" />交互式学习</span>
          <a className="problem-link" href="https://leetcode.cn/problems/counting-bits" target="_blank" rel="noopener noreferrer">
            LeetCode 338 <span aria-hidden="true">↗</span>
          </a>
          <a className="github-link" href="https://github.com/fuck-algorithm/leetcode-338-counting-bits" target="_blank" rel="noopener noreferrer" aria-label="GitHub 仓库" title="GitHub 仓库">
            <svg height="19" width="19" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </div>
      </header>
      <VisualizerContainer />
    </div>
  )
}

export default App
