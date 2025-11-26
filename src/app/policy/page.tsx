'use client';

import Link from 'next/link';

export default function PolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            ← 홈으로 돌아가기
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">개인정보 처리방침</h1>
          <p className="mt-2 text-sm text-gray-600">공고일자: 2025년 11월 10일 | 시행일자: 2025년 11월 10일</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">

          {/* 서문 */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              "속기사무소 정"(이하 "회사")은 회사가 운영하는 서비스와 관련 제반 서비스에 대하여 이용자의 개인정보 보호 및 권익 보호를 위해 「개인정보 보호법」 및 관계 법령이 정한 바를 준수하여 적법하게 개인정보를 처리하고 안전하게 관리하고 있습니다.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              이용자의 개인정보 처리에 관한 절차 및 기준을 안내하고, 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
            </p>
          </section>

          {/* 제1조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 1조 (개인정보의 수집·이용)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              회사는 서비스 이용자에 대하여 다음의 개인정보항목을 수집하여 처리하고 있습니다.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">구분</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">수집 항목</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">개인정보 처리 목적</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">서비스 제공 및 이용</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">이름, 아이디(이메일주소), 휴대전화번호, 주소, 이동통신사, 접속로그, 쿠키, 접속IP정보, 결제기록, 자막파일, 음성파일, 비석파일, 수령인정보, 신용카드정보, 은행계좌정보, 현금영수증정보</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">기본/맞춤형 서비스 제공, 계약서·청구서 발송, 요금결제 및 정산</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">고충처리</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">아이디(이메일주소), 휴대전화번호, 서비스 이용내역</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">이용자의 신원확인, 고충사항 확인, 사실조사를 위한 연락·통지, 처리결과 통보</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">서비스 품질 개선</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">서비스 이용 기록(신청 내역, 안내 내용, 웹사이트 이용내역 등)</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">서비스 개선 및 품질 향상</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 space-y-4 text-gray-700">
              <p className="leading-relaxed">
                회사는 이용자의 개인정보를 수집할 경우 법령에 근거가 없는 한 반드시 이용자의 동의를 얻어 수집하며, 이용자의 기본적 인권을 침해할 우려가 있는 인종, 출신지, 본적지, 사상, 정치적 성향, 범죄기록, 건강상태 등의 정보는 이용자의 동의 또는 법령의 규정에 의한 경우 이외에는 수집하지 않습니다.
              </p>

              <div>
                <p className="font-semibold mb-2">회사는 다음과 같은 방법으로 개인정보를 수집할 수 있습니다.</p>
                <ul className="list-decimal list-inside space-y-1 ml-4">
                  <li>홈페이지, 서면, 팩스, 전화, 고객센터 문의하기</li>
                  <li>생성정보 수집 툴을 통한 자동 수집</li>
                </ul>
              </div>

              <p className="leading-relaxed">
                회사는 개인정보를 수집함에 있어, 서비스 제공에 필요한 최소한의 개인정보를 "필수동의 항목"으로, 그 외 개인정보는 "선택동의 항목"으로 구분하여 이에 대해 개별적으로 동의할 수 있는 절차를 마련합니다. 회사는 이용자가 필요한 최소한의 개인정보 이외의 개인정보를 제공하지 아니한다는 이유로 그 서비스의 제공을 거부하지 않습니다.
              </p>
            </div>
          </section>

          {/* 제2조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 2조 (개인정보의 처리 및 보유기간)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <span className="font-semibold">①</span> 회사는 이용자가 서비스 이용목적을 달성 또는 이용자격을 상실할 경우에는 별도의 요청이 없더라도 수집된 이용자의 정보를 지체없이 삭제 및 파기합니다. 다만, 이용목적 달성 또는 이용자격 상실에도 불구하고 다음의 정보에 대해서는 아래의 이유로 보존합니다.
            </p>
            <ul className="list-disc list-inside ml-4 mb-4 text-gray-700 space-y-1">
              <li>관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mb-4">
              <span className="font-semibold">②</span> 전항에도 불구하고 회사는 다음의 사유에 해당하는 경우에는 해당 기간 종료 시까지 보존합니다.
            </p>
            <ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
              <li>서비스 이용 관련 개인정보 (로그기록): 「통신비밀보호법」의 보존기간인 3개월</li>
              <li>계약 또는 청약철회 등에 관한 기록 및 대금결제 및 재화 등의 공급에 관한 기록: 「전자상거래 등에서의 소비자보호에 관한 법률」의 보존기간인 5년</li>
              <li>소비자의 불만 또는 분쟁처리에 관한 기록: 「전자상거래 등에서의 소비자보호에 관한 법률」의 보존기간인 3년</li>
              <li>표시 광고에 관한 기록: 「전자상거래 등에서의 소비자보호에 관한 법률」의 보존기간인 6개월</li>
              <li>세법이 규정하는 모든 거래에 관한 장부 및 증빙서류: 「국세기본법」의 보존기간인 5년</li>
            </ul>

            <p className="text-gray-700 leading-relaxed mt-6">
              <span className="font-semibold">③</span> 회사는 1년 또는 이용자가 별도로 정한 기간 동안 서비스를 이용하지 않은 이용자의 개인정보를 별도로 개인정보를 분리보관 또는 삭제하여 관리합니다.
            </p>
          </section>

          {/* 제3조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 3조 (개인정보처리의 위탁)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              회사는 원활하고 향상된 서비스를 위하여 개인정보 취급을 타인에게 위탁하고 있습니다.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">위탁받는 자 (수탁자)</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">위탁업무 내용</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">개인정보 보유·이용 기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">Amazon Web Service, Inc.</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">서비스 운영 인프라 제공 및 데이터 보관</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">제2조의 보유기간과 동일</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 제4조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 4조 (개인정보의 국외이전)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              회사는 원활한 개인정보 업무처리를 위하여 아래와 같이 국외에 소재한 자에게 개인정보를 처리위탁하고 있습니다.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-300 text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">제공받는 자</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">소재지</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">이전 일시 및 방법</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">정보관리책임자 연락처</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">위탁하는 개인정보 항목</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">개인정보 이용 목적</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">개인정보 보유·이용 기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">Amazon Web Services, Inc.</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">미국</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">2025. 11. 10. 부터 서비스 이용 시 수시로 서버를 통해 전송</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">aws-korea-privacy@amazon.com</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">이름, 이메일, 주소, 전화번호, IP 주소, 쿠키, 서비스 접속 일시, 서비스 이용기록 등</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">서비스 운영 환경 제공 및 데이터 보관</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-700">제2조의 보유기간과 동일</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 제5조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 5조 (개인정보의 파기)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <span className="font-semibold">①</span> 회사는 원칙적으로 이용자의 개인정보를 보유기간 경과 또는 이용목적 달성 시 지체없이 파기하고 있습니다. 단, 이용자에게 개인정보 보관기간에 대해 별도의 동의를 얻은 경우, 또는 제2조 제2항에 기재된 법령에서 일정 기간 정보보관 의무를 부과하는 경우에는 해당 기간 동안 개인정보를 안전하게 보관합니다.
            </p>

            <p className="text-gray-700 leading-relaxed mb-3">
              <span className="font-semibold">②</span> 개인정보 파기의 절차 및 방법은 다음과 같습니다.
            </p>
            <ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
              <li><span className="font-semibold">파기절차:</span> 회사는 파기 사유가 발생한 개인정보를 선정하고, 회사의 개인정보 보호책임자의 승인을 받아 개인정보를 파기합니다.</li>
              <li><span className="font-semibold">파기방법:</span> 회사는 전자적 파일 형태로 기록·저장된 개인정보는 기록을 재생할 수 없도록 기술적 방법을 이용하여 파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄기로 분쇄하거나 소각하여 파기합니다.</li>
            </ul>
          </section>

          {/* 제6조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 6조 (수집목적과 합리적으로 관련된 범위 내의 개인정보 이용 및 제공)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              회사는 당초 수집 목적과 합리적인 범위 내에서 아래 각 기준을 고려하여, 이용자의 동의 없이 개인정보를 이용 또는 제3자에게 제공할 수 있습니다.
            </p>
            <ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
              <li>개인정보를 추가적으로 이용·제공하려는 목적이 당초 수집 목적과 관련성이 있는지 여부</li>
              <li>개인정보를 수집한 정황 또는 처리 관행에 비추어 볼 때 추가적인 이용·제공에 대한 예측 가능성이 있는지 여부</li>
              <li>개인정보의 추가적인 이용·제공이 정보주체의 이익을 부당하게 침해하는지 여부</li>
              <li>가명처리 또는 암호화 등 안전성 확보에 필요한 조치를 하였는지 여부</li>
            </ul>
          </section>

          {/* 제7조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 7조 (이용자의 법적 대리인의 권리·의무 및 행사방법)</h2>
            <ul className="list-disc list-inside ml-4 text-gray-700 space-y-3">
              <li>이용자는 회사에 대해 언제든지 개인정보 열람·정정·삭제·처리정지 요구 등의 권리를 행사할 수 있습니다.</li>
              <li>개인정보 보호법 등 관계 법령에서 정하는 바에 따라 이용자의 개인정보 열람·정정·삭제·처리정지 요구 등의 권리 행사가 제한될 수 있습니다</li>
              <li>이용자는 언제든지 서비스 내 회원탈퇴 기능 등을 통해 개인정보의 수집 및 이용 동의를 철회할 수 있습니다.</li>
              <li>제1항에 따른 권리 행사는 이용자의 법정 대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다. 이 경우 "개인정보 처리 방법에 관한 고시" 별지 제11호 양식에 따른 위임장을 제출하여야 합니다.</li>
              <li>이용자가 개인정보의 오류에 대한 정정을 요청한 경우, 정정을 완료하기 전까지 해당 개인정보를 이용 또는 제공하지 않습니다. 또한 잘못된 개인정보를 제3자에게 이미 제공한 경우에는 정정 처리결과를 제3자에게 지체 없이 통지하여 정정이 이루어지도록 하겠습니다.</li>
              <li>제1항의 권리 행사는 고객센터를 통해 요청할 수 있습니다.</li>
              <li>회사는 정보주체 권리에 따른 열람의 요구, 정정·삭제의 요구, 처리정지의 요구 시 열람 등 요구를 한 자가 본인이거나 정당한 대리인인지를 확인합니다.</li>
            </ul>
          </section>

          {/* 제8조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 8조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <span className="font-semibold">①</span> 회사는 이용자에게 개별적인 맞춤서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
            </p>

            <p className="text-gray-700 leading-relaxed mb-4">
              <span className="font-semibold">②</span> 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에게 보내는 소량의 정보이며 이용자의 PC 컴퓨터 내의 하드디스크에 저장되기도 합니다.
            </p>

            <ul className="list-disc list-inside ml-4 text-gray-700 space-y-3">
              <li>
                <span className="font-semibold">쿠키의 사용 목적:</span> 이용자가 방문한 각 서비스와 웹 사이트에 대한 방문 및 이용형태, 인기 검색어, 보안접속 여부 등을 파악하여 이용자에게 최적화된 정보 제공을 위해 사용됩니다.
              </li>
              <li>
                <span className="font-semibold">쿠키의 설치·운영 및 거부:</span> 웹브라우저 상단의 도구 → 인터넷 옵션 → 개인정보 메뉴의 옵션 설정을 통해 쿠키 저장을 거부할 수 있습니다.
              </li>
              <li>
                쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.
              </li>
            </ul>
          </section>

          {/* 제9조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 9조 (개인정보의 안전성 확보 조치)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
            </p>
            <ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
              <li><span className="font-semibold">관리적 조치:</span> 내부관리계획 수립·시행, 정기적 직원 교육 등</li>
              <li><span className="font-semibold">기술적 조치:</span> 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화, 보안프로그램 설치 및 갱신 등</li>
            </ul>
          </section>

          {/* 제10조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 10조 (개인정보 보호책임자 및 담당자 안내)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              <span className="font-semibold">①</span> 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
            </p>

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-900 mb-4">개인정보 보호책임자 및 담당부서</h3>
              <dl className="space-y-2 text-gray-700">
                <div className="flex">
                  <dt className="font-semibold w-24">이름:</dt>
                  <dd>고민정</dd>
                </div>
                <div className="flex">
                  <dt className="font-semibold w-24">소속:</dt>
                  <dd>속기사무소 정</dd>
                </div>
                <div className="flex">
                  <dt className="font-semibold w-24">직위:</dt>
                  <dd>대표</dd>
                </div>
                <div className="flex">
                  <dt className="font-semibold w-24">전화:</dt>
                  <dd>010-2681-2571</dd>
                </div>
                <div className="flex">
                  <dt className="font-semibold w-24">메일:</dt>
                  <dd>info@sokgijung.com</dd>
                </div>
              </dl>
            </div>

            <p className="text-gray-700 leading-relaxed mt-6 mb-4">
              <span className="font-semibold">②</span> 정보주체는 회사의 서비스를 이용하면서 발생한 모든 개인정보 보호 관련 문의, 불만처리, 피해구제 등에 관한 사항을 개인정보 보호책임자 및 담당부서로 문의할 수 있습니다. 회사는 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴 것입니다.
            </p>

            <p className="text-gray-700 leading-relaxed mb-4">
              <span className="font-semibold">③</span> 기타 개인정보 침해에 대한 신고나 상담이 필요한 경우에 아래 기관에 문의 가능합니다.
            </p>

            <ul className="list-disc list-inside ml-4 text-gray-700 space-y-2">
              <li>개인정보침해신고센터 (privacy.kisa.or.kr / 국번없이 118)</li>
              <li>대검찰청 사이버수사과 (www.spo.go.kr / 국번없이 1301)</li>
              <li>경찰청 사이버수사국 (police.go.kr / 국번없이 182)</li>
            </ul>
          </section>

          {/* 제11조 */}
          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 11조 (개인정보 처리방침 개정 시 고지 의무)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              본 개인정보처리방침은 시행일로부터 적용되며, 개인정보처리방침의 내용 추가, 삭제 및 수정이 있을 경우 개정 최소 7일 전에 "공지사항"을 통해 사전 공지를 할 것입니다.
            </p>

            <ul className="list-disc list-inside ml-4 text-gray-700 space-y-1">
              <li>공고일자: 2025년 11월 10일</li>
              <li>시행일자: 2025년 11월 10일</li>
            </ul>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>© 2025 속기사무소 정. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/terms" className="hover:text-gray-900">서비스 이용약관</Link>
              <Link href="/" className="hover:text-gray-900">홈으로</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
