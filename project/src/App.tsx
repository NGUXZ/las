import React, { useState } from 'react';
import { NavigationBar } from './components/layout/NavigationBar';
import { StatusBar } from './components/layout/StatusBar';
import { SettingsPanel } from './components/layout/SettingsPanel';
import { UnwrapModule } from './components/modules/UnwrapModule';
import { BatchModule } from './components/modules/BatchModule';
import { AnalysisModule } from './components/modules/AnalysisModule';
import { useWebSocket } from './hooks/useWebSocket';
import './styles/globals.css';

function App() {
  const [activeModule, setActiveModule] = useState('unwrap');
  const [showSettings, setShowSettings] = useState(false);
  const [currentTask, setCurrentTask] = useState<string>();
  const [taskStatus, setTaskStatus] = useState<'idle' | 'processing' | 'completed' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState<string>();

  const { isConnected } = useWebSocket('ws://localhost:9001');

  const systemStatus = {
    backendConnected: isConnected,
    cpuUsage: 35,
    memoryUsage: { used: 8.2, total: 16.0 }
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'unwrap':
        return <UnwrapModule />;
      case 'batch':
        return <BatchModule />;
      case 'analysis':
        return <AnalysisModule />;
      default:
        return <UnwrapModule />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
      {/* Navigation */}
      <NavigationBar
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        onOpenSettings={() => setShowSettings(true)}
        systemStatus={systemStatus}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {renderModule()}
      </main>

      {/* Status Bar */}
      <StatusBar
        currentTask={currentTask}
        taskStatus={taskStatus}
        message={statusMessage}
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}

export default App;