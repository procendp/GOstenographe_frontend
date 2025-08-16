'use client';

import React from 'react';
import { FaUsers, FaFileAlt, FaCheckCircle, FaSpinner } from 'react-icons/fa';

interface StatsCardProps {
  title: string;
  value: number | string;
  type: 'users' | 'files' | 'completed' | 'processing';
  change?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, type, change }) => {
  const getIcon = () => {
    switch (type) {
      case 'users':
        return <FaUsers className="w-6 h-6 text-blue-500" />;
      case 'files':
        return <FaFileAlt className="w-6 h-6 text-blue-500" />;
      case 'completed':
        return <FaCheckCircle className="w-6 h-6 text-blue-500" />;
      case 'processing':
        return <FaSpinner className="w-6 h-6 text-blue-500" />;
      default:
        return <FaUsers className="w-6 h-6 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {change !== undefined && (
            <p className={`text-sm mt-2 ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {change >= 0 ? '+' : ''}{change}% 전월 대비
            </p>
          )}
        </div>
        <div className="p-3 bg-blue-100 rounded-full">
          {getIcon()}
        </div>
      </div>
    </div>
  );
};

export default StatsCard; 