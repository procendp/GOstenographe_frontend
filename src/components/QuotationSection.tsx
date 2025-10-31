"use client";

interface QuotationSectionProps {
  totalPrice: number;
  transcriptionPrice: number;
  optionPrice: number;
  vatAmount: number;
  totalDuration: string;
  finalOptionText: string;
}

export default function QuotationSection({
  totalPrice,
  transcriptionPrice,
  optionPrice,
  vatAmount,
  totalDuration,
  finalOptionText
}: QuotationSectionProps) {
  // 계산 로직은 page.tsx에서 처리하고 결과만 받아서 표시

  return (
    <div className="quotation-section-isolated">
      {/* 예상 견적 메인 박스 */}
      <div className="quotation-main-box">
        <h2 style={{color: 'white', fontSize: '1.5rem', fontWeight: 'bold', margin: '0'}}>예상 견적</h2>
        <h2 style={{color: 'white', fontSize: '1.5rem', fontWeight: 'bold', margin: '0'}}>{totalPrice.toLocaleString()}원</h2>
      </div>

      {/* 서비스 신청 내역 */}
      <div className="quotation-details-box">
        <h6 className="c-checkout-f-text" style={{textAlign: 'left', margin: 0}}>- 속기록 제작 ({totalDuration}): {transcriptionPrice.toLocaleString()}원</h6>
        <h6 className="c-checkout-f-text" style={{textAlign: 'left', margin: 0}}>- 최종본: {finalOptionText} {optionPrice > 0 ? `(+${optionPrice.toLocaleString()}원)` : ''}</h6>
        <h6 className="c-checkout-f-text" style={{textAlign: 'left', margin: 0}}>- 부가세 (10%): {vatAmount.toLocaleString()}원</h6>
      </div>
    </div>
  );
}
