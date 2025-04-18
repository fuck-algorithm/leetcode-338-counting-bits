import React from 'react';
import CoordinateSystem from '../components/CoordinateSystem';
import BinaryDisplay from '../components/BinaryDisplay';
import AlgorithmInfo from '../components/AlgorithmInfo';
import AnimationControls from '../components/AnimationControls';
import { useAnimation } from '../hooks/useAnimation';
import { countBitsDPLeastSignificantBit, generateAnimationData, getBinaryLength } from '../algorithms';

interface DPLeastSignificantBitVisualizerProps {
  n: number;
}

interface StepData {
  number: number;
  binary: string;
  bits: number;
  result: number;
  highlightBits: number[];
}

const DPLeastSignificantBitVisualizer: React.FC<DPLeastSignificantBitVisualizerProps> = ({ n }) => {
  const maxBinaryLength = getBinaryLength(n);
  const results = countBitsDPLeastSignificantBit(n);
  const points = generateAnimationData(countBitsDPLeastSignificantBit, n);
  
  // 生成每个数字的详细步骤数据
  const generateStepsData = (): StepData[] => {
    const stepsData: StepData[] = [];
    
    // 处理数字0
    stepsData.push({
      number: 0,
      binary: '0'.padStart(maxBinaryLength, '0'),
      bits: 0,
      result: 0,
      highlightBits: [],
    });
    
    // 处理数字1~n
    for (let i = 1; i <= n; i++) {
      const binary = i.toString(2).padStart(maxBinaryLength, '0');
      const result = i & (i - 1);
      const bits = results[i];
      
      // 找出消除的最低设置位
      const prevBinary = i.toString(2).padStart(maxBinaryLength, '0');
      const resultBinary = result.toString(2).padStart(maxBinaryLength, '0');
      const highlightBits: number[] = [];
      
      for (let j = 0; j < maxBinaryLength; j++) {
        if (prevBinary[j] !== resultBinary[j]) {
          highlightBits.push(j);
        }
      }
      
      stepsData.push({
        number: i,
        binary,
        bits,
        result,
        highlightBits,
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
  });
  
  // 当前步骤的数据
  const currentStepData = currentStep >= 0 && currentStep < stepsData.length 
    ? stepsData[currentStep] 
    : null;
  
  // 当前要高亮显示的点
  const highlightedPoint = currentStepData ? {
    x: currentStepData.number,
    y: currentStepData.bits,
  } : null;
  
  // 计算当前可见的点
  const visiblePoints = currentStep >= 0 
    ? points.filter(point => point.x <= (currentStepData?.number ?? 0))
    : [];
  
  return (
    <div className="algorithm-visualizer dp-least-significant-bit-visualizer">
      <div className="visualizer-header">
        <AlgorithmInfo algorithm="dpLeastSignificantBit" />
      </div>
      
      <div className="visualizer-content">
        <div className="visualizer-main">
          <CoordinateSystem
            points={visiblePoints}
            width={600}
            height={400}
            margin={{ top: 20, right: 20, bottom: 40, left: 40 }}
            highlightedPoint={highlightedPoint}
            maxX={n}
            maxY={Math.max(...results)}
          />
        </div>
        
        <div className="visualizer-details">
          {currentStepData && (
            <>
              <div className="step-info">
                <h4>当前步骤：</h4>
                <p>处理数字：{currentStepData.number}</p>
                <p>i & (i-1)：{currentStepData.result}</p>
                <p>1的个数：{currentStepData.bits}</p>
                {currentStepData.number > 0 && (
                  <p className="formula">
                    bits[{currentStepData.number}] = bits[{currentStepData.result}] + 1 = {currentStepData.bits}
                  </p>
                )}
              </div>
              
              <div className="binary-info">
                <h4>二进制表示：</h4>
                <BinaryDisplay
                  number={currentStepData.number}
                  padding={maxBinaryLength}
                  highlightBits={currentStepData.highlightBits}
                />
                <div className="operation">
                  <div className="operation-row">
                    <span className="operation-label">i:</span>
                    <span className="operation-value">{currentStepData.number} = {currentStepData.binary}</span>
                  </div>
                  <div className="operation-row">
                    <span className="operation-label">i-1:</span>
                    <span className="operation-value">{currentStepData.number - 1} = {(currentStepData.number - 1).toString(2).padStart(maxBinaryLength, '0')}</span>
                  </div>
                  <div className="operation-row">
                    <span className="operation-label">i & (i-1):</span>
                    <span className="operation-value">{currentStepData.result} = {currentStepData.result.toString(2).padStart(maxBinaryLength, '0')}</span>
                  </div>
                </div>
                <p className="operation-info">
                  i & (i-1) 操作消除了 i 二进制表示中最低位的1
                </p>
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

export default DPLeastSignificantBitVisualizer; 