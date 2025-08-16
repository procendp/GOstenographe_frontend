import React from 'react';

export default function PriceSection() {
  return (
    <section id="price" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">가격 안내</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow hover:border-2 hover:border-blue-600">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">기본형</h3>
            <div className="text-4xl font-bold text-gray-900 mb-6">
              ₩150,000
              <span className="text-base font-normal text-gray-500 ml-2">/ 시간</span>
            </div>
            <ul className="text-left space-y-4 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                <span className="text-gray-700">기본 회의록 작성</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                <span className="text-gray-700">24시간 이내 납품</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                <span className="text-gray-700">기본 포맷 제공</span>
              </li>
            </ul>
            <a href="/reception" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              신청하기
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow hover:border-2 hover:border-blue-600">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">프리미엄</h3>
            <div className="text-4xl font-bold text-gray-900 mb-6">
              ₩250,000
              <span className="text-base font-normal text-gray-500 ml-2">/ 시간</span>
            </div>
            <ul className="text-left space-y-4 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                <span className="text-gray-700">실시간 회의록 작성</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                <span className="text-gray-700">12시간 이내 납품</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                <span className="text-gray-700">맞춤형 포맷 제공</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                <span className="text-gray-700">전문 용어 검수</span>
              </li>
            </ul>
            <a href="/reception" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              신청하기
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow hover:border-2 hover:border-blue-600">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">엔터프라이즈</h3>
            <div className="text-4xl font-bold text-gray-900 mb-6">
              상담 문의
            </div>
            <ul className="text-left space-y-4 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                <span className="text-gray-700">맞춤형 서비스</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                <span className="text-gray-700">전담 매니저 배정</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                <span className="text-gray-700">API 연동 지원</span>
              </li>
            </ul>
            <a href="#customer" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              문의하기
            </a>
          </div>
        </div>

        <p className="text-center text-gray-600 text-sm">
          * 모든 가격은 부가세 별도이며, 프로젝트 규모와 기간에 따라 조정될 수 있습니다.
        </p>
      </div>
    </section>
  );
} 