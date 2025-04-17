import React from 'react';
import CoordinateSystem from '../components/CoordinateSystem';
import BinaryDisplay from '../components/BinaryDisplay';
import AlgorithmInfo from '../components/AlgorithmInfo';
import AnimationControls from '../components/AnimationControls';
import { useAnimation } from '../hooks/useAnimation';
import { countBitsDPHighestBit, generateAnimationData, getBinaryLength } from '../algorithms';

interface DPHighestBitVisualizerProps {
  n: number;
}

interface StepData {
  number: number;
  binary: string;
  highBit: number;
  bits: number;
  updateHighBit: boolean;
  highlightBits: number[];
}

const DPHighestBitVisualizer: React.FC<DPHighestBitVisualizerProps> = ({ n }) => {
  const maxBinaryLength = getBinaryLength(n);
  const results = countBitsDPHighestBit(n);
  const points = generateAnimationData(countBitsDPHighestBit, n);
  
  // 生成每个数字的详细步骤数据
  const generateStepsData = (): StepData[] => {
    const stepsData: StepData[] = [];
    let highBit = 0;
    
    // 处理数字0
    stepsData.push({
      number: 0,
      binary: '0'.padStart(maxBinaryLength, '0'),
      highBit: 0,
      bits: 0,
      updateHighBit: false,
      highlightBits: [],
    });
    
    // 处理数字1~n
    for (let i = 1; i <= n; i++) {
      const binary = i.toString(2).padStart(maxBinaryLength, '0');
      const isPowerOfTwo = (i & (i - 1)) === 0;
      const updateHighBit = isPowerOfTwo;
      
      if (isPowerOfTwo) {
        highBit = i;
      }
      
      const bits = results[i];
      const highlightBits: number[] = [];
      
      // 高亮显示最高位的1
      const highestOneBit = binary.indexOf('1');
      if (highestOneBit >= 0) {
        highlightBits.push(highestOneBit);
      }
      
      stepsData.push({
        number: i,
        binary,
        highBit,
        bits,
        updateHighBit,
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
    delay: 1000,
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
    <div className="algorithm-visualizer dp-highest-bit-visualizer">
      <div className="visualizer-header">
        <AlgorithmInfo algorithm="dpHighestBit" />
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
                <p>当前highBit：{currentStepData.highBit}</p>
                {currentStepData.updateHighBit && (
                  <p className="update-info">发现2的幂，更新highBit = {currentStepData.highBit}</p>
                )}
                <p>1的个数：{currentStepData.bits}</p>
                {currentStepData.number > 0 && (
                  <p className="formula">
                    bits[{currentStepData.number}] = bits[{currentStepData.number} - {currentStepData.highBit}] + 1 = {currentStepData.bits}
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
                <p>
                  i & (i-1) = {currentStepData.number} & {currentStepData.number - 1} = {currentStepData.number & (currentStepData.number - 1)}
                  {(currentStepData.number & (currentStepData.number - 1)) === 0 && ' (是2的幂)'}
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

export default DPHighestBitVisualizer; 