import React, { useState } from 'react';
import { X, Palette, Cpu, Zap } from 'lucide-react';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('interface');
  const [settings, setSettings] = useState({
    theme: 'dark',
    language: 'zh',
    fontSize: 14,
    defaultResolution: 100,
    cachePath: '/tmp/las-cache',
    logLevel: 'info',
    apiEndpoint: 'http://localhost:8080',
    websocketPort: 9001,
    debugMode: false
  });

  if (!isOpen) return null;

  const tabs = [
    { id: 'interface', name: '界面设置', icon: Palette },
    { id: 'processing', name: '处理设置', icon: Cpu },
    { id: 'advanced', name: '高级设置', icon: Zap }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="glass-panel w-full max-w-4xl h-3/4 p-6 m-6 overflow-hidden">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">系统设置</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-300" />
          </button>
        </div>

        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 pr-6 border-r border-gray-600">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 pl-6 overflow-y-auto scrollbar-custom">
            {activeTab === 'interface' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">界面设置</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">主题</label>
                      <div className="flex space-x-3">
                        {[
                          { value: 'dark', label: '深色' },
                          { value: 'light', label: '浅色' },
                          { value: 'auto', label: '自动' }
                        ].map((theme) => (
                          <button
                            key={theme.value}
                            onClick={() => setSettings({...settings, theme: theme.value})}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                              settings.theme === theme.value
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                          >
                            {theme.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">语言</label>
                      <select
                        value={settings.language}
                        onChange={(e) => setSettings({...settings, language: e.target.value})}
                        className="tech-input w-full max-w-xs"
                      >
                        <option value="zh">中文</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        字体大小: {settings.fontSize}px
                      </label>
                      <input
                        type="range"
                        min="12"
                        max="20"
                        value={settings.fontSize}
                        onChange={(e) => setSettings({...settings, fontSize: parseInt(e.target.value)})}
                        className="w-full max-w-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'processing' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">处理设置</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">默认分辨率</label>
                      <input
                        type="number"
                        min="50"
                        max="500"
                        value={settings.defaultResolution}
                        onChange={(e) => setSettings({...settings, defaultResolution: parseInt(e.target.value)})}
                        className="tech-input w-full max-w-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">缓存路径</label>
                      <input
                        type="text"
                        value={settings.cachePath}
                        onChange={(e) => setSettings({...settings, cachePath: e.target.value})}
                        className="tech-input w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">日志级别</label>
                      <select
                        value={settings.logLevel}
                        onChange={(e) => setSettings({...settings, logLevel: e.target.value})}
                        className="tech-input w-full max-w-xs"
                      >
                        <option value="debug">Debug</option>
                        <option value="info">Info</option>
                        <option value="warning">Warning</option>
                        <option value="error">Error</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'advanced' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">高级设置</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">API端点</label>
                      <input
                        type="text"
                        value={settings.apiEndpoint}
                        onChange={(e) => setSettings({...settings, apiEndpoint: e.target.value})}
                        className="tech-input w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">WebSocket端口</label>
                      <input
                        type="number"
                        min="1000"
                        max="65535"
                        value={settings.websocketPort}
                        onChange={(e) => setSettings({...settings, websocketPort: parseInt(e.target.value)})}
                        className="tech-input w-full max-w-xs"
                      />
                    </div>

                    <div>
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settings.debugMode}
                          onChange={(e) => setSettings({...settings, debugMode: e.target.checked})}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-300">调试模式</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-600">
                  <div className="flex space-x-3">
                    <button className="tech-button">保存设置</button>
                    <button className="tech-button bg-gray-600">重置默认</button>
                    <button onClick={onClose} className="tech-button bg-gray-600">取消</button>
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