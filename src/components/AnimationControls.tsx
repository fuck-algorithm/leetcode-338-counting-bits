import React, { useEffect } from 'react';
import './AnimationControls.css';

interface AnimationControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  progress: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onGoToStep: (step: number) => void;
}

const AnimationControls: React.FC<AnimationControlsProps> = ({
  currentStep,
  totalSteps,
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onNextStep,
  onPrevStep,
  onGoToStep,
}) => {
  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onGoToStep(value);
  };
  
  // 添加键盘快捷键支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 如果当前焦点在输入框或其他表单元素上，不触发快捷键
      if (
        e.target instanceof HTMLInputElement || 
        e.target instanceof HTMLTextAreaElement || 
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }
      
      switch (e.key) {
        case 'ArrowLeft':  // 左方向键：上一步
          e.preventDefault();
          if (currentStep > 0) {
            onPrevStep();
          }
          break;
          
        case 'ArrowRight':  // 右方向键：下一步
          e.preventDefault();
          if (currentStep < totalSteps - 1) {
            onNextStep();
          }
          break;
          
        case ' ':  // 空格键：播放/暂停
          e.preventDefault();
          isPlaying ? onPause() : onPlay();
          break;
          
        case 'r':  // r键（小写）：重置
        case 'R':  // R键（大写）：重置
          e.preventDefault();
          onReset();
          break;
          
        default:
          break;
      }
    };
    
    // 添加事件监听
    window.addEventListener('keydown', handleKeyDown);
    
    // 清理事件监听
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentStep, totalSteps, isPlaying, onPrevStep, onNextStep, onPlay, onPause, onReset]);
  
  return (
    <div className="animation-controls">
      <button
        className="animation-button"
        onClick={onPrevStep}
        disabled={currentStep <= 0}
        title="上一步 (左方向键)"
      >
        ⏮
      </button>
      
      {isPlaying ? (
        <button
          className="animation-button active"
          onClick={onPause}
          title="暂停 (空格键)"
        >
          ⏸
        </button>
      ) : (
        <button
          className="animation-button"
          onClick={onPlay}
          title="播放 (空格键)"
        >
          ▶
        </button>
      )}
      
      <button
        className="animation-button"
        onClick={onNextStep}
        disabled={currentStep >= totalSteps - 1}
        title="下一步 (右方向键)"
      >
        ⏭
      </button>
      
      <div className="animation-progress">
        <input
          type="range"
          min="-1"
          max={totalSteps - 1}
          value={currentStep}
          onChange={handleProgressChange}
          className="progress-slider"
        />
        <div className="step-indicators">
          <span>步骤: {currentStep >= 0 ? currentStep + 1 : 0} / {totalSteps}</span>
        </div>
      </div>
      
      <button
        className="reset-button"
        onClick={onReset}
        title="重置 (R键)"
      >
        重置
      </button>
      
      <div className="keyboard-shortcuts">
        <span className="shortcut-hint">键盘快捷键: ◀ ▶ 空格 R</span>
      </div>
    </div>
  );
};

export default AnimationControls; 