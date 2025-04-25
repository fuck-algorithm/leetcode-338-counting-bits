import React, { useEffect, useState } from 'react';
import './BinaryDisplay.css';

interface BinaryDisplayProps {
  number: number;
  padding?: number;
  highlightBits?: number[];
  animate?: boolean;
}

const BinaryDisplay: React.FC<BinaryDisplayProps> = ({
  number,
  padding = 0,
  highlightBits = [],
  animate = true,
}) => {
  // 将数字转换为二进制字符串并填充到指定长度
  const binaryString = number.toString(2).padStart(padding, '0');
  const [displayBits, setDisplayBits] = useState<string[]>([]);
  const [animationCompleted, setAnimationCompleted] = useState(false);

  // 当数字改变时，重新初始化动画
  useEffect(() => {
    if (animate) {
      setDisplayBits(Array(binaryString.length).fill('0'));
      setAnimationCompleted(false);
      
      // 逐位动画显示二进制数
      const animationDelay = 50; // 每位的延迟毫秒数
      
      const animateBits = async () => {
        const bits = binaryString.split('');
        for (let i = 0; i < bits.length; i++) {
          await new Promise(resolve => setTimeout(resolve, animationDelay));
          setDisplayBits(prev => {
            const newBits = [...prev];
            newBits[i] = bits[i];
            return newBits;
          });
        }
        setAnimationCompleted(true);
      };
      
      animateBits();
    } else {
      // 不使用动画直接显示
      setDisplayBits(binaryString.split(''));
      setAnimationCompleted(true);
    }
  }, [binaryString, animate]);

  // 生成位的CSS类
  const getBitClass = (index: number, bit: string) => {
    const classes = ['binary-bit'];
    
    if (highlightBits.includes(index)) {
      classes.push('highlight');
      
      if (animationCompleted && bit === '1') {
        classes.push('pulse');
      }
    }
    
    if (bit === '1') {
      classes.push('bit-one');
    } else {
      classes.push('bit-zero');
    }
    
    return classes.join(' ');
  };

  // 计算十进制中每个位的值
  const getPositionValue = (position: number) => {
    return Math.pow(2, position);
  };
  
  return (
    <div className="binary-display">
      <div className="binary-explanation">
        <span className="number-label">数字 {number} 的二进制表示：</span>
      </div>
      
      <div className="binary-value">
        {displayBits.map((bit, index) => (
          <span
            key={index}
            className={getBitClass(index, bit)}
            style={{ 
              animationDelay: `${index * 50}ms`,
              transitionDelay: `${index * 50}ms`
            }}
          >
            {bit}
          </span>
        ))}
      </div>

      <div className="binary-indices">
        {Array.from(binaryString).map((_, index) => {
          const position = binaryString.length - index - 1;
          return (
            <span key={index} className="binary-index">
              2<sup>{position}</sup>
            </span>
          );
        })}
      </div>

      <div className="binary-values">
        {Array.from(binaryString).map((bit, index) => {
          const position = binaryString.length - index - 1;
          const value = bit === '1' ? getPositionValue(position) : 0;
          return (
            <span key={index} className={`binary-position-value ${value ? 'has-value' : ''}`}>
              {value || '·'}
            </span>
          );
        })}
      </div>

      <div className="binary-sum">
        {number > 0 && (
          <div className="sum-explanation">
            {displayBits
              .map((bit, index) => {
                const position = displayBits.length - index - 1;
                return bit === '1' ? getPositionValue(position) : null;
              })
              .filter(value => value !== null)
              .join(' + ')} = {number}
          </div>
        )}
        {number === 0 && <div className="sum-explanation">0</div>}
      </div>
    </div>
  );
};

export default BinaryDisplay; 