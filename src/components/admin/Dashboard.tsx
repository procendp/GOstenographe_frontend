'use client';

import React from 'react';
import StatsCard from './StatsCard';
import RequestList from './RequestList';
import StorageUsage from './StorageUsage';
import Notifications from './Notifications';
import QuickActions from './QuickActions';
import ProcessingChart from './ProcessingChart';

export const Dashboard: React.FC = () => {
  // 임시 데이터
  const statsData = [
    { title: '총 사용자', value: '1,234', type: 'users' as const, change: 12 },
    { title: '총 파일', value: '5,678', type: 'files' as const, change: -5 },
    { title: '완료된 요청', value: '892', type: 'completed' as const, change: 8 },
    { title: '처리 중', value: '123', type: 'processing' as const, change: 15 },
  ];

  const requests = [
    { id: 1, username: '홍길동', type: '이미지 처리', status: 'completed' as const, timestamp: '5분 전' },
    { id: 2, username: '김철수', type: '문서 변환', status: 'processing' as const, timestamp: '10분 전' },
    { id: 3, username: '이영희', type: '이미지 처리', status: 'failed' as const, timestamp: '15분 전' },
  ];

  const notifications = [
    { id: 1, message: '새로운 파일이 업로드되었습니다.', type: 'info' as const, timestamp: '방금 전', isRead: false },
    { id: 2, message: '처리가 완료되었습니다.', type: 'success' as const, timestamp: '5분 전', isRead: false },
    { id: 3, message: '오류가 발생했습니다.', type: 'error' as const, timestamp: '10분 전', isRead: true },
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-8">대시보드</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            type={stat.type}
            change={stat.change}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProcessingChart />
        <StorageUsage totalSpace={1000} usedSpace={456} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RequestList requests={requests} />
        <div className="space-y-6">
          <Notifications notifications={notifications} />
          <QuickActions />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 