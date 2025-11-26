'use client';

import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            ← 홈으로 돌아가기
          </Link>
          <h1 className="mt-4 text-3xl font-bold text-gray-900">서비스 이용약관</h1>
          <p className="mt-2 text-sm text-gray-600">시행일: 2025년 11월 10일</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-8">

          {/* 제1조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 1조 (목적)</h2>
            <p className="text-gray-700 leading-relaxed">
              본 이용약관은 "속기사무소 정"("https://sokgijung.com"이하 "사이트")의 서비스의 이용조건과 운영에 관한 제반 사항 규정을 목적으로 합니다.
            </p>
          </section>

          {/* 제2조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 2조 (용어의 정의)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">본 약관에서 사용되는 주요한 용어의 정의는 다음과 같습니다.</p>
            <ul className="list-none space-y-3 text-gray-700">
              <li><span className="font-semibold">① 이용고객:</span> 사이트에 약관에 동의하고 개인정보를 제공하여, 사이트에서 이용계약을 체결하고 사이트를 이용하는 이용자를 말합니다.</li>
              <li><span className="font-semibold">② 이용계약:</span> 사이트 이용과 관련하여 사이트와 이용자간에 체결 하는 계약을 말합니다.</li>
              <li><span className="font-semibold">③ 운영자:</span> 서비스의 홈페이지를 개설하여 운영하는 운영자를 말합니다.</li>
              <li><span className="font-semibold">④ 해지:</span> 이용고객이 이용계약을 해약하는 것을 말합니다.</li>
            </ul>
          </section>

          {/* 제3조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 3조 (약관 외 준칙)</h2>
            <p className="text-gray-700 leading-relaxed">
              운영자는 필요한 경우 별도로 운영정책을 공지 안내할 수 있으며, 본 약관과 운영정책이 중첩될 경우 운영정책이 우선 적용됩니다.
            </p>
          </section>

          {/* 제4조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 4조 (이용계약 체결)</h2>
            <ul className="list-none space-y-3 text-gray-700">
              <li><span className="font-semibold">①</span> 이용계약은 사이트를 이용하려는 자가 본 약관 내용에 대한 동의와 서비스 신청에 대하여 운영자의 이용승낙으로 성립합니다.</li>
              <li><span className="font-semibold">②</span> 서비스를 이용하려는 자는 사이트 서비스 신청 시 본 약관을 읽고 아래에 있는 "동의합니다"를 선택하는 것으로 본 약관에 대한 동의 의사 표시를 합니다.</li>
            </ul>
          </section>

          {/* 제5조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 5조 (서비스 이용 신청)</h2>
            <ul className="list-none space-y-3 text-gray-700">
              <li><span className="font-semibold">①</span> 사이트를 이용하려는 이용자는 사이트에서 요청하는 제반정보(이름, 휴대폰번호, 주소 등)를 제공해야 합니다.</li>
              <li><span className="font-semibold">②</span> 타인의 정보를 도용하거나 허위의 정보를 등록하는 등 본인의 진정한 정보를 등록하지 않은 이용자는 사이트 이용과 관련하여 아무런 권리를 주장할 수 없으며, 관계 법령에 따라 처벌받을 수 있습니다.</li>
            </ul>
          </section>

          {/* 제6조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 6조 (개인정보처리방침)</h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              운영자는 관계 법령이 정하는 바에 따라 이용자의 개인정보를 보호하기 위하여 노력합니다.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              이용자의 개인정보보호에 관하여 관계법령 및 사이트가 정하는 개인정보처리방침에 정한 바에 따릅니다.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              단, 이용자의 귀책 사유로 인해 노출된 정보에 대해 운영자는 일체의 책임을 지지 않습니다.
            </p>
            <p className="text-gray-700 leading-relaxed">
              운영자는 이용자가 미풍양속에 저해되거나 국가안보에 위배되는 게시물 등 위법한 게시물을 등록 · 배포할 경우 관련 기관의 요청이 있을 시 이용자의 자료를 열람 및 해당 자료를 관련 기관에 제출할 수 있습니다.
            </p>
          </section>

          {/* 제7조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 7조 (운영자의 의무)</h2>
            <ul className="list-none space-y-3 text-gray-700">
              <li><span className="font-semibold">①</span> 운영자는 이용자로부터 제기되는 의견이나 불만이 정당하다고 인정할 경우에는 가급적 빨리 처리하여야 합니다. 다만, 개인적인 사정으로 신속한 처리가 곤란한 경우에는 사후에 공지 또는 이용자에게 쪽지, 전자우편 등을 보내는 등 최선을 다합니다.</li>
              <li><span className="font-semibold">②</span> 운영자는 계속적이고 안정적인 사이트 제공을 위하여 설비에 장애가 생기거나 멸실된 때에는 이를 지체 없이 수리 또는 복구할 수 있도록 사이트에 요구할 수 있습니다. 다만, 천재지변 또는 사이트나 운영자에 부득이한 사유가 있는 경우, 사이트 운영을 일시 정지할 수 있습니다.</li>
            </ul>
          </section>

          {/* 제8조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 8조 (이용자의 의무)</h2>
            <ul className="list-none space-y-3 text-gray-700">
              <li><span className="font-semibold">①</span> 이용자는 본 약관에서 규정하는 사항과 운영자가 정한 제반 규정, 공지사항 및 운영정책 등 사이트가 공지하는 사항 및 관계 법령을 준수하여야 하며, 기타 사이트의 업무에 방해가 되는 행위, 사이트의 명예를 손상하는 행위를 해서는 안됩니다.</li>
              <li><span className="font-semibold">②</span> 이용고객은 사이트의 명시적 동의가 없는 한 서비스의 이용 권한, 기타 이용계약상 지위를 타인에게 양도, 증여할 수 없으며, 이를 담보로 제공할 수 없습니다.</li>
              <li><span className="font-semibold">③</span> 이용자는 운영자와 사이트 및 제3자의 지적 재산권을 침해해서는 안됩니다.</li>
            </ul>
          </section>

          {/* 제9조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 9조 (서비스 이용 시간)</h2>
            <ul className="list-none space-y-3 text-gray-700">
              <li><span className="font-semibold">①</span> 서비스 이용 시간은 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴 1일 24시간을 원칙으로 합니다. 단, 사이트는 시스템 정기점검, 증설 및 교체를 위해 사이트가 정한 날이나 시간에 서비스를 일시중단 할 수 있으며 예정된 작업으로 인한 서비스 일시 중단은 사이트의 홈페이지에 사전 공지하오니 수시로 참고하시길 바랍니다.</li>
              <li>
                <span className="font-semibold">②</span> 단, 사이트는 다음 경우에 대하여 사전 공지나 예고없이 서비스를 일시적 혹은 영구적으로 중단할 수 있습니다.
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                  <li>긴급한 시스템 점검, 증설, 교체, 고장 혹은 오동작을 일으키는 경우</li>
                  <li>국가비상사태, 정전, 천재지변 등의 불가항력적인 사유가 있는 경우</li>
                  <li>전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를 중지한 경우</li>
                  <li>서비스 이용의 폭주 등으로 정상적인 서비스 이용에 지장이 있는 경우</li>
                </ul>
              </li>
              <li><span className="font-semibold">③</span> 전항에 의한 서비스 중단의 경우 사이트는 사전에 공지사항 등을 통하여 이용자에게 통지합니다. 단, 사이트가 통제할 수 없는 사유로 발생한 서비스의 중단에 대하여 사전 공지가 불가능한 경우에는 사후공지로 대신합니다.</li>
            </ul>
          </section>

          {/* 제10조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 10조 (서비스 이용 해지)</h2>
            <ul className="list-none space-y-3 text-gray-700">
              <li><span className="font-semibold">①</span> 이용고객이 사이트에서 이용계약을 해지하고자 하는 경우에는 이용고객이 본인이 고객센터를 통하여 이용계약 해지 신청을 하여야 합니다.</li>
              <li><span className="font-semibold">②</span> 해지 신청과 동시에 사이트가 제공하는 사이트 관련 프로그램이 신청 관리 화면에서 자동적으로 삭제됨으로 운영자는 더 이상 해지신청자의 정보를 볼 수 없습니다.</li>
            </ul>
          </section>

          {/* 제11조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 11조 (서비스 이용 제한)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              이용자는 다음 각호에 해당하는 행위를 하여서는 안 되며 해당 행위를 한 경우에 사이트는 이용자의 서비스 이용 제한 및 적법한 조치를 할 수 있으며 이용계약을 해지하거나 기간을 정하여 서비스를 중지할 수 있습니다.
            </p>
            <ul className="list-none space-y-2 text-gray-700">
              <li><span className="font-semibold">①</span> 서비스 신청 시 혹은 신청 후 정보 변경 시 허위 내용을 등록하는 행위</li>
              <li><span className="font-semibold">②</span> 타인의 사이트 이용을 방해하거나 정보를 도용하는 행위</li>
              <li><span className="font-semibold">③</span> 사이트의 운영진, 직원 또는 관계자를 사칭하는 행위</li>
              <li><span className="font-semibold">④</span> 사이트, 기타 제3자의 인격권 또는 지적재산권을 침해하거나 업무를 방해하는 행위</li>
              <li><span className="font-semibold">⑤</span> 다른 이용자에 대한 개인정보를 그 동의 없이 수집, 저장, 공개하는 행위</li>
              <li><span className="font-semibold">⑥</span> 범죄와 결부된다고 객관적으로 판단되는 행위</li>
              <li><span className="font-semibold">⑦</span> 기타 관련 법령에 위배되는 행위</li>
            </ul>
          </section>

          {/* 제15조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 15조 (손해배상)</h2>
            <ul className="list-none space-y-3 text-gray-700">
              <li><span className="font-semibold">①</span> 본 사이트에 발생한 모든 민, 형법상 책임은 이용자 본인에게 1차적으로 있습니다.</li>
              <li><span className="font-semibold">②</span> 본 사이트로부터 이용자가 받은 손해가 천재지변 등 불가항력적이거나 이용자의 고의 또는 과실로 인하여 발생한 때에는 손해배상을 하지 않습니다.</li>
            </ul>
          </section>

          {/* 제16조 */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">제 16조 (면책)</h2>
            <ul className="list-none space-y-3 text-gray-700">
              <li><span className="font-semibold">①</span> 운영자는 이용자가 사이트의 서비스 제공으로부터 기대되는 이익을 얻지 못하였거나 서비스 자료에 대한 취사선택 또는 이용으로 발생하는 손해 등에 대해서는 책임이 면제됩니다.</li>
              <li><span className="font-semibold">②</span> 운영자는 본 사이트의 서비스 기반 및 타 통신업자가 제공하는 전기통신 서비스의 장애로 인한 경우에는 책임이 면제되며 본 사이트의 서비스 기반과 관련되어 발생한 손해에 대해서는 사이트의 이용약관을 준용합니다</li>
              <li><span className="font-semibold">③</span> 운영자는 이용자가 저장, 게시 또는 전송한 자료와 관련하여 일체의 책임을 지지 않습니다.</li>
              <li><span className="font-semibold">④</span> 운영자는 이용자의 귀책 사유로 인하여 서비스 이용의 장애가 발생한 경우에는 책임지지 아니합니다.</li>
              <li><span className="font-semibold">⑤</span> 운영자는 이용자 상호 간 또는 이용자와 제3자 상호 간, 기타 이용자의 본 서비스 내외를 불문한 일체의 행위(데이터 전송 포함)에 대하여 책임을 지지 않습니다.</li>
              <li><span className="font-semibold">⑥</span> 운영자는 이용자가 게시 또는 전송한 자료 및 본 사이트로 이용자가 제공받을 수 있는 모든 자료들의 진위, 신뢰도, 정확성 등 그 내용에 대해서는 책임지지 아니합니다.</li>
              <li><span className="font-semibold">⑦</span> 운영자는 이용자 상호 간 또는 이용자와 제3자 상호 간의 서비스를 매개로 하여 물품거래 등을 한 경우에 그로부터 발생하는 일체의 손해에 대하여 책임지지 아니합니다.</li>
              <li><span className="font-semibold">⑧</span> 운영자는 운영자의 귀책 사유 없이 이용자가 또는 이용자와 제3자간에 발생한 일체의 분쟁에 대하여 책임지지 아니합니다.</li>
              <li><span className="font-semibold">⑨</span> 운영자는 서버 등 설비의 관리, 점검, 보수, 교체 과정 또는 소프트웨어의 운용 과정에서 고의 또는 고의에 준하는 중대한 과실 없이 발생할 수 있는 시스템의 장애, 제3자의 공격으로 인한 시스템의 장애, 국내외의 저명한 연구기관이나 보안 관련 업체에 의해 대응 방법이 개발되지 아니한 컴퓨터 바이러스 등의 침투나 기타 운영자가 통제할 수 없는 불가항력적 사유로 인한 이용자의 손해에 대하여 책임지지 않습니다.</li>
            </ul>
          </section>

          {/* 부칙 */}
          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4">부칙</h2>
            <p className="text-gray-700 leading-relaxed">
              이 약관은 2025년 11월 10일부터 시행합니다.
            </p>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600">
            <p>© 2025 속기사무소 정. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/policy" className="hover:text-gray-900">개인정보처리방침</Link>
              <Link href="/" className="hover:text-gray-900">홈으로</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
