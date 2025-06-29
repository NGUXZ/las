export interface FileInfo {
  name: string;
  size: number;
  pointCount?: number;
  bounds?: {
    min: { x: number; y: number; z: number };
    max: { x: number; y: number; z: number };
  };
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

export interface ProcessingParameters {
  sampleRatio: number;
  resolution: number;
  deviationThreshold: number;
  filterStrength: 'low' | 'medium' | 'high';
  saveDiagnosticImages: boolean;
}

export interface CylinderFit {
  center: { x: number; y: number; z: number };
  radius: number;
  axis: { x: number; y: number; z: number };
  fittingError: number;
  confidence: number;
}

export interface FloorDetection {
  gapAngle: number;
  detected: boolean;
  confidence: number;
}

export interface ProcessingStep {
  id: string;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  timeElapsed?: number;
  estimatedRemaining?: number;
}

export interface BatchProcessingConfig {
  mode: 'cpu' | 'gpu' | 'hybrid';
  workerCount: number;
  skipExisting: boolean;
  autoRetry: boolean;
  retryCount: number;
  keepDirectoryStructure: boolean;
  compressOutput: boolean;
}

export interface SystemStatus {
  backendConnected: boolean;
  cpuUsage: number;
  memoryUsage: { used: number; total: number };
  gpuAvailable: boolean;
  gpuUsage?: number;
}

export interface AnalysisROI {
  min: { x: number; y: number; z: number };
  max: { x: number; y: number; z: number };
  pointCount: number;
  density: number;
  volume: number;
}

export interface FeatureVisualization {
  type: 'geometric' | 'color' | 'texture';
  subtype: string;
  opacity: number;
  colorMap: string;
}

export interface StructureSurface {
  id: string;
  type: 'plane' | 'curved' | 'irregular';
  orientation: { x: number; y: number; z: number };
  area: number;
  confidence: number;
  visible: boolean;
}

export interface AnalysisSettings {
  preprocessing: {
    noiseFilterStrength: number;
    voxelSize: number;
    downsamplingRate: number;
    autoPoseCorrection: boolean;
  };
  featureExtraction: {
    selectedFeatures: string[];
    neighborhoodRadius: number;
    gpuAcceleration: boolean;
    parallelBlocks: number;
  };
  regionSegmentation: {
    algorithm: string;
    minRegionSize: number;
    mergeThreshold: number;
    optimizationIterations: number;
  };
}