import React from 'react';

interface StorageUsageProps {
  totalSpace?: number;
  usedSpace?: number;
}

const StorageUsage: React.FC<StorageUsageProps> = ({
  totalSpace = 1000, // 기본값 1000GB
  usedSpace = 0
}) => {
  const usagePercentage = Math.min((usedSpace / totalSpace) * 100, 100);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">저장소 사용량</h3>
      <div className="space-y-4">
        <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${usagePercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{usedSpace.toFixed(1)} GB</span>
          <span>{totalSpace.toFixed(1)} GB</span>
        </div>
        <p className="text-sm text-gray-500">
          전체 용량의 {usagePercentage.toFixed(1)}% 사용 중
        </p>
      </div>
    </div>
  );
};

export default StorageUsage; 