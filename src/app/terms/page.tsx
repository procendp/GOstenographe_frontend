'use client';

import { useEffect } from 'react';

export default function TermsPage() {
  useEffect(() => {
    // Notion 서비스 이용약관 페이지로 리다이렉트
    window.location.href = 'https://collie-retrospective.notion.site/2854b63e1e7a809590fcf1e47548ece7?pvs=74';
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-lg text-gray-600">서비스 이용약관 페이지로 이동 중...</p>
      </div>
    </div>
  );
}
