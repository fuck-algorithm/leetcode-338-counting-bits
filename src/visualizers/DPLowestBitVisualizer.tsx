import React from 'react';
import CoordinateSystem from '../components/CoordinateSystem';
import BinaryDisplay from '../components/BinaryDisplay';
import AlgorithmInfo from '../components/AlgorithmInfo';
import AnimationControls from '../components/AnimationControls';
import { useAnimation } from '../hooks/useAnimation';
import { countBitsDPLowestBit, generateAnimationData, getBinaryLength } from '../algorithms';

interface DPLowestBitVisualizerProps {
  n: number;
}

interface StepData {
  number: number;
  binary: string;
  bits: number;
  rightShift: number;
  lowestBit: number;
  highlightBits: number[];
}

const DPLowestBitVisualizer: React.FC<DPLowestBitVisualizerProps> = ({ n }) => {
  const maxBinaryLength = getBinaryLength(n);
  const results = countBitsDPLowestBit(n);
  const points = generateAnimationData(countBitsDPLowestBit, n);
  
  // 生成每个数字的详细步骤数据
  const generateStepsData = (): StepData[] => {
    const stepsData: StepData[] = [];
    
    // 处理数字0
    stepsData.push({
      number: 0,
      binary: '0'.padStart(maxBinaryLength, '0'),
      bits: 0,
      rightShift: 0,
      lowestBit: 0,
      highlightBits: [],
    });
    
    // 处理数字1~n
    for (let i = 1; i <= n; i++) {
      const binary = i.toString(2).padStart(maxBinaryLength, '0');
      const rightShift = i >> 1;
      const lowestBit = i & 1;
      const bits = results[i];
      
      // 高亮显示最低位
      const highlightBits: number[] = [];
      highlightBits.push(binary.length - 1);
      
      stepsData.push({
        number: i,
        binary,
        bits,
        rightShift,
        lowestBit,
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
    <div className="algorithm-visualizer dp-lowest-bit-visualizer">
      <div className="visualizer-header">
        <AlgorithmInfo algorithm="dpLowestBit" />
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
                <p>右移一位 (i{'>'}1)：{currentStepData.rightShift}</p>
                <p>最低位 (i&1)：{currentStepData.lowestBit}</p>
                <p>1的个数：{currentStepData.bits}</p>
                {currentStepData.number > 0 && (
                  <p className="formula">
                    bits[{currentStepData.number}] = bits[{currentStepData.rightShift}] + {currentStepData.lowestBit} = {currentStepData.bits}
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
                  i{'>'}1 = {currentStepData.number}{'>'}1 = {currentStepData.rightShift}
                  <span className="binary-small"> ({currentStepData.rightShift.toString(2).padStart(maxBinaryLength - 1, '0')})</span>
                </p>
                <p>
                  i&1 = {currentStepData.number}&1 = {currentStepData.lowestBit}
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

export default DPLowestBitVisualizer; 