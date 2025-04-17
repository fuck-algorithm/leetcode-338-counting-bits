import React from 'react';

interface BinaryDisplayProps {
  number: number;
  padding?: number;
  highlightBits?: number[];
}

const BinaryDisplay: React.FC<BinaryDisplayProps> = ({
  number,
  padding = 0,
  highlightBits = [],
}) => {
  // 将数字转换为二进制字符串并填充到指定长度
  const binaryString = number.toString(2).padStart(padding, '0');
  
  return (
    <div className="binary-display">
      <div className="binary-value">
        {Array.from(binaryString).map((bit, index) => (
          <span
            key={index}
            className={`binary-bit ${highlightBits.includes(index) ? 'highlight' : ''}`}
          >
            {bit}
          </span>
        ))}
      </div>
      <div className="binary-indices">
        {Array.from(binaryString).map((_, index) => (
          <span key={index} className="binary-index">
            {binaryString.length - index - 1}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BinaryDisplay; 