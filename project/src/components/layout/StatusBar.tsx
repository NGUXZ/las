import React from 'react';
import { CheckCircle, AlertCircle, Clock, Loader } from 'lucide-react';

interface StatusBarProps {
  currentTask?: string;
  taskStatus?: 'idle' | 'processing' | 'completed' | 'error';
  message?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({ 
  currentTask, 
  taskStatus = 'idle',
  message 
}) => {
  const getIcon = () => {
    switch (taskStatus) {
      case 'processing':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusText = () => {
    if (currentTask) return currentTask;
    switch (taskStatus) {
      case 'processing':
        return '处理中...';
      case 'completed':
        return '处理完成';
      case 'error':
        return '处理失败';
      default:
        return '准备就绪';
    }
  };

  return (
    <div className="glass-panel h-10 px-6 flex items-center justify-between text-sm">
      <div className="flex items-center space-x-2">
        {getIcon()}
        <span className="text-gray-300">{getStatusText()}</span>
        {message && (
          <span className="text-gray-500">- {message}</span>
        )}
      </div>
      
      <div className="text-gray-500 text-xs">
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};