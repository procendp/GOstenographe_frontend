import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // /manage/* 경로에 대한 접근 검사
  if (request.nextUrl.pathname.startsWith('/manage/')) {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      // Django의 check-admin API를 호출하여 인증 상태 확인
      const response = await fetch(`${backendUrl}/api/check-admin/`, {
        credentials: 'include',
        headers: {
          'Cookie': request.headers.get('cookie') || '',
        }
      });

      if (!response.ok) {
        // 인증되지 않은 경우 Django admin 로그인 페이지로 리다이렉트
        return NextResponse.redirect(`${backendUrl}/admin/`);
      }

      // 개발 환경에서는 IP 검사 생략
      if (process.env.NODE_ENV === 'production') {
        const clientIP = request.ip || '';
        const allowedIPs = process.env.ALLOWED_ADMIN_IPS?.split(',') || [];
        
        if (!allowedIPs.includes(clientIP)) {
          return NextResponse.redirect('/404');
        }
      }
    } catch (error) {
      console.error('인증 확인 중 오류 발생:', error);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      return NextResponse.redirect(`${backendUrl}/admin/`);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/manage/:path*'
}; 