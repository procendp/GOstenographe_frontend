'use client';

import ApplyGNB from '@/components/ApplyGNB';
import NewFooter from '@/components/NewFooter';
import { useState, useRef, useEffect } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import OrdererInfoSection from '@/components/OrdererInfoSection';
import RequestInfoSection from '@/components/RequestInfoSection';
import FileUploadSection from '@/components/FileUploadSection';
import { ReceptionFormData } from '@/types/reception';
import { uploadMultipleFiles } from '@/utils/fileUpload';


function Reception() {
  // 기본 상태들
  const [customerName, setCustomerName] = useState('김테스트');
  const [customerPhone, setCustomerPhone] = useState('010-1234-5678');
  const [customerEmail, setCustomerEmail] = useState('test@example.com');
  const [customerAddress, setCustomerAddress] = useState('서울특별시 강남구 테헤란로 123, 456호');
  const [tabs, setTabs] = useState([
    { 
      files: [{ file: { name: '20241201_회의록음.m4a' } as File, file_key: 'test' }], 
      speakerNames: ['김대표', '이부장', '박과장'], 
      selectedDates: [] as string[], 
      detail: '분기별 실적 검토 회의 내용입니다. 중요한 의사결정 사항이 포함되어 있습니다.', 
      speakerCount: 3, 
      timestamps: ['00:45:30'] as string[], 
      timestampRanges: [] as any[], 
      recordType: '부분' as '전체' | '부분', 
      recordingDate: '2024-12-01', 
      recordingTime: '14:30', 
      recordingUnsure: false 
    },
    { 
      files: [{ file: { name: '20241202_인터뷰.wav' } as File, file_key: 'test2' }], 
      speakerNames: ['면접관A', '면접관B', '지원자'], 
      selectedDates: [] as string[], 
      detail: '신입사원 채용 면접 녹음 파일입니다.', 
      speakerCount: 3, 
      timestamps: ['01:20:15'] as string[], 
      timestampRanges: [] as any[], 
      recordType: '전체' as '전체' | '부분', 
      recordingDate: '2024-12-02', 
      recordingTime: '10:00', 
      recordingUnsure: false 
    }
  ]);
  const [activeTab, setActiveTab] = useState(0);
  const [agree, setAgree] = useState(false);
  const router = useRouter();
  const [requestId, setRequestId] = useState<number|null>(null);
  const [filesData, setFilesData] = useState<any[]>([]);
  const [showComplete, setShowComplete] = useState(false);
  const [openAccordionIndex, setOpenAccordionIndex] = useState<number | null>(null);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [addressError, setAddressError] = useState('');
  const [selectedFileFormat, setSelectedFileFormat] = useState('docx');
  const [selectedFinalOption, setSelectedFinalOption] = useState('file');

  // 기본 함수들
  const handleNewRequest = () => {
    // 페이지 새로고침으로 초기 상태로 돌아가기
    window.location.reload();
  };

  const handleAddTab = () => {
    if (tabs.length >= 5) return;
    setTabs([...tabs, { files: [], speakerNames: [''], selectedDates: [], detail: '', speakerCount: 1, timestamps: [], timestampRanges: [], recordType: '전체', recordingDate: '', recordingTime: '', recordingUnsure: false }]);
    setActiveTab(tabs.length);
  };

  const handleRemoveTab = async (idx: number) => {
    if (tabs.length === 1) return;
    const newTabs = tabs.filter((_, i) => i !== idx);
    setTabs(newTabs);
    if (activeTab === idx) {
      setActiveTab(Math.max(0, idx - 1));
    } else if (activeTab > idx) {
      setActiveTab(activeTab - 1);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // 임시로 파일 정보를 상태에 저장 (업로드 시작 표시)
    setTabs(tabs => tabs.map((tab, idx) => 
      idx === activeTab ? {
        ...tab, 
        files: files.map(file => ({file, file_key: 'uploading'}))
      } : tab
    ));
    
    try {
      // 파일들을 S3에 업로드
      const uploadedFiles = await uploadMultipleFiles(
        files,
        customerName,
        customerEmail,
        (fileIndex, progress) => {
          // TODO: 업로드 진행상황 UI 업데이트
          console.log(`파일 ${fileIndex + 1} 업로드 진행률: ${progress}%`);
        }
      );
      
      // 업로드 완료 후 file_key 업데이트
      setTabs(tabs => tabs.map((tab, idx) => 
        idx === activeTab ? {
          ...tab,
          files: uploadedFiles.map(({file, fileKey}) => ({file, file_key: fileKey}))
        } : tab
      ));
      
      console.log('파일 업로드 완료:', uploadedFiles);
      alert('파일 업로드 완료!');
      
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      alert(`파일 업로드 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      
      // 업로드 실패 시 파일 목록에서 제거
      setTabs(tabs => tabs.map((tab, idx) => 
        idx === activeTab ? {...tab, files: []} : tab
      ));
    }
  };

  const toggleFile = (idx: number) => {
    setOpenAccordionIndex(prev => prev === idx ? null : idx);
  };

  // 스텝 인디케이터
  const Stepper = ({ step }: { step: number }) => {
    return (
      <div className="c-steps-grid max-w-[800px] mx-auto relative" style={{ gap: '4rem' }}>
        <div className="c-steps-item">
          <div className={`c-steps-dot ${step >= 1 ? 'current' : ''}`}>
            <div className={`c-steps-dot-inner ${step >= 1 ? 'current' : ''}`}></div>
          </div>
          <h3 className="c-step-title">신청서 작성</h3>
          <p className="c-steps-sub-title">파일과 정보를<br/>입력해 주세요.</p>
        </div>
        
        {/* 점선을 절대 위치로 두 원 사이 중앙에 배치 */}
        <div className="c-steps-line" style={{ width: '320px' }}>
          <div 
            className={`c-steps-line-dot ${step >= 2 ? 'ongoing' : ''}`}
          ></div>
        </div>
        
        <div className="c-steps-item">
          <div className={`c-steps-dot ${step >= 2 ? 'current' : ''}`}>
            <div className={`c-steps-dot-inner ${step >= 2 ? 'current' : ''}`}></div>
          </div>
          <h3 className="c-step-title">제출 완료</h3>
          <p className="c-steps-sub-title">신청 정보를<br/>확인해 주세요.</p>
        </div>
      </div>
    );
  };

  // 탭 렌더링
  const renderTabs = () => (
    <>
      {tabs.map((tab, idx) => {
        const isFirst = idx === 0;
        const isActive = activeTab === idx;
        
        let buttonClass = '';
        if (isFirst) {
          buttonClass = `c-file-tab-button-left ${isActive ? 'w--current' : ''}`;
        } else if (idx === tabs.length - 1) {
          buttonClass = `c-file-tab-button-right ${isActive ? 'w--current' : ''}`;
        } else {
          buttonClass = `c-file-tab-button-mid ${isActive ? 'w--current' : ''}`;
        }
        
        return (
          <button
            key={idx}
            data-w-tab={`파일 ${idx + 1}`}
            className={buttonClass}
            onClick={() => setActiveTab(idx)}
          >
            <div className="c-tab-button-text">파일 {idx + 1}</div>
            <div className="c-tab-button-text-mobile">{idx + 1}</div>
          </button>
        );
      })}
      
      {tabs.length < 5 && (
        <button
          data-w-tab="추가"
          className="c-file-tab-button-right"
          onClick={handleAddTab}
        >
          <div className="c-tab-button-text">+</div>
          <div className="c-tab-button-text-mobile">+</div>
        </button>
      )}
      
      {tabs.length > 1 && (
        <div className="ml-4 flex items-center">
          <button
            className="c-delete-button"
            onClick={() => handleRemoveTab(activeTab)}
          >
            삭제
          </button>
        </div>
      )}
    </>
  );

  // 폼 유효성 검사
  const validatePhone = (phone: string) => /^[0-9]{10,11}$/.test(phone);
  const validateEmail = (email: string) => email.includes('@') && email.includes('.') && email.indexOf('@') < email.lastIndexOf('.') && email.length > 5;
  const validateAddress = (address: string) => /^[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s]{5,}$/.test(address.trim());

  const isFormValid = () => {
    const phoneValid = validatePhone(customerPhone);
    const emailValid = validateEmail(customerEmail);
    const addressValid = validateAddress(customerAddress);
    const nameValid = customerName.trim() !== '';
    const agreeValid = agree;
    const fileValid = tabs.every(tab => tab.files && tab.files.length > 0);
    
    return fileValid && nameValid && phoneValid && emailValid && addressValid && agreeValid;
  };

  // 제출 처리
  const handleSubmit = async () => {
    if (!agree) {
      alert('약관에 동의해주세요.');
      return;
    }

    // 파일이 업로드되지 않은 탭이 있는지 확인
    const hasUnuploadedFiles = tabs.some(tab => 
      tab.files.some(f => !f.file_key || f.file_key === 'uploading')
    );
    
    if (hasUnuploadedFiles) {
      alert('모든 파일이 업로드될 때까지 기다려주세요.');
      return;
    }
    
    // 실제 API 호출
    try {
      const requestData = {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        address: customerAddress,
        draft_format: selectedFileFormat,
        final_option: selectedFinalOption,
        speaker_count: tabs.reduce((max, tab) => Math.max(max, tab.speakerCount), 1),
        speaker_info: tabs.flatMap(tab => tab.speakerNames.filter(name => name.trim())),
        has_detail: tabs.some(tab => tab.detail && tab.detail.trim()),
        detail_info: tabs.map(tab => tab.detail).filter(detail => detail?.trim()).join('\n\n'),
        recording_date: tabs[0]?.recordingDate ? new Date(tabs[0].recordingDate).toISOString() : null,
        recording_location: '',
        agreement: agree,
        is_temporary: false,
      };

      console.log('전송할 요청 데이터:', requestData);

      const response = await fetch('http://localhost:8000/api/requests/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      
      console.log('응답 상태:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('요청 생성 완료:', result);
        setRequestId(result.id);
        
        // 파일 정보를 백엔드에 저장
        const allFiles = tabs.flatMap(tab => tab.files);
        for (const fileObj of allFiles) {
          if (fileObj.file_key && fileObj.file_key !== 'uploading') {
            try {
              const fileResponse = await fetch(`http://localhost:8000/api/requests/${result.id}/upload_file/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  file_name: fileObj.file.name,
                  file_type: fileObj.file.type,
                  file_size: fileObj.file.size,
                  file_key: fileObj.file_key,
                }),
              });
              
              if (!fileResponse.ok) {
                console.error('파일 정보 저장 실패:', fileObj.file.name);
              }
            } catch (fileError) {
              console.error('파일 정보 저장 중 오류:', fileError);
            }
          }
        }
        
        setShowComplete(true);
        setFilesData(tabs.map(tab => ({
          name: tab.files.map(f => f.file.name).join(', '),
          type: tab.recordType,
          ranges: tab.timestamps,
          speakers: tab.speakerNames.join(', '),
          date: tab.selectedDates.join(', '),
          detail: tab.detail,
          format: selectedFileFormat,
          option: selectedFinalOption,
        })));
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          errorData = { error: '응답 파싱 실패' };
        }
        console.error('API 오류:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        alert(`신청 실패 (${response.status}): ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      console.error('신청 처리 중 오류:', error);
      alert('신청 처리 중 오류가 발생했습니다.');
    }
  };

  // 동적 견적 계산 함수들
  const calculateTotalDuration = () => {
    const totalMinutes = tabs.reduce((sum, tab) => {
      if (tab.timestamps.length > 0) {
        const lastTimestamp = tab.timestamps[tab.timestamps.length - 1];
        if (lastTimestamp && typeof lastTimestamp === 'string') {
          const [hours, minutes, seconds] = lastTimestamp.split(':').map(Number);
          return sum + (hours * 60) + minutes + (seconds / 60);
        }
      }
      return sum + 60; // 기본값 60분
    }, 0);
    return Math.round(totalMinutes);
  };

  const calculateTranscriptionPrice = () => {
    const totalMinutes = calculateTotalDuration();
    // 기본 가격: 1분당 1,500원
    return totalMinutes * 1500;
  };

  const getSelectedOptionText = () => {
    // 선택된 최종본 옵션에 따른 텍스트
    switch (selectedFinalOption) {
      case 'file':
        return '파일';
      case 'file_usb':
        return '파일+등기우편';
      case 'file_usb_post':
        return '파일+등기우편+USB';
      default:
        return '파일';
    }
  };

  const getSelectedOptionPrice = () => {
    // 선택된 최종본 옵션에 따른 가격
    switch (selectedFinalOption) {
      case 'file':
        return 0;
      case 'file_usb':
        return 5000;
      case 'file_usb_post':
        return 10000;
      default:
        return 0;
    }
  };

  const calculateTotalPrice = () => {
    return calculateTranscriptionPrice() + getSelectedOptionPrice();
  };

  return showComplete ? (
    <div className="flex flex-col min-h-screen" style={{
      backgroundColor: '#cad5e5',
      backgroundImage: 'url(/new_goStenographe_resource/backgrounds/Background-Blue20-s.png)',
      backgroundPosition: '0 0',
      backgroundSize: 'auto'
    }}>
      <ApplyGNB />
      <div className="pt-20"></div>
      <section className="c-apply-section">
        <div className="c-apply-container">
          {/* 서비스 신청 제목 */}
          <div className="text-center mb-0">
            <h1 className="c-section-heading text-[2.49rem] font-medium text-gray-900 max-w-[600px] mx-auto leading-[120%]">
              서비스 신청
            </h1>
          </div>

          {/* 진행 단계 */}
          <div className="c-step-component">
            <div className="c-steps-grid max-w-[800px] mx-auto relative" style={{ gap: '4rem' }}>
              <div className="c-steps-item">
                <div className="c-steps-dot">
                  <div className="c-steps-dot-inner"></div>
                </div>
                <h3 className="c-step-title" style={{color: '#6b7280'}}>신청서 작성</h3>
                <p className="c-steps-sub-title" style={{color: '#6b7280'}}>파일과 정보를<br/>입력해 주세요.</p>
              </div>
              
              <div className="c-steps-line" style={{ width: '320px' }}>
                <div className="c-steps-line-dot"></div>
              </div>
              
              <div className="c-steps-item">
                <div className="c-steps-dot current">
                  <div className="c-steps-dot-inner current"></div>
                </div>
                <h3 className="c-step-title">제출 완료</h3>
                <p className="c-steps-sub-title">신청 정보를<br/>확인해 주세요.</p>
              </div>
            </div>
          </div>

          {/* 완료 메시지 */}
          <div className="w-layout-vflex flex-block-14" style={{marginTop: '2rem'}}>
            <div className="c-finito-subtitle-block text-center" style={{marginBottom: '2rem'}}>
              <h2 className="c-heading-4 centered" style={{fontSize: '1.75rem', fontWeight: 'normal', lineHeight: '1.2', marginBottom: '0.5rem'}}>
                감사합니다. 정상 접수되었습니다.<br/>
                <span className="text-span" style={{color: '#1c58af'}}><strong>작업 가능 여부 확인 후</strong></span>
                <strong> 비용 안내드리겠습니다.</strong>
              </h2>
              <p className="c-finito-subtitle-pharagraph" style={{color: '#ef4444', fontSize: '1rem', marginTop: '0.5rem'}}>
                * 작업 순서에 따라 안내가 지연될 수 있습니다.
              </p>
            </div>

            <div className="w-layout-vflex c-app-info-block">
              {/* 예상 견적 */}
              <div style={{
                backgroundColor: '#1c58af',
                borderRadius: '20px',
                padding: '2rem 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '90%',
                margin: '0 auto 2rem auto'
              }}>
                <h2 style={{color: 'white', fontSize: '1.5rem', fontWeight: 'bold', margin: '0'}}>예상 견적</h2>
                <h2 style={{color: 'white', fontSize: '1.5rem', fontWeight: 'bold', margin: '0'}}>{calculateTotalPrice().toLocaleString()}원</h2>
              </div>

              {/* 서비스 신청 내역 */}
              <div className="w-layout-vflex application-info-container" style={{marginBottom: '2rem', width: '90%', margin: '0 auto 2rem auto'}}>
                <div className="c-app-info-title-block" style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                  <h2 className="c-app-info-heading" style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937'}}>서비스 신청 내역</h2>
                </div>
                <div className="container small-container" style={{maxWidth: '1000px', margin: '0 auto'}}>
                  <div className="flex-vertical">
                    {tabs.map((tab, index) => (
                      <details key={index} className="accordion blue" style={{
                        backgroundColor: 'white',
                        border: '1px solid #d1d5db',
                        borderRadius: '10px',
                        marginBottom: '1rem',
                        overflow: 'hidden'
                      }} open={openAccordionIndex === index}>
                        <summary className="c-accordion-title" style={{
                          backgroundColor: openAccordionIndex === index ? '#edead9' : '#f3f4f6',
                          padding: '1rem 1.5rem',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontWeight: 'bold',
                          fontSize: '1.1rem'
                        }} onClick={(e) => {
                          e.preventDefault();
                          const newIndex = openAccordionIndex === index ? null : index;
                          setOpenAccordionIndex(newIndex);
                        }}>
                          파일 {index + 1}
                          <span style={{
                            fontSize: '0.8rem',
                            color: '#6b7280',
                            transition: 'transform 0.2s'
                          }}>▼</span>
                        </summary>
                        <div className="c-accordion-content-box" style={{padding: '1.5rem'}}>
                          <div className="w-layout-grid c-order-info-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 2fr',
                            gap: '0.75rem',
                            alignItems: 'start'
                          }}>
                            <div className="c-app-info-grid-title-block">
                              <div className="c-app-info-grid-title" style={{fontWeight: 'bold', color: '#374151'}}>첨부 파일</div>
                            </div>
                            <div className="c-app-info-grid-contents-block">
                              <div className="c-app-info-grid-contents">{tab.files.map(f => f.file.name).join(', ') || '파일 없음'}</div>
                            </div>
                            
                            <div className="c-app-info-grid-title-block grey" style={{backgroundColor: '#f4f6f9', padding: '0.5rem'}}>
                              <div className="c-app-info-grid-title" style={{fontWeight: 'bold', color: '#374151'}}>녹취 종류</div>
                            </div>
                            <div className="c-app-info-grid-contents-block grey" style={{backgroundColor: '#f4f6f9', padding: '0.5rem'}}>
                              <div className="c-app-info-grid-contents">{tab.recordType} 녹취</div>
                            </div>
                            
                            <div className="c-app-info-grid-title-block">
                              <div className="c-app-info-grid-title" style={{fontWeight: 'bold', color: '#374151'}}>화자 정보</div>
                            </div>
                            <div className="c-app-info-grid-contents-block">
                              <div className="c-app-info-grid-contents">총 {tab.speakerCount}명 ({tab.speakerNames.join(', ')})</div>
                            </div>
                            
                            <div className="c-app-info-grid-title-block grey" style={{backgroundColor: '#f4f6f9', padding: '0.5rem'}}>
                              <div className="c-app-info-grid-title" style={{fontWeight: 'bold', color: '#374151'}}>녹음 일시</div>
                            </div>
                            <div className="c-app-info-grid-contents-block grey" style={{backgroundColor: '#f4f6f9', padding: '0.5rem'}}>
                              <div className="c-app-info-grid-contents">{tab.recordingDate || '미입력'} {tab.recordingTime || ''}</div>
                            </div>
                            
                            <div className="c-app-info-grid-title-block">
                              <div className="c-app-info-grid-title" style={{fontWeight: 'bold', color: '#374151'}}>상세 정보</div>
                            </div>
                            <div className="c-app-info-grid-contents-block">
                              <div className="c-app-info-grid-contents">{tab.detail || '없음'}</div>
                            </div>
                            
                            <div className="c-app-info-grid-title-block grey" style={{backgroundColor: '#f4f6f9', padding: '0.5rem'}}>
                              <div className="c-app-info-grid-title" style={{fontWeight: 'bold', color: '#374151'}}>열람 파일 형식</div>
                            </div>
                            <div className="c-app-info-grid-contents-block grey" style={{backgroundColor: '#f4f6f9', padding: '0.5rem'}}>
                              <div className="c-app-info-grid-contents">
                                {selectedFileFormat === 'hwp' ? '한글 (.hwp)' : 
                                 selectedFileFormat === 'docx' ? '워드 (.docx)' : '텍스트 (.txt)'}
                              </div>
                            </div>
                            
                            <div className="c-app-info-grid-title-block">
                              <div className="c-app-info-grid-title" style={{fontWeight: 'bold', color: '#374151'}}>최종본 옵션</div>
                            </div>
                            <div className="c-app-info-grid-contents-block">
                              <div className="c-app-info-grid-contents">{getSelectedOptionText()} {getSelectedOptionPrice() > 0 && `(+${getSelectedOptionPrice().toLocaleString()}원)`}</div>
                            </div>
                          </div>
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              </div>

              {/* 주문자 정보 */}
              <div className="w-layout-vflex application-info-container" style={{width: '90%', margin: '0 auto'}}>
                <div className="c-app-info-title-block" style={{textAlign: 'center', marginBottom: '1.5rem'}}>
                  <h2 className="c-app-info-heading" style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937'}}>주문자 정보</h2>
                </div>
                <div className="container small-container" style={{maxWidth: '1000px', margin: '0 auto'}}>
                  <div className="w-layout-grid c-client-info-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: '0.75rem',
                    backgroundColor: 'white',
                    border: '1px solid #d1d5db',
                    borderRadius: '10px',
                    padding: '1.5rem'
                  }}>
                    <div className="c-app-info-grid-title-block">
                      <div className="c-app-info-grid-title" style={{fontWeight: 'bold', color: '#374151'}}>성함</div>
                    </div>
                    <div className="c-app-info-grid-contents-block">
                      <div className="c-app-info-grid-contents">{customerName || '미입력'}</div>
                    </div>
                    
                    <div className="c-app-info-grid-title-block grey" style={{backgroundColor: '#f4f6f9', padding: '0.5rem'}}>
                      <div className="c-app-info-grid-title" style={{fontWeight: 'bold', color: '#374151'}}>연락처</div>
                    </div>
                    <div className="c-app-info-grid-contents-block grey" style={{backgroundColor: '#f4f6f9', padding: '0.5rem'}}>
                      <div className="c-app-info-grid-contents">{customerPhone || '미입력'}</div>
                    </div>
                    
                    <div className="c-app-info-grid-title-block">
                      <div className="c-app-info-grid-title" style={{fontWeight: 'bold', color: '#374151'}}>이메일</div>
                    </div>
                    <div className="c-app-info-grid-contents-block">
                      <div className="c-app-info-grid-contents">{customerEmail || '미입력'}</div>
                    </div>
                    
                    <div className="c-app-info-grid-title-block grey" style={{backgroundColor: '#f4f6f9', padding: '0.5rem'}}>
                      <div className="c-app-info-grid-title" style={{fontWeight: 'bold', color: '#374151'}}>주소</div>
                    </div>
                    <div className="c-app-info-grid-contents-block grey" style={{backgroundColor: '#f4f6f9', padding: '0.5rem'}}>
                      <div className="c-app-info-grid-contents">{customerAddress || '미입력'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 새 신청하기 버튼 */}
          <div style={{textAlign: 'center', marginTop: '3rem'}}>
            <button 
              onClick={handleNewRequest}
              style={{
                backgroundColor: '#1c58af',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '10px',
                border: 'none',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#164a94';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#1c58af';
              }}
            >
              새 신청하기
            </button>
          </div>
        </div>
      </section>
      <NewFooter />
    </div>
  ) : (
    <div className="flex flex-col min-h-screen" style={{
      backgroundColor: '#cad5e5',
      backgroundImage: 'url(/new_goStenographe_resource/backgrounds/Background-Blue20-s.png)',
      backgroundPosition: '0 0',
      backgroundSize: 'auto'
    }}>
      <ApplyGNB />
      <div className="pt-20"></div> {/* GNB 높이만큼 상단 여백 추가 */}
      <section className="c-apply-section">
        <div className="c-apply-container">
          {/* 서비스 신청 제목 */}
          <div className="text-center mb-0">
            <h1 className="c-section-heading text-[2.49rem] font-medium text-gray-900 max-w-[600px] mx-auto leading-[120%]">
              서비스 신청
            </h1>
          </div>

          {/* 진행 단계 */}
          <div className="c-step-component">
            <Stepper step={1} />
          </div>

          {/* 탭 컨테이너 */}
          <div className="c-tab-container w-tabs">
            {/* 탭 헤더 - 탭 메뉴와 삭제 버튼을 감싸는 컨테이너 */}
            <div className="c-tab-header">
              <div className="c-tab-menu w-tab-menu">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    className={`c-file-tab-button-${index === 0 ? 'left' : index === tabs.length - 1 ? 'right' : 'mid'} w-inline-block w-tab-link ${activeTab === index ? 'w--current' : ''}`}
                    onClick={() => setActiveTab(index)}
                  >
                    <div className="c-tab-button-text">파일 {index + 1}</div>
                    <div className="c-tab-button-text-mobile">{index + 1}</div>
                  </button>
                ))}
                
                {tabs.length < 5 && (
                  <button
                    className="c-file-tab-button-right w-inline-block w-tab-link"
                    onClick={handleAddTab}
                  >
                    <div className="c-tab-button-text">+</div>
                    <div className="c-tab-button-text-mobile">+</div>
                  </button>
                )}
              </div>
              
              {/* 삭제 버튼 - 맨 우측에 고정 배치 */}
              <div className="c-delete-button-container">
                <button
                  className="c-delete-button w-inline-block"
                  onClick={() => handleRemoveTab(activeTab)}
                >
                  <div className="text-block-2">삭제</div>
                </button>
              </div>
            </div>

            <div className="c-tab-content w-tab-content">
              {tabs.map((tab, index) => (
                <div key={index} className={`c-file-tab-pane w-tab-pane ${index === activeTab ? 'w--tab-active' : ''}`}>
                  <div className="w-layout-vflex file-tab-container" style={{
                    backgroundColor: 'white',
                    borderBottomRightRadius: '20px',
                    borderBottomLeftRadius: '20px',
                    padding: '0 2rem 1rem'
                  }}>
                    <div className="c-file-title-block">
                      <h2 className="c-file-heading">유의사항</h2>
                      <p className="c-paragraph-title">- 음성 파일의 녹음 상태로 인해 신청이 반려될 수 있습니다.<br/>- 작업 순서에 따라 안내가 지연될 수 있습니다.<br/>- 작업 과정에서 추가 화자가 확인되는 경우 등 화자수에 따라 추가 요금이 청구될 수 있습니다.<br/>- 상단 더하기(+) 버튼을 눌러 최대 5개의 파일을 한 번에 등록할 수 있습니다.</p>
                    </div>
                    
                    <div className="c-file-title-block">
                      <h2 className="c-file-heading">파일 정보</h2>
                    </div>
                    
                    <div className="c-file-block" style={{
                      backgroundColor: '#f4f6f9',
                      borderRadius: '20px',
                      padding: '2rem'
                    }}>
                      <div className="w-layout-hflex c-file-block-title">
                        <h2 className="c-file-block-heading">파일 업로드</h2>
                        <div className="c-file-block-title-tag" style={{
                          border: '1px solid #fee9d4',
                          backgroundColor: '#faa654',
                          borderRadius: '10px',
                          padding: '2px 8px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                          <div className="c-tag-text" style={{
                            color: 'white',
                            fontFamily: 'Pretendard',
                            fontSize: '14px'
                          }}>필수</div>
                        </div>
                      </div>
                      <p className="c-paragraph-caution">* 첨부 가능한 파일 형식<br/>- 영상 : mp3, wav, m4a, cda, mod, ogg, wma, flac, asf<br/>- 음성 : avi, mp4, asf, wmv, m2v, mpeg, dpg, mts, webm, divx, amv</p>
                      <div className="link-block w-inline-block">
                        <FileUploadSection
                          formData={tab as any}
                          setFormData={(data) => {
                            const newTabs = [...tabs];
                            newTabs[index] = { ...tab, ...data };
                            setTabs(newTabs);
                          }}
                          onFileSelect={handleFileSelect}
                        />
                      </div>
                    </div>
                    
                    <div className="c-file-block" style={{
                      backgroundColor: '#f4f6f9',
                      borderRadius: '20px',
                      padding: tab.recordType === '부분' ? '2rem 2rem 0.125rem 2rem' : '2rem'
                    }}>
                      <div className="w-layout-hflex c-file-block-title between">
                        <div className="w-layout-hflex flex-block-9">
                          <h2 className="c-file-block-heading">녹취 종류</h2>
                          <div className="c-file-block-title-tag" style={{
                            border: '1px solid #fee9d4',
                            backgroundColor: '#faa654',
                            borderRadius: '10px',
                            padding: '2px 8px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}>
                            <div className="c-tag-text" style={{
                              color: 'white',
                              fontFamily: 'Pretendard',
                              fontSize: '14px'
                            }}>필수</div>
                          </div>
                        </div>
                        <div className="w-layout-hflex c-type-static-wrapper">
                          <h2 className="c-file-block-heading light">속기 구간 길이</h2>
                          <h2 className="c-file-block-heading highlight">
                            {(() => {
                              // Calculate total duration from timestampRanges if available
                              if (tab.timestampRanges && tab.timestampRanges.length > 0) {
                                const { calculateTotalDuration } = require('@/utils/timestampUtils');
                                const totalDuration = calculateTotalDuration(tab.timestampRanges);
                                const [hours, minutes, seconds] = totalDuration.split(':');
                                return `${hours}시간 ${minutes}분 ${seconds}초`;
                              }
                              return '00시간 00분 00초';
                            })()}
                          </h2>
                        </div>
                      </div>
                      
                      <RequestInfoSection
                        formData={tab as any}
                        setFormData={(data) => {
                          const newTabs = [...tabs];
                          newTabs[index] = { ...tab, ...data };
                          setTabs(newTabs);
                        }}
                      />
                    </div>
                    
                    <div className="c-file-block" style={{
                      backgroundColor: '#f4f6f9',
                      borderRadius: '20px',
                      padding: '2rem'
                    }}>
                      <div className="w-layout-hflex c-file-block-title between">
                        <div className="w-layout-hflex flex-block-9">
                          <h2 className="c-file-block-heading">화자 정보</h2>
                          <div className="c-file-block-title-tag" style={{
                            border: '1px solid #fee9d4',
                            backgroundColor: '#faa654',
                            borderRadius: '10px',
                            padding: '2px 8px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                          }}>
                            <div className="c-tag-text" style={{
                              color: 'white',
                              fontFamily: 'Pretendard',
                              fontSize: '14px'
                            }}>필수</div>
                          </div>
                        </div>
                        <div className="w-layout-hflex c-type-static-wrapper">
                          <h2 className="c-file-block-heading light">총 화자수</h2>
                          <h2 className="c-file-block-heading highlight">{tab.speakerCount}명</h2>
                        </div>
                      </div>
                      
                      <OrdererInfoSection
                        formData={tab as any}
                        setFormData={(data) => {
                          const newTabs = [...tabs];
                          newTabs[index] = { ...tab, ...data };
                          setTabs(newTabs);
                        }}
                      />
                    </div>
                    
                    {/* 녹음 일시 섹션 */}
                    <div className="c-file-block" style={{
                      backgroundColor: '#f4f6f9',
                      borderRadius: '20px',
                      padding: '2rem'
                    }}>
                      <div className="w-layout-hflex c-file-block-title">
                        <h2 className="c-file-block-heading">녹음 일시</h2>
                      </div>
                      
                      <div className="c-datetime-container" style={{
                        backgroundColor: '#f4f6f9',
                        borderRadius: '10px',
                        padding: '2rem',
                        marginTop: '0.5rem',
                        width: 'calc(100% + 4rem)',
                        marginLeft: '-2rem',
                        marginRight: '-2rem'
                      }}>
                        <div className="c-datetime-block">
                          <div className="div-w-layout-vflex c-datetime-table-wrapper" style={{
                            border: '1px solid #d1d5db',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            backgroundColor: 'white',
                            width: '100%',
                            maxWidth: 'none',
                            marginLeft: '0',
                            marginRight: '0'
                          }}>
                            {/* Content Section */}
                            <div className="c-datetime-content" style={{
                              padding: '1.5rem'
                            }}>
                              <div style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr 1fr',
                                alignItems: 'center',
                                gap: '1rem'
                              }}>
                                <div style={{ position: 'relative' }}>
                                  <input
                                    type="date"
                                    value={tab.recordingDate || ''}
                                    onChange={(e) => {
                                      const newTabs = [...tabs];
                                      newTabs[index] = { ...tab, recordingDate: e.target.value };
                                      setTabs(newTabs);
                                    }}
                                    disabled={tab.recordingUnsure}
                                    style={{
                                      width: '100%',
                                      padding: '12px 16px',
                                      border: '1px solid #d1d5db',
                                      borderRadius: '8px',
                                      fontSize: '14px',
                                      backgroundColor: tab.recordingUnsure ? '#f3f4f6' : 'white',
                                      outline: 'none',
                                      cursor: tab.recordingUnsure ? 'not-allowed' : 'pointer',
                                      opacity: 0,
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      zIndex: 1
                                    }}
                                    onFocus={(e) => {
                                      if (!tab.recordingUnsure) {
                                        e.target.showPicker?.();
                                      }
                                    }}
                                  />
                                  <div style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    backgroundColor: tab.recordingUnsure ? '#f3f4f6' : 'white',
                                    color: tab.recordingDate ? '#111827' : '#9ca3af',
                                    cursor: tab.recordingUnsure ? 'not-allowed' : 'pointer',
                                    opacity: tab.recordingUnsure ? 0.5 : 1,
                                    position: 'relative',
                                    textAlign: 'left'
                                  }}>
                                    {tab.recordingDate || '날짜 선택'}
                                  </div>
                                </div>
                                <div style={{ position: 'relative' }}>
                                  <input
                                    type="time"
                                    value={tab.recordingTime || ''}
                                    onChange={(e) => {
                                      const newTabs = [...tabs];
                                      newTabs[index] = { ...tab, recordingTime: e.target.value };
                                      setTabs(newTabs);
                                    }}
                                    disabled={tab.recordingUnsure}
                                    min="00:00"
                                    max="23:59"
                                    style={{
                                      width: '100%',
                                      padding: '12px 16px',
                                      border: '1px solid #d1d5db',
                                      borderRadius: '8px',
                                      fontSize: '14px',
                                      backgroundColor: tab.recordingUnsure ? '#f3f4f6' : 'white',
                                      outline: 'none',
                                      cursor: tab.recordingUnsure ? 'not-allowed' : 'pointer',
                                      opacity: 0,
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                      zIndex: 1
                                    }}
                                    onFocus={(e) => {
                                      if (!tab.recordingUnsure) {
                                        e.target.showPicker?.();
                                      }
                                    }}
                                  />
                                  <div style={{
                                    width: '100%',
                                    padding: '12px 16px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    backgroundColor: tab.recordingUnsure ? '#f3f4f6' : 'white',
                                    color: tab.recordingTime ? '#111827' : '#9ca3af',
                                    cursor: tab.recordingUnsure ? 'not-allowed' : 'pointer',
                                    opacity: tab.recordingUnsure ? 0.5 : 1,
                                    position: 'relative',
                                    textAlign: 'left'
                                  }}>
                                    {tab.recordingTime || '시간 선택'}
                                  </div>
                                </div>
                                <div>
                                  <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    cursor: 'pointer',
                                    justifyContent: 'center'
                                  }}>
                                    <input
                                      type="checkbox"
                                      checked={tab.recordingUnsure || false}
                                      onChange={(e) => {
                                        const newTabs = [...tabs];
                                        if (e.target.checked) {
                                          newTabs[index] = { 
                                            ...tab, 
                                            recordingUnsure: true,
                                            recordingDate: '',
                                            recordingTime: ''
                                          };
                                        } else {
                                          newTabs[index] = { ...tab, recordingUnsure: false };
                                        }
                                        setTabs(newTabs);
                                      }}
                                      style={{
                                        width: '16px',
                                        height: '16px',
                                        accentColor: '#3b82f6'
                                      }}
                                    />
                                    <span style={{
                                      fontSize: '14px',
                                      color: '#374151'
                                    }}>
                                      잘 모르겠어요
                                    </span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* 상세 정보 섹션 */}
                    <div className="c-file-block" style={{
                      backgroundColor: '#f4f6f9',
                      borderRadius: '20px',
                      padding: '2rem'
                    }}>
                      <div className="w-layout-hflex c-file-block-title">
                        <h2 className="c-file-block-heading">상세 정보</h2>
                      </div>
                      
                      <div className="c-detail-container" style={{
                        backgroundColor: '#f4f6f9',
                        borderRadius: '10px',
                        padding: '2rem',
                        marginTop: '0.5rem',
                        width: 'calc(100% + 4rem)',
                        marginLeft: '-2rem',
                        marginRight: '-2rem'
                      }}>
                        <div className="c-detail-block">
                          <div className="div-w-layout-vflex c-detail-table-wrapper" style={{
                            border: '1px solid #d1d5db',
                            borderRadius: '10px',
                            overflow: 'hidden',
                            backgroundColor: 'white',
                            width: '100%',
                            maxWidth: 'none',
                            marginLeft: '0',
                            marginRight: '0'
                          }}>
                            {/* Header Section */}
                            <div className="c-detail-header" style={{
                              backgroundColor: '#cad5e5',
                              padding: '1rem 1.5rem',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '0.25rem'
                            }}>
                              <div className="c-file-block-heading" style={{
                                textAlign: 'left',
                                margin: '0',
                                fontSize: '14px',
                                fontWeight: 'normal'
                              }}>
                                추가 정보 (선택 사항)
                              </div>
                              <p className="c-paragraph-caution" style={{
                                margin: '0',
                                fontSize: '14px',
                                color: '#3b82f6',
                                textAlign: 'left'
                              }}>
                                • 업무 진행에 도움이 될 수 있는 정보가 있다면 입력해 주세요.
                              </p>
                            </div>
                            
                            {/* Content Section */}
                            <div className="c-detail-content" style={{
                              padding: '1.5rem'
                            }}>
                              <div style={{ position: 'relative' }}>
                                <textarea
                                  value={tab.detail || ''}
                                  onChange={(e) => {
                                    if (e.target.value.length <= 100) {
                                      const newTabs = [...tabs];
                                      newTabs[index] = { ...tab, detail: e.target.value };
                                      setTabs(newTabs);
                                    }
                                  }}
                                  placeholder="예: 회의 주제, 특수한 용어, 화자 특징 등"
                                  style={{
                                    width: '100%',
                                    minHeight: '120px',
                                    padding: '12px 16px',
                                    border: '1px solid #d1d5db',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    backgroundColor: 'white',
                                    outline: 'none',
                                    resize: 'vertical',
                                    fontFamily: 'inherit'
                                  }}
                                />
                                
                                {/* Character counter */}
                                <div style={{
                                  position: 'absolute',
                                  bottom: '8px',
                                  right: '16px',
                                  fontSize: '12px',
                                  color: '#6b7280',
                                  backgroundColor: 'white',
                                  padding: '2px 4px',
                                  borderRadius: '3px'
                                }}>
                                  {(tab.detail || '').length}/100
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 주문 정보 섹션 - 탭 컨테이너와 분리 */}
          <div className="personal-info-container w-layout-vflex" style={{
            backgroundColor: '#ece8d7',
            backgroundImage: 'url(/new_goStenographe_resource/backgrounds/Background-Beige.png)',
            backgroundPosition: '0 0',
            backgroundSize: 'auto',
            borderRadius: '20px',
            padding: '2rem 2rem 1rem',
            marginTop: '0.25rem'
          }}>
            <div className="c-file-title-block">
              <h2 className="c-file-heading">주문 정보</h2>
            </div>
            
            <div className="c-file-block">
              <div className="w-layout-hflex c-file-block-title">
                <h2 className="c-file-block-heading">열람 파일 형식</h2>
                <div className="c-file-block-title-tag" style={{
                  border: '1px solid #fee9d4',
                  backgroundColor: '#faa654',
                  borderRadius: '10px',
                  padding: '2px 8px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <div className="c-tag-text" style={{
                    color: 'white',
                    fontFamily: 'Pretendard',
                    fontSize: '14px'
                  }}>필수</div>
                </div>
              </div>
              <p className="c-paragraph-caution" style={{marginTop: '0.5rem', marginBottom: '1.25rem', fontSize: '1rem'}}>열람하기 편한 파일 형식을 선택해 주세요. <br/>완성된 속기록을 고객님 메일로 발송해 드립니다.</p>
              <div className="w-form">
                <div className="c-apply-form">
                  <label className="radio-button-field w-radio" style={{fontSize: '1rem'}}>
                    <input type="radio" name="file-format" value="hwp" checked={selectedFileFormat === 'hwp'} onChange={(e) => setSelectedFileFormat(e.target.value)} className="w-form-formradioinput w-radio-input" />
                    <span className="radio-button-label w-form-label" style={{fontSize: '1rem'}}>한글(.hwp)</span>
                  </label>
                  <label className="radio-button-field w-radio" style={{fontSize: '1rem'}}>
                    <input type="radio" name="file-format" value="docx" checked={selectedFileFormat === 'docx'} onChange={(e) => setSelectedFileFormat(e.target.value)} className="w-form-formradioinput w-radio-input" />
                    <span className="w-form-label" style={{fontSize: '1rem'}}>워드(.docx)</span>
                  </label>
                  <label className="radio-button-field w-radio" style={{fontSize: '1rem'}}>
                    <input type="radio" name="file-format" value="txt" checked={selectedFileFormat === 'txt'} onChange={(e) => setSelectedFileFormat(e.target.value)} className="w-form-formradioinput w-radio-input" />
                    <span className="w-form-label" style={{fontSize: '1rem'}}>텍스트(.txt)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="c-file-block">
              <div className="w-layout-hflex c-file-block-title">
                <h2 className="c-file-block-heading">최종본 옵션</h2>
                <div className="c-file-block-title-tag" style={{
                  border: '1px solid #fee9d4',
                  backgroundColor: '#faa654',
                  borderRadius: '10px',
                  padding: '2px 8px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <div className="c-tag-text" style={{
                    color: 'white',
                    fontFamily: 'Pretendard',
                    fontSize: '14px'
                  }}>필수</div>
                </div>
              </div>
              <div className="w-form">
                <div className="c-apply-form vertical">
                  <label className="radio-button-field w-radio" style={{fontSize: '1rem'}}>
                    <input type="radio" name="final-option" value="file" checked={selectedFinalOption === 'file'} onChange={(e) => setSelectedFinalOption(e.target.value)} className="w-form-formradioinput w-radio-input" />
                    <span className="radio-button-label w-form-label" style={{fontSize: '1rem'}}>파일</span>
                  </label>
                  <label className="radio-button-field w-radio" style={{fontSize: '1rem'}}>
                    <input type="radio" name="final-option" value="file_usb" checked={selectedFinalOption === 'file_usb'} onChange={(e) => setSelectedFinalOption(e.target.value)} className="w-form-formradioinput w-radio-input" />
                    <span className="w-form-label" style={{fontSize: '1rem'}}>파일 +등기 우편 (+5,000원)</span>
                  </label>
                  <label className="radio-button-field w-radio" style={{fontSize: '1rem'}}>
                    <input type="radio" name="final-option" value="file_usb_post" checked={selectedFinalOption === 'file_usb_post'} onChange={(e) => setSelectedFinalOption(e.target.value)} className="w-form-formradioinput w-radio-input" />
                    <span className="w-form-label" style={{fontSize: '1rem'}}>파일 +등기 우편 +USB (+10,000원)</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="c-personal-info-block">
              <div className="w-layout-hflex c-file-block-title">
                <h2 className="c-file-block-heading">주문자 정보</h2>
                <div className="c-file-block-title-tag" style={{
                  border: '1px solid #fee9d4',
                  backgroundColor: '#faa654',
                  borderRadius: '10px',
                  padding: '2px 8px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <div className="c-tag-text" style={{
                    color: 'white',
                    fontFamily: 'Pretendard',
                    fontSize: '14px'
                  }}>필수</div>
                </div>
              </div>
              <div className="form-block w-form">
                <div className="c-apply-form vertical" style={{gap: '0.25rem'}}>
                  <input className="c-text-input-field w-input" maxLength={256} name="customer-name" placeholder="신청인 성함" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
                  <input className="c-text-input-field w-input" maxLength={256} name="customer-phone" placeholder="연락처 (000-0000-0000)" type="text" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} required />
                  <input className="c-text-input-field w-input" maxLength={256} name="customer-email" placeholder="이메일 (example@email.com)" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required />
                  <input className="c-text-input-field w-input" maxLength={256} name="customer-address" placeholder="주소 (최종본 수령지)" type="text" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} required />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
      
      {/* 견적 섹션과 겹치지 않도록 하단 여백 추가 */}
      <div className="pb-32"></div>
      
      {/* 예상 견적란 - 웹플로우와 동일한 구조 */}
      <section className="c-checkout-section">
        <div className="w-layout-hflex c-checkout-container">
          <div className="w-layout-vflex c-checkout-left">
            <div className="w-layout-hflex c-sum-block-title between">
              <h2 className="c-app-sum-heading">예상 견적</h2>
              <h2 className="c-app-sum-heading">{calculateTotalPrice().toLocaleString()}원</h2>
            </div>
            <div className="div-block-11"></div>
            <div className="w-layout-vflex flex-block-11">
              <div className="w-layout-hflex c-checkout-factor">
                <h6 className="c-checkout-f-text">- 속기록 제작 (60분)</h6>
                <h6 className="c-checkout-f-text">{calculateTranscriptionPrice().toLocaleString()}원</h6>
              </div>
              <div className="w-layout-hflex c-checkout-factor">
                <h6 className="c-checkout-f-text">- 최종본: {getSelectedOptionText()}</h6>
                <h6 className="c-checkout-f-text">{getSelectedOptionPrice().toLocaleString()}원</h6>
              </div>
            </div>
          </div>
          <div className="w-layout-vflex c-checkout-right">
            <div className="w-layout-hflex flex-block-12">
              <label style={{display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer'}}>
                <input 
                  type="checkbox" 
                  checked={agree} 
                  onChange={(e) => setAgree(e.target.checked)}
                  style={{width: '16px', height: '16px', accentColor: '#3b82f6'}}
                />
                <h6 className="c-checkout-agreement-text">주문 내용, 서비스 이용약관 및 개인정보처리방침을 확인 했으며, 정보 제공에 동의합니다.</h6>
              </label>
            </div>
            <button onClick={handleSubmit} className="c-button-checkout w-button" disabled={!agree} style={{opacity: agree ? 1 : 0.5, cursor: agree ? 'pointer' : 'not-allowed'}}>접수 완료하기</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Page() {
  return <Reception />;
}
