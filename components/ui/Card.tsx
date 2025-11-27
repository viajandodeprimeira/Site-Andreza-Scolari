import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, hoverEffect = false }) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { scale: 1.02, y: -5 } : {}}
      whileTap={hoverEffect && onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`
        relative overflow-hidden
        bg-surface/50 backdrop-blur-xl 
        border border-white/10 
        rounded-3xl p-6 
        shadow-xl ring-1 ring-black/5
        transition-colors duration-300
        ${onClick ? 'cursor-pointer hover:bg-surface/70 hover:border-white/20' : ''}
        ${className}
      `}
    >
      {/* Glossy gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100" />
      {children}
    </motion.div>
  );
};