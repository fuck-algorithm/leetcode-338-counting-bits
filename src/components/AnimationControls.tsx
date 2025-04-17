import React from 'react';

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
  progress,
  onPlay,
  onPause,
  onReset,
  onNextStep,
  onPrevStep,
  onGoToStep,
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    onGoToStep(value);
  };

  return (
    <div className="animation-controls">
      <div className="controls-buttons">
        <button
          className="control-button"
          onClick={onReset}
          title="重置"
        >
          <span>⏮</span>
        </button>
        <button
          className="control-button"
          onClick={onPrevStep}
          disabled={currentStep <= -1}
          title="上一步"
        >
          <span>⏪</span>
        </button>
        {isPlaying ? (
          <button
            className="control-button"
            onClick={onPause}
            title="暂停"
          >
            <span>⏸</span>
          </button>
        ) : (
          <button
            className="control-button"
            onClick={onPlay}
            disabled={currentStep >= totalSteps - 1}
            title="播放"
          >
            <span>▶️</span>
          </button>
        )}
        <button
          className="control-button"
          onClick={onNextStep}
          disabled={currentStep >= totalSteps - 1}
          title="下一步"
        >
          <span>⏩</span>
        </button>
      </div>

      <div className="controls-progress">
        <div className="progress-info">
          <span className="step-counter">步骤：{currentStep + 1} / {totalSteps}</span>
          <div className="progress-bar-container">
            <input
              type="range"
              min="-1"
              max={totalSteps - 1}
              value={currentStep}
              onChange={handleSliderChange}
              className="progress-slider"
            />
            <div className="progress-bar">
              <div
                className="progress-bar-inner"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationControls; 