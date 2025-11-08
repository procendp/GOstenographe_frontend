'use client';

import { useEffect } from 'react';

export default function PolicyPage() {
  useEffect(() => {
    // Notion 개인정보처리방침 페이지로 리다이렉트
    window.location.href = 'https://collie-retrospective.notion.site/2854b63e1e7a80fa937deb4a4020a5cb?pvs=74';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg text-gray-600">개인정보처리방침 페이지로 이동 중...</p>
      </div>
    </div>
  );
}
