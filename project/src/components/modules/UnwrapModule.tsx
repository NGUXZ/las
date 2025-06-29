import React, { useState } from 'react';
import { Play, Download, RotateCcw, ZoomIn, ZoomOut, Eye, Layers, Image } from 'lucide-react';
import { FileDropZone } from '../shared/FileDropZone';
import { ProgressBar } from '../shared/ProgressBar';
import { Viewer3D } from '../3d/Viewer3D';
import { useFileUpload } from '../../hooks/useFileUpload';

export const UnwrapModule: React.FC = () => {
  const {
    files,
    isDragging,
    addFiles,
    removeFile,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useFileUpload();

  const [parameters, setParameters] = useState({
    sampleRatio: 0.05,
    resolution: 100,
    deviationThreshold: 0.5,
    saveDiagnosticImages: true
  });

  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [activeView, setActiveView] = useState('original'); // 新增：当前激活的视图
  const [result, setResult] = useState<{
    imageUrl?: string;
    dimensions?: { width: number; height: number };
    processingTime?: number;
  } | null>(null);

  const selectedFile = files[0];

  // 视图选项配置
  const viewOptions = [
    { 
      id: 'original', 
      name: '原始点云', 
      icon: Eye,
      description: '显示原始LAS点云数据'
    },
    { 
      id: 'cylinder', 
      name: '圆柱拟合', 
      icon: Layers,
      description: '显示圆柱拟合结果'
    },
    { 
      id: 'unwrapped', 
      name: '展开图像', 
      icon: Image,
      description: '显示最终展开结果'
    }
  ];

  const handleStartProcessing = async () => {
    if (!selectedFile) return;
    
    setProcessing(true);
    setProgress(0);
    setResult(null);

    const steps = [
      '加载数据',
      '点云采样', 
      '圆柱拟合',
      '地面检测',
      '坐标转换',
      '离群过滤',
      '图像生成'
    ];

    // 模拟处理过程
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(`正在进行：${steps[i]}`);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(((i + 1) / steps.length) * 100);
    }

    // 模拟结果
    setResult({
      imageUrl: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
      dimensions: { width: 1520, height: 850 },
      processingTime: 7.2
    });
    
    setProcessing(false);
    setCurrentStep('处理完成');
    setActiveView('unwrapped'); // 处理完成后自动切换到展开图像
  };

  const handleClear = () => {
    if (selectedFile) {
      removeFile(selectedFile.name);
    }
    setResult(null);
    setProgress(0);
    setCurrentStep('');
    setActiveView('original');
  };

  // 渲染不同视图的内容
  const renderViewContent = () => {
    switch (activeView) {
      case 'original':
        return (
          <div className="h-full bg-gray-800/50 rounded-lg overflow-hidden">
            {selectedFile ? (
              <Viewer3D
                viewMode="rgb"
                className="h-full"
                stats={{
                  pointCount: selectedFile.pointCount || 0,
                  density: 1250,
                  bounds: 'X: 100m, Y: 150m, Z: 25m'
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                请先选择LAS文件
              </div>
            )}
          </div>
        );
      
      case 'cylinder':
        return (
          <div className="h-full bg-gray-800/50 rounded-lg overflow-hidden">
            {selectedFile && (processing || result) ? (
              <div className="h-full relative">
                <Viewer3D
                  viewMode="rgb"
                  showWireframe={true}
                  className="h-full"
                />
                <div className="absolute bottom-4 left-4 bg-black/70 text-white text-sm px-3 py-2 rounded space-y-1">
                  <div>中心: (125.34, 456.78, 12.45)</div>
                  <div>半径: 3.25m</div>
                  <div>拟合误差: 0.035</div>
                  <div className="mt-2">
                    <ProgressBar progress={87} size="sm" color="green" showPercentage={false} />
                    <span className="text-xs">置信度: 87%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                {processing ? '圆柱拟合进行中...' : '等待开始处理'}
              </div>
            )}
          </div>
        );
      
      case 'unwrapped':
        return (
          <div className="h-full bg-gray-800/50 rounded-lg overflow-hidden">
            {result ? (
              <div className="h-full relative">
                <img 
                  src={result.imageUrl} 
                  alt="展开结果"
                  className="w-full h-full object-contain"
                />
                <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  宽度: {result.dimensions?.width}像素 × 高度: {result.dimensions?.height}像素
                </div>
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button className="p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors" title="放大">
                    <ZoomIn className="w-4 h-4 text-white" />
                  </button>
                  <button className="p-2 bg-black/50 hover:bg-black/70 rounded-lg transition-colors" title="缩小">
                    <ZoomOut className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                {processing ? '图像生成中...' : '等待处理结果'}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="h-full p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 文件输入区域 */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-4">文件输入</h3>
          
          {!selectedFile ? (
            <FileDropZone
              onFilesSelected={addFiles}
              acceptedTypes={['.las', '.laz']}
              isDragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            />
          ) : (
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-white">{selectedFile.name}</span>
                <button
                  onClick={() => removeFile(selectedFile.name)}
                  className="text-red-400 hover:text-red-300 text-xl"
                >
                  ×
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm text-gray-300">
                <div>文件大小: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                <div>点云数量: {selectedFile.pointCount?.toLocaleString()}</div>
                <div>格式: {selectedFile.name.split('.').pop()?.toUpperCase()}</div>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 参数设置 */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold text-white mb-4">参数设置</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  采样率: {parameters.sampleRatio}
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="1"
                  step="0.01"
                  value={parameters.sampleRatio}
                  onChange={(e) => setParameters({...parameters, sampleRatio: parseFloat(e.target.value)})}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  输出分辨率 (像素/米)
                </label>
                <input
                  type="number"
                  min="50"
                  max="500"
                  value={parameters.resolution}
                  onChange={(e) => setParameters({...parameters, resolution: parseInt(e.target.value)})}
                  className="tech-input w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  偏差阈值: {parameters.deviationThreshold}
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="2"
                  step="0.1"
                  value={parameters.deviationThreshold}
                  onChange={(e) => setParameters({...parameters, deviationThreshold: parseFloat(e.target.value)})}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="saveDiagnostic"
                  checked={parameters.saveDiagnosticImages}
                  onChange={(e) => setParameters({...parameters, saveDiagnosticImages: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="saveDiagnostic" className="text-sm text-gray-300">
                  保存诊断图像
                </label>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mt-8 space-y-3">
              <button
                onClick={handleStartProcessing}
                disabled={!selectedFile || processing}
                className="w-full tech-button flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>开始处理</span>
              </button>
              
              {result && (
                <button
                  className="w-full tech-button bg-green-600 flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>导出图像</span>
                </button>
              )}
              
              <button
                onClick={handleClear}
                className="w-full tech-button bg-gray-600 flex items-center justify-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>清除</span>
              </button>
            </div>
          </div>

          {/* 结果展示区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 进度显示 */}
            {processing && (
              <div className="glass-panel p-6">
                <h3 className="text-lg font-semibold text-white mb-4">处理进度</h3>
                <ProgressBar progress={progress} showPercentage={true} />
                {currentStep && (
                  <div className="mt-3 text-sm text-gray-300">{currentStep}</div>
                )}
              </div>
            )}

            {/* 可视化结果 - 带切换标签 */}
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">可视化结果</h3>
              </div>
              
              {/* 视图切换标签 */}
              <div className="flex space-x-1 mb-4">
                {viewOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => setActiveView(option.id)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeView === option.id
                          ? 'bg-blue-500 text-white shadow-lg'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                      title={option.description}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{option.name}</span>
                    </button>
                  );
                })}
              </div>
              
              {/* 视图内容区域 */}
              <div style={{ minHeight: '400px' }}>
                {renderViewContent()}
              </div>
            </div>

            {/* 处理信息 */}
            {result && (
              <div className="glass-panel p-6">
                <h3 className="text-lg font-semibold text-white mb-4">处理信息</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-gray-300">
                    <div>图像尺寸: {result.dimensions?.width} × {result.dimensions?.height} 像素</div>
                    <div>处理时间: {result.processingTime} 秒</div>
                  </div>
                  <div className="text-gray-300">
                    <div>采样率: {parameters.sampleRatio}</div>
                    <div>分辨率: {parameters.resolution} 像素/米</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};