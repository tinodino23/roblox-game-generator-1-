
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const baseClasses = 'bg-slate-800/50 border border-slate-700 rounded-xl shadow-lg transition-all duration-300';
  const hoverClasses = onClick ? 'hover:border-indigo-500 hover:shadow-indigo-500/10 hover:scale-[1.02] cursor-pointer' : '';
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;
