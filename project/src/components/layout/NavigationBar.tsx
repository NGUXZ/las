import React from 'react';
import { Settings, HelpCircle, Wifi, Cpu, HardDrive } from 'lucide-react';

interface NavigationBarProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  onOpenSettings: () => void;
  systemStatus: {
    backendConnected: boolean;
    cpuUsage: number;
    memoryUsage: { used: number; total: number };
  };
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  activeModule,
  onModuleChange,
  onOpenSettings,
  systemStatus
}) => {
  const modules = [
    { id: 'unwrap', name: '隧道展开' },
    { id: 'batch', name: '批量处理' },
    { id: 'analysis', name: '深度分析' }
  ];

  return (
    <nav className="glass-panel h-16 px-6 flex items-center justify-between">
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <HardDrive className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-white">LAS隧道点云处理系统</h1>
        </div>
        
        <div className="flex space-x-1">
          {modules.map((module) => (
            <button
              key={module.id}
              onClick={() => onModuleChange(module.id)}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                activeModule === module.id
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg'
                  : 'text-gray-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {module.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 text-sm">
          <div className="flex items-center space-x-1">
            <Wifi className={`w-4 h-4 ${systemStatus.backendConnected ? 'text-green-500' : 'text-red-500'}`} />
            <span className={systemStatus.backendConnected ? 'text-green-400' : 'text-red-400'}>
              {systemStatus.backendConnected ? '已连接' : '断开'}
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300">{systemStatus.cpuUsage}%</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <span className="text-gray-300">
              {systemStatus.memoryUsage.used.toFixed(1)}GB
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="设置"
          >
            <Settings className="w-5 h-5 text-gray-300" />
          </button>
          
          <button
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            title="帮助"
          >
            <HelpCircle className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </div>
    </nav>
  );
};