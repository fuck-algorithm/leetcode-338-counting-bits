import { useState } from 'react'
import './App.css'

// LeetCode 338: Counting Bits 解决方案
const countBits = (n: number): number[] => {
  const result = new Array(n + 1).fill(0);
  
  for (let i = 1; i <= n; i++) {
    // 使用动态规划: i的1的个数 = i/2的1的个数 + i的最低位是否为1
    result[i] = result[i >> 1] + (i & 1);
  }
  
  return result;
};

function App() {
  const [number, setNumber] = useState<number>(5);
  const bitsCount = countBits(number);

  return (
    <div className="container">
      <h1>LeetCode 338: Counting Bits</h1>
      <p>给你一个整数 n ，计算从 0 到 n 的每个整数的二进制表示中 1 的个数。</p>
      
      <div className="input-section">
        <label htmlFor="number-input">输入一个整数 (0-30):</label>
        <input
          id="number-input"
          type="number"
          min="0"
          max="30"
          value={number}
          onChange={(e) => setNumber(Math.min(30, Math.max(0, parseInt(e.target.value) || 0)))}
        />
      </div>
      
      <div className="results-section">
        <h2>结果:</h2>
        <table>
          <thead>
            <tr>
              <th>数字</th>
              <th>二进制</th>
              <th>1的个数</th>
            </tr>
          </thead>
          <tbody>
            {bitsCount.map((count, index) => (
              <tr key={index}>
                <td>{index}</td>
                <td>{index.toString(2).padStart(Math.max(...bitsCount.map(n => n.toString(2).length)), '0')}</td>
                <td>{count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
