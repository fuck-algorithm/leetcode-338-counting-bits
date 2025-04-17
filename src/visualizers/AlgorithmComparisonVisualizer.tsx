import React, { useState, useEffect } from 'react';
import CoordinateSystem from '../components/CoordinateSystem';
import BinaryDisplay from '../components/BinaryDisplay';
import AnimationControls from '../components/AnimationControls';
import { useAnimation } from '../hooks/useAnimation';
import { 
  countBitsBrianKernighan, 
  countBitsDPHighestBit, 
  countBitsDPLowestBit, 
  countBitsDPLeastSignificantBit,
  generateAnimationData, 
  getBinaryLength 
} from '../algorithms';
import './AlgorithmComparisonVisualizer.css';

interface AlgorithmComparisonVisualizerProps {
  n: number;
}

interface AlgorithmData {
  name: string;
  id: string;
  description: string;
  countFunction: (n: number) => number[];
  color: string;
}

interface StepData {
  number: number;
  binary: string;
  results: {
    [key: string]: {
      bits: number;
      highlightBits: number[];
    }
  };
}

const AlgorithmComparisonVisualizer: React.FC<AlgorithmComparisonVisualizerProps> = ({ n }) => {
  const maxBinaryLength = getBinaryLength(n);
  
  // 定义所有算法
  const algorithms: AlgorithmData[] = [
    {
      name: 'Brian Kernighan',
      id: 'brianKernighan',
      description: '利用n&(n-1)消除最低的1',
      countFunction: countBitsBrianKernighan,
      color: 'hsl(210, 80%, 60%)'
    },
    {
      name: 'DP最高有效位',
      id: 'dpHighestBit',
      description: 'bits[i] = bits[i-highBit] + 1',
      countFunction: countBitsDPHighestBit,
      color: 'hsl(120, 80%, 60%)'
    },
    {
      name: 'DP最低有效位',
      id: 'dpLowestBit',
      description: 'bits[i] = bits[i>>1] + (i&1)',
      countFunction: countBitsDPLowestBit,
      color: 'hsl(30, 80%, 60%)'
    },
    {
      name: 'DP最低设置位',
      id: 'dpLeastSignificantBit',
      description: 'bits[i] = bits[i&(i-1)] + 1',
      countFunction: countBitsDPLeastSignificantBit,
      color: 'hsl(270, 80%, 60%)'
    }
  ];

  // 存储所有算法的结果
  const [algorithmResults, setAlgorithmResults] = useState<{[key: string]: number[]}>({}); 
  const [selectedAlgorithms, setSelectedAlgorithms] = useState<string[]>(['brianKernighan', 'dpHighestBit']);
  const [points, setPoints] = useState<{[key: string]: {x: number, y: number}[]}>({});
  
  // 初始化所有算法的结果
  useEffect(() => {
    const results: {[key: string]: number[]} = {};
    const pointsData: {[key: string]: {x: number, y: number}[]} = {};
    
    algorithms.forEach(algo => {
      results[algo.id] = algo.countFunction(n);
      pointsData[algo.id] = generateAnimationData(algo.countFunction, n);
    });
    
    setAlgorithmResults(results);
    setPoints(pointsData);
  }, [n]);
  
  // 为每个数字生成步骤
  const generateStepsData = (): StepData[] => {
    const stepsData: StepData[] = [];
    
    for (let i = 0; i <= n; i++) {
      const binary = i.toString(2).padStart(maxBinaryLength, '0');
      const stepResults: { [key: string]: { bits: number; highlightBits: number[] } } = {};
      
      algorithms.forEach(algo => {
        // 结果可能还未计算
        if (!algorithmResults[algo.id]) return;
        
        const bits = algorithmResults[algo.id][i];
        
        // 找出所有的1位
        const highlightBits: number[] = [];
        for (let j = 0; j < binary.length; j++) {
          if (binary[j] === '1') {
            highlightBits.push(j);
          }
        }
        
        stepResults[algo.id] = {
          bits,
          highlightBits
        };
      });
      
      stepsData.push({
        number: i,
        binary,
        results: stepResults
      });
    }
    
    return stepsData;
  };
  
  const stepsData = generateStepsData();
  
  const { 
    currentStep, 
    isPlaying, 
    progress, 
    play, 
    pause, 
    reset, 
    nextStep, 
    prevStep, 
    goToStep 
  } = useAnimation({
    totalSteps: stepsData.length,
    initialStep: -1,
    autoPlay: false,
    delay: 1000,
  });
  
  // 当前步骤的数据
  const currentStepData = currentStep >= 0 && currentStep < stepsData.length 
    ? stepsData[currentStep] 
    : null;
  
  // 计算不同算法的高亮点
  const highlightedPoints = selectedAlgorithms.map(algoId => {
    if (!currentStepData || !currentStepData.results[algoId]) return null;
    
    return {
      x: currentStepData.number,
      y: currentStepData.results[algoId].bits,
      color: algorithms.find(a => a.id === algoId)?.color || 'blue'
    };
  }).filter(Boolean);
  
  // 计算当前可见的点 (根据选中的算法)
  const visiblePointsByAlgo = selectedAlgorithms.reduce((acc, algoId) => {
    if (!points[algoId]) return acc;
    
    acc[algoId] = currentStep >= 0 
      ? points[algoId].filter(point => point.x <= (currentStepData?.number ?? 0))
      : [];
      
    return acc;
  }, {} as {[key: string]: {x: number, y: number}[]});
  
  // 切换算法选择
  const toggleAlgorithm = (algoId: string) => {
    if (selectedAlgorithms.includes(algoId)) {
      setSelectedAlgorithms(selectedAlgorithms.filter(id => id !== algoId));
    } else {
      setSelectedAlgorithms([...selectedAlgorithms, algoId]);
    }
  };
  
  // 获取最大Y值
  const getMaxY = () => {
    let maxY = 0;
    selectedAlgorithms.forEach(algoId => {
      if (algorithmResults[algoId]) {
        const max = Math.max(...algorithmResults[algoId]);
        if (max > maxY) maxY = max;
      }
    });
    return maxY || 1;
  };
  
  return (
    <div className="algorithm-visualizer comparison-visualizer">
      <div className="visualizer-header">
        <h3>算法比较可视化</h3>
        <div className="algorithm-selector">
          {algorithms.map(algo => (
            <label key={algo.id} className="algorithm-checkbox">
              <input 
                type="checkbox" 
                checked={selectedAlgorithms.includes(algo.id)}
                onChange={() => toggleAlgorithm(algo.id)}
                style={{ accentColor: algo.color }}
              />
              <span style={{ color: algo.color }}>{algo.name}</span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="visualizer-content">
        <div className="visualizer-main">
          <CoordinateSystem
            points={[]}
            width={800}
            height={500}
            margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
            highlightedPoint={null}
            maxX={n}
            maxY={getMaxY()}
            multiSeriesData={Object.entries(visiblePointsByAlgo).map(([algoId, pts]) => ({
              points: pts,
              color: algorithms.find(a => a.id === algoId)?.color || 'blue',
              id: algoId
            }))}
            highlightedPoints={highlightedPoints}
          />
        </div>
        
        <div className="visualizer-details">
          {currentStepData && (
            <>
              <div className="step-info">
                <h4>当前处理的数字: {currentStepData.number}</h4>
                <div className="binary-display-container">
                  <h4>二进制表示:</h4>
                  <BinaryDisplay
                    number={currentStepData.number}
                    padding={maxBinaryLength}
                    highlightBits={[]}
                  />
                </div>
                
                <div className="algorithm-results">
                  <h4>各算法计算结果:</h4>
                  <div className="results-grid">
                    {selectedAlgorithms.map(algoId => {
                      const algo = algorithms.find(a => a.id === algoId);
                      const result = currentStepData.results[algoId];
                      
                      if (!algo || !result) return null;
                      
                      return (
                        <div key={algoId} className="result-item" style={{ borderColor: algo.color }}>
                          <div className="result-header" style={{ backgroundColor: algo.color }}>
                            {algo.name}
                          </div>
                          <div className="result-content">
                            <p>1的个数: <strong>{result.bits}</strong></p>
                            <p className="result-description">{algo.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      <div className="visualizer-controls">
        <AnimationControls
          currentStep={currentStep}
          totalSteps={stepsData.length}
          isPlaying={isPlaying}
          progress={progress}
          onPlay={play}
          onPause={pause}
          onReset={reset}
          onNextStep={nextStep}
          onPrevStep={prevStep}
          onGoToStep={goToStep}
        />
      </div>
    </div>
  );
};

export default AlgorithmComparisonVisualizer; 