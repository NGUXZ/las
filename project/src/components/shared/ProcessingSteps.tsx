import React from 'react';
import { CheckCircle, Loader, Circle, AlertCircle } from 'lucide-react';
import { ProcessingStep } from '../../types';

interface ProcessingStepsProps {
  steps: ProcessingStep[];
}

export const ProcessingSteps: React.FC<ProcessingStepsProps> = ({ steps }) => {
  const getIcon = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'processing':
        return <Loader className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Circle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'processing':
        return 'text-blue-400';
      case 'error':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="glass-panel p-4">
      <h3 className="text-lg font-semibold text-white mb-4">实时进度</h3>
      
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {getIcon(step.status)}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className={`font-medium ${getStatusColor(step.status)}`}>
                  {step.name}
                </span>
                
                {step.status === 'processing' && (
                  <span className="text-xs text-gray-500">
                    {step.progress}%
                  </span>
                )}
              </div>
              
              {step.status === 'processing' && (
                <div className="mt-1">
                  <div className="progress-bar h-1">
                    <div
                      className="progress-fill bg-gradient-to-r from-blue-500 to-cyan-500"
                      style={{ width: `${step.progress}%` }}
                    />
                  </div>
                </div>
              )}
              
              {(step.timeElapsed || step.estimatedRemaining) && (
                <div className="text-xs text-gray-500 mt-1">
                  {step.timeElapsed && `已用时: ${Math.round(step.timeElapsed)}s`}
                  {step.timeElapsed && step.estimatedRemaining && ' | '}
                  {step.estimatedRemaining && `预计剩余: ${Math.round(step.estimatedRemaining)}s`}
                </div>
              )}
            </div>
            
            {index < steps.length - 1 && (
              <div className="absolute left-6 mt-8 w-px h-6 bg-gray-600" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};