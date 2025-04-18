import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAnimationOptions {
  totalSteps: number;
  initialStep?: number;
  autoPlay?: boolean;
}

interface AnimationControls {
  currentStep: number;
  isPlaying: boolean;
  progress: number;
  speed: number;
  play: () => void;
  pause: () => void;
  reset: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  increaseSpeed: () => void;
  decreaseSpeed: () => void;
  setSpeed: (speed: number) => void;
}

const SPEED_LEVELS = [2000, 1500, 1000, 700, 500, 300, 200];

export function useAnimation({
  totalSteps,
  initialStep = -1,
  autoPlay = false,
}: UseAnimationOptions): AnimationControls {
  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [speedIndex, setSpeedIndex] = useState<number>(2); // 默认中等速度
  const lastStepTimeRef = useRef<number>(0);
  
  // 当前速度
  const speed = SPEED_LEVELS[speedIndex];
  
  // 计算进度百分比
  const progress = totalSteps === 0 ? 0 : Math.max(0, Math.min(100, ((currentStep + 1) / totalSteps) * 100));
  
  // 播放动画
  const play = useCallback(() => {
    // 记录开始播放的时间
    lastStepTimeRef.current = Date.now();
    setIsPlaying(true);
  }, []);
  
  // 暂停动画
  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);
  
  // 重置动画
  const reset = useCallback(() => {
    setCurrentStep(initialStep);
    setIsPlaying(false);
  }, [initialStep]);
  
  // 下一步
  const nextStep = useCallback(() => {
    setCurrentStep((prevStep) => {
      if (prevStep >= totalSteps - 1) {
        setIsPlaying(false);
        return prevStep;
      }
      // 记录步骤变化的时间
      lastStepTimeRef.current = Date.now();
      return prevStep + 1;
    });
  }, [totalSteps]);
  
  // 上一步
  const prevStep = useCallback(() => {
    setCurrentStep((prevStep) => {
      const newStep = Math.max(-1, prevStep - 1);
      // 记录步骤变化的时间
      lastStepTimeRef.current = Date.now();
      return newStep;
    });
  }, []);
  
  // 跳转到指定步骤
  const goToStep = useCallback((step: number) => {
    const boundedStep = Math.max(-1, Math.min(totalSteps - 1, step));
    setCurrentStep(boundedStep);
    // 记录步骤变化的时间
    lastStepTimeRef.current = Date.now();
  }, [totalSteps]);
  
  // 增加速度
  const increaseSpeed = useCallback(() => {
    setSpeedIndex(prevIndex => Math.min(SPEED_LEVELS.length - 1, prevIndex + 1));
  }, []);
  
  // 减少速度
  const decreaseSpeed = useCallback(() => {
    setSpeedIndex(prevIndex => Math.max(0, prevIndex - 1));
  }, []);
  
  // 设置速度级别
  const setSpeed = useCallback((speedValue: number) => {
    const newIndex = SPEED_LEVELS.findIndex(s => s === speedValue);
    if (newIndex !== -1) {
      setSpeedIndex(newIndex);
    } else {
      // 找到最接近的速度级别
      let closest = 0;
      let minDiff = Math.abs(SPEED_LEVELS[0] - speedValue);
      
      for (let i = 1; i < SPEED_LEVELS.length; i++) {
        const diff = Math.abs(SPEED_LEVELS[i] - speedValue);
        if (diff < minDiff) {
          minDiff = diff;
          closest = i;
        }
      }
      
      setSpeedIndex(closest);
    }
  }, []);
  
  // 控制动画自动播放，使用自适应帧率
  useEffect(() => {
    if (!isPlaying || currentStep >= totalSteps - 1) {
      if (currentStep >= totalSteps - 1) {
        setIsPlaying(false);
      }
      return;
    }
    
    // 计算下一步的延迟时间，保证最小延迟
    const nextStepTime = lastStepTimeRef.current + speed;
    const now = Date.now();
    const timeToNextStep = Math.max(10, nextStepTime - now);
    
    const timer = window.setTimeout(() => {
      nextStep();
    }, timeToNextStep);
    
    return () => {
      window.clearTimeout(timer);
    };
  }, [isPlaying, currentStep, nextStep, totalSteps, speed]);
  
  return {
    currentStep,
    isPlaying,
    progress,
    speed,
    play,
    pause,
    reset,
    nextStep,
    prevStep,
    goToStep,
    increaseSpeed,
    decreaseSpeed,
    setSpeed,
  };
} 