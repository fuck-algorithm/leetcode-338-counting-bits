import React, { useState } from 'react';
import CoordinateSystem from '../components/CoordinateSystem';
import BinaryDisplay from '../components/BinaryDisplay';
import AlgorithmInfo from '../components/AlgorithmInfo';
import AnimationControls from '../components/AnimationControls';
import { useAnimation } from '../hooks/useAnimation';
import { countBitsBrianKernighan, generateAnimationData, getBinaryLength } from '../algorithms';
import './CountUntilNVisualizer.css';

interface CountUntilNVisualizerProps {
  n: number;
}

interface StepData {
  number: number;
  binary: string;
  ones: number;
  highlightBits: number[];
  animationPhase: 'initial' | 'counting';
}

const CountUntilNVisualizer: React.FC<CountUntilNVisualizerProps> = ({ n }) => {
  const maxBinaryLength = getBinaryLength(n);
  const results = countBitsBrianKernighan(n);
  const points = generateAnimationData(countBitsBrianKernighan, n);
  const [showBitAnimation, setShowBitAnimation] = useState<boolean>(true);
  
  // 为每个数字生成步骤
  const generateStepsData = (): StepData[] => {
    const stepsData: StepData[] = [];
    
    for (let i = 0; i <= n; i++) {
      const binary = i.toString(2).padStart(maxBinaryLength, '0');
      
      // 找出所有的1位
      const highlightBits: number[] = [];
      for (let j = 0; j < binary.length; j++) {
        if (binary[j] === '1') {
          highlightBits.push(j);
        }
      }
      
      stepsData.push({
        number: i,
        binary,
        ones: results[i],
        highlightBits,
        animationPhase: 'initial'
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
    y: currentStepData.ones,
  } : null;
  
  // 计算当前可见的点
  const visiblePoints = currentStep >= 0 
    ? points.filter(point => point.x <= (currentStepData?.number ?? 0))
    : [];
  
  // 切换位动画显示
  const toggleBitAnimation = () => {
    setShowBitAnimation(!showBitAnimation);
  };
  
  return (
    <div className="algorithm-visualizer count-until-n-visualizer">
      <div className="visualizer-header">
        <AlgorithmInfo algorithm="brianKernighan" />
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
                <p>数字：{currentStepData.number}</p>
                <p>1的个数：<span className="highlight-count">{currentStepData.ones}</span></p>
                <div className="animation-toggle">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={showBitAnimation} 
                      onChange={toggleBitAnimation} 
                    />
                    显示位动画
                  </label>
                </div>
              </div>
              
              <div className="binary-info">
                <h4>二进制表示：</h4>
                <BinaryDisplay
                  number={currentStepData.number}
                  padding={maxBinaryLength}
                  highlightBits={showBitAnimation ? currentStepData.highlightBits : []}
                />
                {showBitAnimation && currentStepData.ones > 0 && (
                  <div className="bit-animation-container">
                    <div className="bit-count-animation">
                      {Array.from({ length: currentStepData.ones }).map((_, idx) => (
                        <span 
                          key={idx} 
                          className="bit-counter"
                          style={{ 
                            animationDelay: `${idx * 0.2}s`,
                            backgroundColor: `hsl(${210 + idx * 30}, 80%, 60%)`
                          }}
                        >
                          1
                        </span>
                      ))}
                    </div>
                    <div className="bit-count-sum">
                      = {currentStepData.ones}
                    </div>
                  </div>
                )}
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