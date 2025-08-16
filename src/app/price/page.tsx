/*
'use client';

import GNB from '@/components/GNB';
import Footer from '@/components/Footer';

export default function Pricing() {
  return (
    <>
      <GNB />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">가격 안내</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4">기본형</h2>
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
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
*/ 