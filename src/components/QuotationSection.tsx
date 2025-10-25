"use client";
import { ReceptionFormData } from '@/types/reception';

interface QuotationSectionProps {
  tabs: any[]; // ReceptionFormData[] 대신 any[] 사용하여 타입 오류 방지
  selectedFileFormat: string;
  selectedFinalOption: string;
}

export default function QuotationSection({ tabs, selectedFileFormat, selectedFinalOption }: QuotationSectionProps) {
  // 가격 계산 함수
  const getPriceByDurationAndLocation = (minutes: number, location: '통화' | '현장'): number => {
    if (location === '현장') {
      return minutes * 2000; // 현장 녹음: 분당 2,000원
    } else {
      return minutes * 1500; // 통화 녹음: 분당 1,500원
    }
  };

  const calculateTotalPrice = () => {
    let total = 0;
    
    tabs.forEach(tab => {
      if (tab.files && tab.files.length > 0) {
        const minutes = Math.ceil(tab.fileDuration ? parseFloat(tab.fileDuration.split(':')[1]) || 0 : 0);
        const price = getPriceByDurationAndLocation(minutes, tab.recordingLocation || '통화');
        total += price;
      }
    });

    // 최종본 옵션 가격 추가
    if (selectedFinalOption === 'file_usb') {
      total += 5000;
    } else if (selectedFinalOption === 'file_usb_cd') {
      total += 6000;
    } else if (selectedFinalOption === 'file_usb_post') {
      total += 10000;
    }

    return total;
  };

  const formatTotalDuration = () => {
    let totalMinutes = 0;
    let totalSeconds = 0;
    
    tabs.forEach(tab => {
      if (tab.fileDuration) {
        const [hours, minutes, seconds] = tab.fileDuration.split(':').map(Number);
        totalMinutes += hours * 60 + minutes;
        totalSeconds += seconds;
      }
    });
    
    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds = totalSeconds % 60;
    
    return `${totalMinutes}분 ${totalSeconds}초`;
  };

  const getFinalOptionText = () => {
    switch (selectedFinalOption) {
      case 'file':
        return '파일';
      case 'file_usb':
        return '파일 +등기 우편';
      case 'file_usb_cd':
        return '파일 +등기 우편 +CD';
      case 'file_usb_post':
        return '파일 +등기 우편 +USB';
      default:
        return '파일';
    }
  };

  const getFinalOptionPrice = () => {
    switch (selectedFinalOption) {
      case 'file':
        return 0;
      case 'file_usb':
        return 5000;
      case 'file_usb_cd':
        return 6000;
      case 'file_usb_post':
        return 10000;
      default:
        return 0;
    }
  };

  return (
    <div className="quotation-section-isolated">
      {/* 예상 견적 메인 박스 */}
      <div className="quotation-main-box">
        <h2 style={{color: 'white', fontSize: '1.5rem', fontWeight: 'bold', margin: '0'}}>예상 견적</h2>
        <h2 style={{color: 'white', fontSize: '1.5rem', fontWeight: 'bold', margin: '0'}}>{calculateTotalPrice().toLocaleString()}원</h2>
      </div>

      {/* 서비스 신청 내역 */}
      <div className="quotation-details-box">
        <h6 className="c-checkout-f-text" style={{textAlign: 'left', margin: 0}}>- 속기록 제작<br/>({formatTotalDuration()})</h6>
        <h6 className="c-checkout-f-text" style={{textAlign: 'left', margin: 0}}>- 최종본: {getFinalOptionText()}</h6>
        <h6 className="c-checkout-f-text" style={{textAlign: 'left', margin: 0}}>- 부가세 (10%)</h6>
      </div>
    </div>
  );
}
