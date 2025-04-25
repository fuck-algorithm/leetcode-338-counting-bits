import React from 'react';
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
  
  return (
    <div className="animation-controls">
      <button
        className="animation-button"
        onClick={onPrevStep}
        disabled={currentStep <= 0}
        title="上一步"
      >
        ⏮
      </button>
      
      {isPlaying ? (
        <button
          className="animation-button active"
          onClick={onPause}
          title="暂停"
        >
          ⏸
        </button>
      ) : (
        <button
          className="animation-button"
          onClick={onPlay}
          title="播放"
        >
          ▶
        </button>
      )}
      
      <button
        className="animation-button"
        onClick={onNextStep}
        disabled={currentStep >= totalSteps - 1}
        title="下一步"
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
        title="重置"
      >
        重置
      </button>
    </div>
  );
};

export default AnimationControls; 