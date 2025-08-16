'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dashboard } from '@/components/admin/Dashboard';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // 관리자 토큰 체크
    const checkAuth = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/check-admin/`, {
          credentials: 'include',
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (!response.ok) {
          // 올바른 Django admin 주소로 리다이렉트 (/manage/admin/이 아닌 /admin/으로)
          window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/`;
          return;
        }
      } catch (error) {
        console.error('인증 확인 중 오류 발생:', error);
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/admin/`;
        return;
      }
    };

    checkAuth();
  }, [router]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Dashboard />
    </main>
  );
} 