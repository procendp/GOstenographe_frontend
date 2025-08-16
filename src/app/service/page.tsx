'use client';

import GNB from '@/components/GNB';
import Footer from '@/components/Footer';

export default function Services() {
  return (
    <>
      <GNB />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">주요 서비스</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">회의록 작성</h2>
            <p className="text-gray-600 mb-4">전문 속기사가 실시간으로 회의 내용을 기록하여 정확하고 신뢰성 있는 회의록을 제공합니다.</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">실시간 회의 기록</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">전문 용어 정확성 보장</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">빠른 납품 시스템</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">영상 자막</h2>
            <p className="text-gray-600 mb-4">영상 콘텐츠에 정확한 자막을 제공하여 접근성과 이해도를 높입니다.</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">다양한 자막 포맷 지원</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">시간 동기화 정확성</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">다국어 자막 서비스</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">통역 서비스</h2>
            <p className="text-gray-600 mb-4">전문 통역사가 실시간으로 정확한 통역 서비스를 제공합니다.</p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">동시 통역</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">순차 통역</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span className="text-gray-700">전문 분야별 통역사 배정</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 