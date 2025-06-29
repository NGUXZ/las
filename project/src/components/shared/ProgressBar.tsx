import React from 'react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  label,
  showPercentage = true,
  color = 'blue',
  size = 'md'
}) => {
  const height = size === 'sm' ? 'h-2' : size === 'lg' ? 'h-6' : 'h-4';
  
  const colorClasses = {
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    yellow: 'from-yellow-500 to-orange-500',
    red: 'from-red-500 to-pink-500'
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm text-gray-300">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
          )}
        </div>
      )}
      
      <div className={`progress-bar ${height} w-full`}>
        <div
          className={`progress-fill bg-gradient-to-r ${colorClasses[color]}`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  );
};