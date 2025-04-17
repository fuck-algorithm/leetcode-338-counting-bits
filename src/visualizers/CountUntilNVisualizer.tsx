import React from 'react';
import CoordinateSystem from '../components/CoordinateSystem';
import BinaryDisplay from '../components/BinaryDisplay';
import AlgorithmInfo from '../components/AlgorithmInfo';
import AnimationControls from '../components/AnimationControls';
import { useAnimation } from '../hooks/useAnimation';
import { countBitsBrianKernighan, generateAnimationData, getBinaryLength } from '../algorithms';

interface CountUntilNVisualizerProps {
  n: number;
}

const CountUntilNVisualizer: React.FC<CountUntilNVisualizerProps> = ({ n }) => {
  const maxBinaryLength = getBinaryLength(n);
  const results = countBitsBrianKernighan(n);
  const points = generateAnimationData(countBitsBrianKernighan, n);
  
  // 为每个数字生成步骤
  const generateStepsData = () => {
    const stepsData = [];
    
    for (let i = 0; i <= n; i++) {
      stepsData.push({
        number: i,
        binary: i.toString(2).padStart(maxBinaryLength, '0'),
        ones: results[i],
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
    delay: 500,
  });
  
  // 当前步骤的数据
  const currentStepData = currentStep >= 0 && currentStep < stepsData.length 
    ? stepsData[currentStep] 
    : null;
  
  // 当前要高亮显示的点
  const highlightedPoint = currentStepData ? {
    x: currentStepData.number,
    y: currentStepData.ones,
  } : null;
  
  // 计算当前可见的点
  const visiblePoints = currentStep >= 0 
    ? points.filter(point => point.x <= (currentStepData?.number || 0))
    : [];
  
  return (
    <div className="algorithm-visualizer count-until-n-visualizer">
      <div className="visualizer-header">
        <AlgorithmInfo algorithm="brianKernighan" />
      </div>
      
      <div className="visualizer-content">
        <div className="visualizer-main">
          <CoordinateSystem
            points={visiblePoints}
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
                <p>数字：{currentStepData.number}</p>
                <p>1的个数：{currentStepData.ones}</p>
              </div>
              
              <div className="binary-info">
                <h4>二进制表示：</h4>
                <BinaryDisplay
                  number={currentStepData.number}
                  padding={maxBinaryLength}
                />
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

export default CountUntilNVisualizer; 