import React from 'react';
import CoordinateSystem from '../../components/CoordinateSystem';
import BinaryDisplay from '../../components/BinaryDisplay';
import AlgorithmInfo from '../../components/AlgorithmInfo';
import AnimationControls from '../../components/AnimationControls';
import { useAnimation } from '../../hooks/useAnimation';
import { countBitsBrianKernighan, generateAnimationData, getBinaryLength } from '../../algorithms';
import '../common/Visualizer.css';

interface BrianKernighanVisualizerProps {
  n: number;
}

interface StepData {
  number: number;
  binary: string;
  countingStep: number | null;
  ones: number;
  highlightBits: number[];
}

const BrianKernighanVisualizer: React.FC<BrianKernighanVisualizerProps> = ({ n }) => {
  const maxBinaryLength = getBinaryLength(n);
  const results = countBitsBrianKernighan(n);
  const points = generateAnimationData(countBitsBrianKernighan, n);
  
  // 生成每个数字的详细步骤数据
  const generateStepsData = (): StepData[] => {
    const stepsData: StepData[] = [];
    
    // 处理数字0
    stepsData.push({
      number: 0,
      binary: '0'.padStart(maxBinaryLength, '0'),
      countingStep: null,
      ones: 0,
      highlightBits: [],
    });
    
    // 处理数字1~n
    for (let i = 1; i <= n; i++) {
      let x = i;
      let step = 0;
      let ones = 0;
      
      // 初始状态
      stepsData.push({
        number: i,
        binary: i.toString(2).padStart(maxBinaryLength, '0'),
        countingStep: step,
        ones,
        highlightBits: [],
      });
      
      // 计算1的个数的每一步
      while (x > 0) {
        const prevX = x;
        x &= (x - 1); // 消除最低位的1
        ones++;
        step++;
        
        // 找出消除的1的位置
        const prevBinary = prevX.toString(2).padStart(maxBinaryLength, '0');
        const currBinary = x.toString(2).padStart(maxBinaryLength, '0');
        const highlightBits: number[] = [];
        
        for (let j = 0; j < maxBinaryLength; j++) {
          if (prevBinary[j] !== currBinary[j]) {
            highlightBits.push(j);
          }
        }
        
        stepsData.push({
          number: i,
          binary: prevBinary,
          countingStep: step,
          ones,
          highlightBits,
        });
      }
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
  
  // 构建适合绘图的数据点
  const buildVisiblePoints = () => {
    // 即使在初始状态也显示所有0~n的点，但初始值y设为0
    if (currentStep < 0) {
      return points.map(point => ({
        x: point.x,
        y: 0 // 初始状态所有点都在0位置
      }));
    }
    
    // 获取当前已处理过的所有数字
    const processedNumbers = new Set<number>();
    const processedPoints: { x: number; y: number }[] = [];
    
    // 遍历到当前步骤的所有数据
    for (let i = 0; i <= currentStep; i++) {
      const data = stepsData[i];
      if (data) {
        // 为每个数字只保留最新的状态
        processedNumbers.add(data.number);
        // 如果是当前步骤的数据或最终状态，添加到显示点中
        if (i === currentStep || 
            (data.number < (currentStepData?.number || 0)) || 
            (data.countingStep !== null && data.countingStep > 0)) {
          processedPoints.push({
            x: data.number,
            y: data.ones
          });
        }
      }
    }
    
    // 对于每个数字只保留最新状态
    const uniquePoints = Array.from(processedNumbers).map(num => {
      const latestPoint = processedPoints
        .filter(p => p.x === num)
        .sort((a, b) => b.y - a.y)[0]; // 取最大的y值
      return latestPoint || { x: num, y: 0 };
    });
    
    return uniquePoints;
  };
  
  const visiblePoints = buildVisiblePoints();
  
  // 增加二进制操作的详细显示
  const renderBinaryOperation = () => {
    if (!currentStepData || currentStepData.countingStep === null || currentStepData.countingStep <= 0) {
      return null;
    }
    
    const x = parseInt(currentStepData.binary, 2);
    const xMinus1 = x - 1;
    const result = x & xMinus1;
    
    return (
      <div className="binary-operation">
        <div className="operation-title">二进制运算过程（一步步看）：</div>
        <div className="operation-row">
          <span className="operation-label">数字:</span>
          <span className="operation-value">{currentStepData.binary}</span>
          <span className="explanation">（这是当前的数字）</span>
        </div>
        <div className="operation-row">
          <span className="operation-label">减1:</span>
          <span className="operation-value">{xMinus1.toString(2).padStart(maxBinaryLength, '0')}</span>
          <span className="explanation">（把数字减1）</span>
        </div>
        <div className="operation-row highlighted">
          <span className="operation-label">按位与(&):</span>
          <span className="operation-value">{result.toString(2).padStart(maxBinaryLength, '0')}</span>
          <span className="explanation">（将上面两行每一位进行"与"操作：只有两个都是1的位才保留为1）</span>
        </div>
        <div className="operation-conclusion">
          <span>结果：消除了一个1！每次运算都会消除一个最右边的1</span>
        </div>
      </div>
    );
  };

  // 渲染简单直观的说明
  const renderSimpleExplanation = () => {
    if (!currentStepData) {
      return (
        <div className="simple-explanation">
          <h3>算法简单解释</h3>
          <p>这个算法就像数积木一样简单：</p>
          <ol>
            <li>把数字写成二进制（只有0和1的形式）</li>
            <li>每次消掉一个值为1的积木，并记录消掉了几次</li>
            <li>消掉的次数就是1的个数！</li>
          </ol>
          <p>点击"播放"按钮开始演示！</p>
        </div>
      );
    }

    if (currentStepData.countingStep === null) {
      return (
        <div className="simple-explanation">
          <h3>开始处理数字 {currentStepData.number}</h3>
          <p>二进制形式：{currentStepData.binary}</p>
          <p>我们将一步步数出其中有几个1</p>
          <p className="next-hint">点击下一步继续</p>
        </div>
      );
    }

    return (
      <div className="simple-explanation">
        <h3>第 {currentStepData.countingStep} 次消除1</h3>
        <p>每次运算 <code>x = x & (x-1)</code> 会消除最右边的一个1</p>
        <p>已找到 {currentStepData.ones} 个1，继续寻找...</p>
        {currentStepData.ones > 0 && parseInt(currentStepData.binary, 2) === 0 && (
          <p className="complete-message">完成！数字 {currentStepData.number} 有 {currentStepData.ones} 个1</p>
        )}
      </div>
    );
  };
  
  return (
    <div className="algorithm-visualizer brian-kernighan-visualizer">
      <div className="visualizer-header">
        <AlgorithmInfo algorithm="brianKernighan" />
      </div>

      <div className="simple-guide">
        <div className="guide-icon">💡</div>
        <div className="guide-text">
          这个演示展示如何计算一个数字的二进制表示中1的个数。
          就像数星星一样，我们数一数二进制中有多少个1！
        </div>
      </div>
      
      <div className="visualizer-content">
        <div className="visualizer-main">
          <div className="coordinate-title">
            <h4>图表说明：横轴是数字，纵轴是该数字中1的个数</h4>
          </div>
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
          {renderSimpleExplanation()}
          
          {currentStepData && (
            <>
              <div className="step-info">
                <h4>现在处理的数字：{currentStepData.number}</h4>
                {currentStepData.countingStep !== null && (
                  <p>第 {currentStepData.countingStep} 步操作</p>
                )}
                <p className="ones-count">已找到 {currentStepData.ones} 个1</p>
              </div>
              
              <div className="binary-info">
                <h4>这个数字的二进制表示：</h4>
                <BinaryDisplay
                  number={parseInt(currentStepData.binary, 2)}
                  padding={maxBinaryLength}
                  highlightBits={currentStepData.highlightBits}
                />
                {currentStepData.countingStep !== null && currentStepData.countingStep > 0 && (
                  <p className="operation-info">
                    <span className="highlight-text">我们刚刚消除了一个1！</span> 
                    请留意黄色高亮的位置，那里的1被消除了
                  </p>
                )}
                {renderBinaryOperation()}
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

export default BrianKernighanVisualizer; 