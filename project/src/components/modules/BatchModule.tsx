import React, { useState, useEffect } from 'react';
import { Folder, Play, Pause, Download, Eye, RotateCcw, X } from 'lucide-react';
import { ProgressBar } from '../shared/ProgressBar';
import { FileInfo } from '../../types';

export const BatchModule: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [config, setConfig] = useState({
    mode: 'cpu' as 'cpu' | 'gpu',
    workerCount: 4,
    resolution: 100,
    skipExisting: true
  });

  const [processing, setProcessing] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [currentFile, setCurrentFile] = useState('');
  const [currentFileProgress, setCurrentFileProgress] = useState(0);
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);

  const [files, setFiles] = useState<FileInfo[]>([
    { name: 'tunnel_001.las', size: 125000000, status: 'completed', progress: 100 },
    { name: 'tunnel_002.las', size: 98000000, status: 'processing', progress: 65 },
    { name: 'tunnel_003.las', size: 156000000, status: 'pending', progress: 0 },
    { name: 'tunnel_004.las', size: 87000000, status: 'error', progress: 0, error: '内存不足' },
    { name: 'tunnel_005.las', size: 234000000, status: 'pending', progress: 0 },
    { name: 'tunnel_006.las', size: 178000000, status: 'completed', progress: 100 },
    { name: 'tunnel_007.las', size: 203000000, status: 'completed', progress: 100 },
    { name: 'tunnel_008.las', size: 145000000, status: 'pending', progress: 0 }
  ]);

  const [completedResults] = useState([
    { 
      name: 'tunnel_001.las', 
      thumbnail: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
      fullImage: 'https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg',
      dimensions: { width: 1520, height: 850 },
      processingTime: 7.2
    },
    { 
      name: 'tunnel_006.las', 
      thumbnail: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
      fullImage: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg',
      dimensions: { width: 1480, height: 820 },
      processingTime: 6.8
    },
    { 
      name: 'tunnel_007.las', 
      thumbnail: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg',
      fullImage: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg',
      dimensions: { width: 1600, height: 900 },
      processingTime: 8.1
    }
  ]);

  // 动画进度条效果
  useEffect(() => {
    if (processing) {
      const interval = setInterval(() => {
        setCurrentFileProgress(prev => {
          const newProgress = prev + Math.random() * 5;
          if (newProgress >= 100) {
            return 100;
          }
          return newProgress;
        });
        
        setOverallProgress(prev => {
          const newProgress = prev + Math.random() * 2;
          return Math.min(newProgress, 85);
        });
      }, 500);

      return () => clearInterval(interval);
    }
  }, [processing]);

  const handleSelectFolder = () => {
    setSelectedFolder('/path/to/tunnel/data');
  };

  const handleStartBatch = () => {
    setProcessing(true);
    setCurrentFile('tunnel_002.las');
    setCurrentFileProgress(65);
    setOverallProgress(35);
  };

  const handlePause = () => {
    setProcessing(false);
  };

  const handleFileClick = (fileName: string) => {
    const result = completedResults.find(r => r.name === fileName);
    if (result) {
      setSelectedPreview(fileName);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      completed: 'bg-green-500/20 text-green-400',
      processing: 'bg-blue-500/20 text-blue-400',
      error: 'bg-red-500/20 text-red-400',
      pending: 'bg-gray-500/20 text-gray-400'
    };
    
    const labels = {
      completed: '完成',
      processing: '处理中',
      error: '错误',
      pending: '等待'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const completedCount = files.filter(f => f.status === 'completed').length;
  const failedCount = files.filter(f => f.status === 'error').length;
  const totalCount = files.length;
  const selectedResult = selectedPreview ? completedResults.find(r => r.name === selectedPreview) : null;

  return (
    <div className="h-full p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 文件夹选择 */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-4">输入控件</h3>
          
          <div className="space-y-4">
            <button
              onClick={handleSelectFolder}
              className="w-full p-8 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 transition-colors flex flex-col items-center space-y-2"
            >
              <Folder className="w-12 h-12 text-gray-400" />
              <span className="text-gray-300">选择包含LAS文件的文件夹</span>
              {selectedFolder && (
                <span className="text-sm text-blue-400">{selectedFolder}</span>
              )}
            </button>
            
            {selectedFolder && (
              <div className="text-sm text-gray-400">
                找到 {totalCount} 个LAS文件
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* 左侧：参数设置 */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold text-white mb-4">参数设置</h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">处理模式</label>
                <div className="space-y-2">
                  {[
                    { value: 'cpu', label: 'CPU模式' },
                    { value: 'gpu', label: 'GPU模式' }
                  ].map((mode) => (
                    <label key={mode.value} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        value={mode.value}
                        checked={config.mode === mode.value}
                        onChange={(e) => setConfig({...config, mode: e.target.value as any})}
                        className="text-blue-500"
                      />
                      <span className="text-sm text-gray-300">{mode.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {config.mode === 'cpu' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    并行数量: {config.workerCount}
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="16"
                    value={config.workerCount}
                    onChange={(e) => setConfig({...config, workerCount: parseInt(e.target.value)})}
                    className="w-full"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">输出分辨率</label>
                <input
                  type="number"
                  min="50"
                  max="500"
                  value={config.resolution}
                  onChange={(e) => setConfig({...config, resolution: parseInt(e.target.value)})}
                  className="tech-input w-full"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="skipExisting"
                  checked={config.skipExisting}
                  onChange={(e) => setConfig({...config, skipExisting: e.target.checked})}
                  className="w-4 h-4"
                />
                <label htmlFor="skipExisting" className="text-sm text-gray-300">
                  跳过已处理
                </label>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mt-8 space-y-3">
              <button
                onClick={handleStartBatch}
                disabled={!selectedFolder || processing}
                className="w-full tech-button flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>开始批处理</span>
              </button>
              
              <button
                onClick={handlePause}
                disabled={!processing}
                className="w-full tech-button bg-gray-600 flex items-center justify-center space-x-2"
              >
                <Pause className="w-4 h-4" />
                <span>{processing ? '暂停' : '继续'}</span>
              </button>
              
              <button
                disabled={completedCount === 0}
                className="w-full tech-button bg-green-600 flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>导出全部结果</span>
              </button>
            </div>
          </div>

          {/* 中间：主要内容区域 */}
          <div className="xl:col-span-2 space-y-6">
            {/* 总进度和当前文件进度 */}
            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold text-white mb-4">处理进度</h3>
              
              {/* 总进度条 - 带动画效果 */}
              <div className="mb-4">
                <ProgressBar 
                  progress={overallProgress} 
                  label="总体进度" 
                  showPercentage={true}
                  color="blue"
                />
              </div>
              
              {/* 当前文件进度 - 带动画效果 */}
              {processing && currentFile && (
                <div>
                  <div className="text-sm text-gray-300 mb-2">当前文件: {currentFile}</div>
                  <ProgressBar 
                    progress={currentFileProgress} 
                    showPercentage={true} 
                    size="sm"
                    color="green"
                  />
                </div>
              )}
            </div>

            {/* 结果预览 - 大空间显示 */}
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">结果预览</h3>
                {selectedPreview && (
                  <button
                    onClick={() => setSelectedPreview(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              
              {selectedResult ? (
                /* 单张图像大预览 */
                <div className="space-y-4">
                  <div className="bg-gray-800/50 rounded-lg overflow-hidden">
                    <img 
                      src={selectedResult.fullImage} 
                      alt={selectedResult.name}
                      className="w-full h-96 object-contain"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="text-gray-300">文件名: <span className="text-white">{selectedResult.name}</span></div>
                      <div className="text-gray-300">尺寸: <span className="text-white">{selectedResult.dimensions.width} × {selectedResult.dimensions.height}</span></div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-gray-300">处理时间: <span className="text-white">{selectedResult.processingTime}秒</span></div>
                      <div className="text-gray-300">状态: <span className="text-green-400">已完成</span></div>
                    </div>
                  </div>
                </div>
              ) : (
                /* 缩略图网格 */
                <div className="grid grid-cols-4 gap-4">
                  {completedResults.map((result, index) => (
                    <div 
                      key={index} 
                      className="relative group cursor-pointer"
                      onClick={() => handleFileClick(result.name)}
                    >
                      <div className="aspect-square bg-gray-800 rounded-lg overflow-hidden">
                        <img 
                          src={result.thumbnail} 
                          alt={result.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Eye className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-xs text-gray-400 mt-1 truncate">
                        {result.name.replace('.las', '')}
                      </div>
                    </div>
                  ))}
                  
                  {/* 空白占位符 */}
                  {Array.from({ length: Math.max(0, 8 - completedResults.length) }).map((_, index) => (
                    <div key={`placeholder-${index}`} className="aspect-square bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-600 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">等待处理</span>
                    </div>
                  ))}
                </div>
              )}
              
              {completedResults.length === 0 && !selectedResult && (
                <div className="text-center py-12 text-gray-500">
                  <Folder className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <div>暂无处理完成的文件</div>
                  <div className="text-sm mt-1">完成的结果将在这里显示</div>
                </div>
              )}
            </div>
          </div>

          {/* 右侧：统计信息和文件列表 */}
          <div className="space-y-6">
            {/* 处理统计 */}
            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold text-white mb-4">处理统计</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">总数</span>
                  <span className="text-white font-semibold">{totalCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-400">完成</span>
                  <span className="text-white font-semibold">{completedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-400">失败</span>
                  <span className="text-white font-semibold">{failedCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">剩余时间</span>
                  <span className="text-white font-semibold">约15分钟</span>
                </div>
              </div>
            </div>

            {/* 文件列表 */}
            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold text-white mb-4">文件列表</h3>
              <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-custom">
                {files.map((file, index) => (
                  <div 
                    key={index} 
                    className={`p-3 bg-gray-800/50 rounded-lg cursor-pointer transition-colors ${
                      file.status === 'completed' ? 'hover:bg-gray-700/50' : ''
                    }`}
                    onClick={() => file.status === 'completed' && handleFileClick(file.name)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm text-white truncate">{file.name}</div>
                        <div className="text-xs text-gray-400">
                          {(file.size / 1024 / 1024).toFixed(1)} MB
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(file.status)}
                        
                        <div className="flex space-x-1">
                          {file.status === 'completed' && (
                            <button 
                              className="p-1 hover:bg-white/10 rounded" 
                              title="查看预览"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleFileClick(file.name);
                              }}
                            >
                              <Eye className="w-3 h-3 text-blue-400" />
                            </button>
                          )}
                          {file.status === 'error' && (
                            <button className="p-1 hover:bg-white/10 rounded" title="重试">
                              <RotateCcw className="w-3 h-3 text-blue-400" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {file.status === 'processing' && (
                      <div className="mt-2">
                        <ProgressBar progress={file.progress} showPercentage={false} size="sm" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};