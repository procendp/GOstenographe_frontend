'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ManagePage() {
  const router = useRouter();

  useEffect(() => {
    // 대시보드로 자동 리다이렉트
    router.push('/manage/dashboard');
  }, [router]);

  return null;
} 