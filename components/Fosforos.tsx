
import React from 'react';

interface FosforosProps {
  points: number;
  colorClass?: string;
}

const Fosforos: React.FC<FosforosProps> = ({ points, colorClass = "bg-blue-500" }) => {
  const renderBlock = (p: number, index: number) => {
    const currentBlockPoints = Math.min(Math.max(p, 0), 5);
    const lineBase = "absolute transition-all duration-300 rounded-full";
    const thickness = "h-[3px] w-[3px]";
    const activeLine = colorClass;
    const inactiveLine = "bg-white/5";
    
    return (
      <div key={index} className="relative w-10 h-10 m-1 flex items-center justify-center">
        {/* Top */}
        <div className={`${lineBase} top-0 left-0 right-0 h-[3px] ${currentBlockPoints >= 1 ? activeLine : inactiveLine}`} />
        {/* Right */}
        <div className={`${lineBase} top-0 right-0 bottom-0 w-[3px] ${currentBlockPoints >= 2 ? activeLine : inactiveLine}`} />
        {/* Bottom */}
        <div className={`${lineBase} bottom-0 left-0 right-0 h-[3px] ${currentBlockPoints >= 3 ? activeLine : inactiveLine}`} />
        {/* Left */}
        <div className={`${lineBase} top-0 left-0 bottom-0 w-[3px] ${currentBlockPoints >= 4 ? activeLine : inactiveLine}`} />
        {/* Diagonal */}
        <div className={`${lineBase} top-0 left-0 w-[3px] h-[141.4%] origin-top-left -rotate-45 ${currentBlockPoints >= 5 ? activeLine : inactiveLine}`} />
      </div>
    );
  };

  const blocksArray = [];
  let remainingPoints = points;
  for (let i = 0; i < 6; i++) {
    blocksArray.push(renderBlock(remainingPoints, i));
    remainingPoints -= 5;
  }

  return (
    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
      {blocksArray}
    </div>
  );
};

export default Fosforos;
