import { useState, useCallback } from 'react';
import { FileInfo } from '../types';

export const useFileUpload = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): boolean => {
    return file.name.toLowerCase().endsWith('.las') || file.name.toLowerCase().endsWith('.laz');
  };

  const addFiles = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter(validateFile);
    const fileInfos: FileInfo[] = validFiles.map(file => ({
      name: file.name,
      size: file.size,
      pointCount: Math.floor(Math.random() * 10000000) + 1000000, // Mock point count
      bounds: {
        min: { x: Math.random() * 100, y: Math.random() * 100, z: 0 },
        max: { x: Math.random() * 100 + 100, y: Math.random() * 100 + 100, z: Math.random() * 50 + 10 }
      },
      status: 'pending',
      progress: 0
    }));

    setFiles(prev => [...prev, ...fileInfos]);
    return fileInfos;
  }, []);

  const removeFile = useCallback((filename: string) => {
    setFiles(prev => prev.filter(f => f.name !== filename));
  }, []);

  const updateFileStatus = useCallback((filename: string, status: FileInfo['status'], progress?: number, error?: string) => {
    setFiles(prev => prev.map(f => 
      f.name === filename 
        ? { ...f, status, progress: progress ?? f.progress, error }
        : f
    ));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  }, [addFiles]);

  return {
    files,
    isDragging,
    addFiles,
    removeFile,
    updateFileStatus,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    validateFile
  };
};