import React, { useRef } from 'react';
import { Upload, File } from 'lucide-react';

interface FileDropZoneProps {
  onFilesSelected: (files: File[]) => void;
  acceptedTypes: string[];
  multiple?: boolean;
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  placeholder?: string;
}

export const FileDropZone: React.FC<FileDropZoneProps> = ({
  onFilesSelected,
  acceptedTypes,
  multiple = false,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  placeholder = "拖拽LAS文件到此处或点击选择"
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onFilesSelected(files);
  };

  return (
    <div
      className={`drop-zone ${isDragging ? 'drag-over' : ''} p-8 cursor-pointer transition-all duration-300`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <div className="text-center">
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-300 mb-2">
          {placeholder}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          支持 .las 和 .laz 格式文件
        </p>
        
        <div className="flex items-center justify-center space-x-2 text-xs text-gray-600">
          <File className="w-4 h-4" />
          <span>支持格式: {acceptedTypes.join(', ')}</span>
        </div>
        
        {isDragging && (
          <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-blue-400">
              <Upload className="w-4 h-4" />
              <span>释放文件以上传</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};