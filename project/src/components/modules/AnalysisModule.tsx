import React, { useState } from 'react';
import { Play, Download, FileText } from 'lucide-react';
import { FileDropZone } from '../shared/FileDropZone';
import { ProgressBar } from '../shared/ProgressBar';
import { useFileUpload } from '../../hooks/useFileUpload';

export const AnalysisModule: React.FC = () => {
  const {
    files,
    isDragging,
    addFiles,
    removeFile,
    handleDragOver,
    handleDragLeave,
    handleDrop
  } = useFileUpload();

  const [analysisMode, setAnalysisMode] = useState('standard');
  const [selectedFeatures, setSelectedFeatures] = useState({
    geometric: true,
    color: true,
    structure: true
  });
  const [gpuAcceleration, setGpuAcceleration] = useState(true);

  const [processing, setProcessing] = useState(false);
  const [currentStage, setCurrentStage] = useState('');
  const [stageProgress, setStageProgress] = useState({
    preprocessing: 0,
    featureExtraction: 0,
    regionSegmentation: 0
  });
  const [overallProgress, setOverallProgress] = useState(0);

  const [result, setResult] = useState<{
    structureSurfaces: number;
    anomalousRegions: number;
    processingTime: number;
    reportGenerated: boolean;
  } | null>(null);

  const selectedFile = files[0];

  const handleStartAnalysis = async () => {
    if (!selectedFile) return;
    
    setProcessing(true);
    setResult(null);
    setOverallProgress(0);

    const stages = [
      { name: '预处理', key: 'preprocessing' },
      { name: '特征提取', key: 'featureExtraction' },
      { name: '区域分割', key: 'regionSegmentation' }
    ];

    // 模拟分析过程
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      setCurrentStage(stage.name);
      
      // 模拟阶段进度
      for (let progress = 0; progress <= 100; progress += 10) {
        setStageProgress(prev => ({
          ...prev,
          [stage.key]: progress
        }));
        setOverallProgress(((i * 100 + progress) / (stages.length * 100)) * 100);
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    // 模拟结果
    setResult({
      structureSurfaces: 12,
      anomalousRegions: 3,
      processingTime: 45.6,
      reportGenerated: true
    });
    
    setProcessing(false);
    setCurrentStage('分析完成');
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    setSelectedFeatures(prev => ({
      ...prev,
      [feature]: checked
    }));
  };

  return (
    <div className="h-full p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 文件输入区域 - 居中标题 */}
        <div className="glass-panel p-6">
          <h3 className="text-lg font-semibold text-white mb-4 text-center">文件输入</h3>
          
          {!selectedFile ? (
            <FileDropZone
              onFilesSelected={addFiles}
              acceptedTypes={['.las', '.laz']}
              isDragging={isDragging}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              placeholder="拖入LAS文件进行分析"
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
          {/* 参数设置 - 居中标题 */}
          <div className="glass-panel p-6">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">参数设置</h3>
            
            <div className="space-y-6">
              {/* 分析模式 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">分析模式</label>
                <div className="space-y-2">
                  {[
                    { value: 'quick', label: '快速分析', desc: '预设参数' },
                    { value: 'standard', label: '标准分析', desc: '平衡模式' },
                    { value: 'deep', label: '深度分析', desc: '高精度' }
                  ].map((mode) => (
                    <label key={mode.value} className="flex items-start space-x-2">
                      <input
                        type="radio"
                        value={mode.value}
                        checked={analysisMode === mode.value}
                        onChange={(e) => setAnalysisMode(e.target.value)}
                        className="mt-1"
                      />
                      <div>
                        <div className="text-sm text-gray-300">{mode.label}</div>
                        <div className="text-xs text-gray-500">{mode.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 特征选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">特征选择</label>
                <div className="space-y-2">
                  {[
                    { key: 'geometric', label: '几何特征' },
                    { key: 'color', label: '颜色特征' },
                    { key: 'structure', label: '结构特征' }
                  ].map((feature) => (
                    <label key={feature.key} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedFeatures[feature.key as keyof typeof selectedFeatures]}
                        onChange={(e) => handleFeatureChange(feature.key, e.target.checked)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-300">☑ {feature.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* GPU加速 */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="gpuAcceleration"
                  checked={gpuAcceleration}
                  onChange={(e) => setGpuAcceleration(e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="gpuAcceleration" className="text-sm text-gray-300">
                  GPU加速
                </label>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="mt-8 space-y-3">
              <button
                onClick={handleStartAnalysis}
                disabled={!selectedFile || processing}
                className="w-full tech-button flex items-center justify-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>开始分析</span>
              </button>
              
              {result && (
                <>
                  <button className="w-full tech-button bg-green-600 flex items-center justify-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>导出报告(PDF)</span>
                  </button>
                  
                  <button className="w-full tech-button bg-blue-600 flex items-center justify-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>保存结果</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* 结果展示区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 阶段进度 */}
            {processing && (
              <div className="glass-panel p-6">
                <h3 className="text-lg font-semibold text-white mb-4 text-center">分析进度</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="w-20 text-gray-300">预处理</span>
                    <div className="flex-1">
                      <ProgressBar 
                        progress={stageProgress.preprocessing} 
                        showPercentage={false} 
                        size="sm"
                        color={stageProgress.preprocessing === 100 ? 'green' : 'blue'}
                      />
                    </div>
                    <span className="w-12 text-gray-400">{stageProgress.preprocessing}%</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="w-20 text-gray-300">特征提取</span>
                    <div className="flex-1">
                      <ProgressBar 
                        progress={stageProgress.featureExtraction} 
                        showPercentage={false} 
                        size="sm"
                        color={stageProgress.featureExtraction === 100 ? 'green' : 'blue'}
                      />
                    </div>
                    <span className="w-12 text-gray-400">{stageProgress.featureExtraction}%</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="w-20 text-gray-300">区域分割</span>
                    <div className="flex-1">
                      <ProgressBar 
                        progress={stageProgress.regionSegmentation} 
                        showPercentage={false} 
                        size="sm"
                        color={stageProgress.regionSegmentation === 100 ? 'green' : 'blue'}
                      />
                    </div>
                    <span className="w-12 text-gray-400">{stageProgress.regionSegmentation}%</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <ProgressBar progress={overallProgress} label="总体进度" showPercentage={true} />
                  {currentStage && (
                    <div className="mt-2 text-sm text-gray-300 text-center">当前阶段: {currentStage}</div>
                  )}
                </div>
              </div>
            )}

            {/* 分析报告 - 居中标题 */}
            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">分析报告</h3>
              
              {result ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-blue-400">{result.structureSurfaces}</div>
                      <div className="text-sm text-gray-300">识别的结构面数量</div>
                    </div>
                    
                    <div className="bg-gray-800/50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-yellow-400">{result.anomalousRegions}</div>
                      <div className="text-sm text-gray-300">异常区域标记</div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold text-white mb-2 text-center">主要特征统计</h4>
                    <div className="text-sm text-gray-300 space-y-1">
                      <div>• 检测到 {result.structureSurfaces} 个主要结构面</div>
                      <div>• 平均表面粗糙度: 0.23 mm</div>
                      <div>• 几何复杂度: 中等</div>
                      <div>• 处理时间: {result.processingTime} 秒</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {processing ? '分析进行中...' : '等待开始分析'}
                </div>
              )}
            </div>

            {/* 可视化结果 - 居中标题 */}
            <div className="glass-panel p-6">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">可视化结果</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-800/50 rounded-lg overflow-hidden" style={{ minHeight: '200px' }}>
                  <div className="p-3 bg-gray-700/50">
                    <h4 className="text-sm font-medium text-white text-center">分割后的彩色点云图</h4>
                  </div>
                  <div className="h-40 flex items-center justify-center">
                    {result ? (
                      <img 
                        src="https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg" 
                        alt="分割结果"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-sm">等待分析结果</span>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg overflow-hidden" style={{ minHeight: '200px' }}>
                  <div className="p-3 bg-gray-700/50">
                    <h4 className="text-sm font-medium text-white text-center">特征分布热力图</h4>
                  </div>
                  <div className="h-40 flex items-center justify-center">
                    {result ? (
                      <img 
                        src="https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg" 
                        alt="热力图"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-500 text-sm">等待分析结果</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};