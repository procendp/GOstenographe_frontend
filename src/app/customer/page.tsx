'use client';

import GNB from '@/components/GNB';
import Footer from '@/components/Footer';

export default function CustomerPage() {
  return (
    <>
      <GNB />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-12">고객센터</h1>
        
        <section className="mb-16">
          <h2 className="text-3xl font-semibold text-blue-600 mb-8">문의하기</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">이메일 문의</h3>
              <p className="text-lg text-gray-600">contact@gostenographe.com</p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">전화 문의</h3>
              <p className="text-lg text-gray-600">02-1234-5678</p>
              <p className="text-sm text-gray-500 mt-2">평일 09:00 - 18:00</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-semibold text-blue-600 mb-8">자주 묻는 질문</h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">서비스 이용 방법이 궁금합니다.</h3>
              <p className="text-gray-600 leading-relaxed">
                서비스 페이지에서 자세한 이용 방법을 확인하실 수 있습니다. 각 서비스별 상세 내용과 
                이용 절차를 안내하고 있으니 참고해 주시기 바랍니다.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">견적은 어떻게 받을 수 있나요?</h3>
              <p className="text-gray-600 leading-relaxed">
                가격 페이지에서 예상 견적을 확인하실 수 있으며, 상담 신청을 통해 정확한 견적을 
                받으실 수 있습니다. 프로젝트의 규모와 특성에 따라 맞춤형 견적을 제공해 드립니다.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold text-blue-600 mb-4">작업 진행 상황은 어떻게 확인하나요?</h3>
              <p className="text-gray-600 leading-relaxed">
                진행 과정 페이지에서 실시간으로 작업 진행 상황을 확인하실 수 있습니다. 
                각 단계별 진행 상태와 예상 완료 시간을 투명하게 공개하고 있습니다.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
} 