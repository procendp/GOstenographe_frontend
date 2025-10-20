'use client';

import ApplyGNB from '@/components/ApplyGNB';
import NewFooter from '@/components/NewFooter';
import { useState, useRef, useEffect } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import OrdererInfoSection from '@/components/OrdererInfoSection';
import RequestInfoSection from '@/components/RequestInfoSection';
import FileUploadSection from '@/components/FileUploadSection';
import RecordingLocationSection from '@/components/RecordingLocationSection';
import { ReceptionFormData } from '@/types/reception';
import { uploadMultipleFiles } from '@/utils/fileUpload';
import { getMediaDuration } from '@/utils/mediaDuration';

// API 기본 URL
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

function Reception() {
  // 기본 상태들
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [tabs, setTabs] = useState([
    {
      files: [] as Array<{file: File, file_key: string}>,
      speakerNames: [''],
      selectedDates: [] as string[],
      detail: '',
      speakerCount: 1,
      timestamps: [] as string[],
      timestampRanges: [] as any[],
      recordType: '전체' as '전체' | '부분',
      recordingLocation: '통화' as '통화' | '현장',
      recordingDate: '',
      recordingTime: '',
      recordingUnsure: false,
      fileDuration: '00:00:00'
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
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'idle' | 'uploading' | 'success' | 'error'>>({});

  // beforeunload 이벤트 - 새로고침/브라우저 닫기 경고 및 파일 삭제
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // 제출 완료 후에는 경고 안함
      if (showComplete) return;
      
      // 업로드된 파일이 있는지 확인
      const hasFiles = tabs.some(tab => 
        tab.files && tab.files.length > 0 && 
        tab.files.some(f => f.file_key && f.file_key !== 'uploading')
      );

      if (hasFiles) {
        // 파일 삭제 실행 (sendBeacon 사용)
        handlePageExit();
        
        e.preventDefault();
        e.returnValue = '업로드된 파일이 있습니다. 페이지를 나가시면 파일이 삭제됩니다.';
        return '업로드된 파일이 있습니다. 페이지를 나가시면 파일이 삭제됩니다.';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [tabs, showComplete]);

  // popstate 이벤트 - 브라우저 뒤로가기 버튼 경고
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      // 제출 완료 후에는 경고 안함
      if (showComplete) return;
      
      // 업로드된 파일이 있는지 확인
      const hasFiles = tabs.some(tab => 
        tab.files && tab.files.length > 0 && 
        tab.files.some(f => f.file_key && f.file_key !== 'uploading')
      );

      if (hasFiles) {
        const confirmLeave = window.confirm(
          '업로드된 파일이 있습니다.\n페이지를 나가시면 파일이 삭제됩니다.\n정말 나가시겠습니까?'
        );
        
        if (!confirmLeave) {
          // 사용자가 취소한 경우, 현재 페이지로 다시 푸시
          window.history.pushState(null, '', window.location.href);
        } else {
          // 사용자가 확인한 경우, 파일 삭제 후 실제 뒤로가기
          handleNavigateAway().then(() => {
            // 실제 뒤로가기 실행
            window.history.back();
          });
        }
      }
    };

    // 현재 페이지를 히스토리에 추가 (뒤로가기 감지용) - 한 번만 실행
    if (typeof window !== 'undefined' && !window.history.state) {
      window.history.pushState(null, '', window.location.href);
    }
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [tabs, showComplete]);

  // 기본 함수들
  const handleNewRequest = () => {
    // 페이지 새로고침으로 초기 상태로 돌아가기
    window.location.reload();
  };

  // 업로드된 모든 파일 수집
  const getAllUploadedFiles = () => {
    const allFiles: Array<{ file_key: string; file: File }> = [];
    tabs.forEach(tab => {
      if (tab.files && tab.files.length > 0) {
        tab.files.forEach(f => {
          if (f.file_key && f.file_key !== 'uploading') {
            allFiles.push({ file_key: f.file_key, file: f.file });
          }
        });
      }
    });
    return allFiles;
  };

  // 페이지 이탈 시 파일 삭제 (일반적인 경우)
  const handleNavigateAway = async () => {
    const filesToDelete = getAllUploadedFiles();
    
    if (filesToDelete.length === 0) return;

    console.log('[NAVIGATE_AWAY] 삭제할 파일:', filesToDelete.map(f => f.file_key));

    // S3에서 파일 삭제
    for (const fileData of filesToDelete) {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/api/s3/delete/`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file_key: fileData.file_key })
        });
        
        if (response.ok) {
          console.log('[NAVIGATE_AWAY] 파일 삭제 성공:', fileData.file_key);
        } else {
          console.error('[NAVIGATE_AWAY] 파일 삭제 실패:', fileData.file_key);
        }
      } catch (error) {
        console.error('[NAVIGATE_AWAY] 파일 삭제 오류:', error);
      }
    }
  };

  // 새로고침/브라우저 닫기 시 파일 삭제 (sendBeacon 사용)
  const handlePageExit = () => {
    const filesToDelete = getAllUploadedFiles();
    
    if (filesToDelete.length === 0) return;

    console.log('[PAGE_EXIT] 삭제할 파일:', filesToDelete.map(f => f.file_key));

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    // sendBeacon을 사용하여 파일 삭제 요청
    filesToDelete.forEach(fileData => {
      try {
        const deleteData = JSON.stringify({ file_key: fileData.file_key });
        const blob = new Blob([deleteData], { type: 'application/json' });
        
        const success = navigator.sendBeacon(`${backendUrl}/api/s3/delete/`, blob);
        
        if (success) {
          console.log('[PAGE_EXIT] 파일 삭제 요청 성공:', fileData.file_key);
        } else {
          console.error('[PAGE_EXIT] 파일 삭제 요청 실패:', fileData.file_key);
        }
      } catch (error) {
        console.error('[PAGE_EXIT] 파일 삭제 오류:', error);
      }
    });
  };

  const handleAddTab = () => {
    if (tabs.length >= 5) return;
    setTabs([...tabs, { files: [], speakerNames: [''], selectedDates: [], detail: '', speakerCount: 1, timestamps: [], timestampRanges: [], recordType: '전체', recordingLocation: '통화', recordingDate: '', recordingTime: '', recordingUnsure: false, fileDuration: '00:00:00' }]);
    setActiveTab(tabs.length);
  };

  const handleRemoveTab = async (idx: number) => {
    if (tabs.length === 1) return;
    
    // 삭제할 탭의 파일들 수집
    const tabToRemove = tabs[idx];
    const filesToDelete = tabToRemove.files.filter(f => f.file_key && f.file_key !== 'uploading');
    
    // S3에서 파일 삭제
    if (filesToDelete.length > 0) {
      console.log('[REMOVE_TAB] 삭제할 파일:', filesToDelete.map(f => f.file_key));
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      
      for (const fileData of filesToDelete) {
        try {
          const response = await fetch(`${backendUrl}/api/s3/delete/`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file_key: fileData.file_key })
          });
          
          if (response.ok) {
            console.log('[REMOVE_TAB] 파일 삭제 성공:', fileData.file_key);
          } else {
            console.error('[REMOVE_TAB] 파일 삭제 실패:', fileData.file_key);
          }
        } catch (error) {
          console.error('[REMOVE_TAB] 파일 삭제 오류:', error);
        }
      }
    }
    
    // 탭 제거
    const newTabs = tabs.filter((_, i) => i !== idx);
    setTabs(newTabs);
    
    // 활성 탭 조정
    if (activeTab === idx) {
      setActiveTab(Math.max(0, idx - 1));
    } else if (activeTab > idx) {
      setActiveTab(activeTab - 1);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // 업로드 상태 초기화
    const newUploadStatus: Record<string, 'idle' | 'uploading' | 'success' | 'error'> = {};
    files.forEach(file => {
      newUploadStatus[file.name] = 'uploading';
    });
    setUploadStatus(newUploadStatus);

    // 임시로 파일 정보를 상태에 저장 (업로드 시작 표시)
    setTabs(tabs => tabs.map((tab, idx) =>
      idx === activeTab ? {
        ...tab,
        files: files.map(file => ({file, file_key: 'uploading'}))
      } : tab
    ));

    try {
      // 파일의 duration 추출 (첫 번째 파일만 - 오디오/비디오인 경우)
      let fileDuration = '00:00:00';
      if (files.length > 0) {
        fileDuration = await getMediaDuration(files[0]);
      }

      // 파일들을 S3에 업로드
      const uploadedFiles = await uploadMultipleFiles(
        files,
        customerName,
        customerEmail,
        (fileIndex, progress) => {
          console.log(`파일 ${fileIndex + 1} 업로드 진행률: ${progress}%`);
        }
      );

      // 업로드 완료 후 file_key와 fileDuration 업데이트
      setTabs(tabs => tabs.map((tab, idx) =>
        idx === activeTab ? {
          ...tab,
          files: uploadedFiles.map(({file, fileKey}) => ({file, file_key: fileKey})),
          fileDuration: fileDuration
        } : tab
      ));

      // 업로드 성공 상태 업데이트
      const successStatus: Record<string, 'idle' | 'uploading' | 'success' | 'error'> = {};
      files.forEach(file => {
        successStatus[file.name] = 'success';
      });
      setUploadStatus(successStatus);

      console.log('파일 업로드 완료:', uploadedFiles);
      console.log('파일 재생시간:', fileDuration);

    } catch (error) {
      console.error('파일 업로드 실패:', error);
      
      // 업로드 실패 상태 업데이트
      const errorStatus: Record<string, 'idle' | 'uploading' | 'success' | 'error'> = {};
      files.forEach(file => {
        errorStatus[file.name] = 'error';
      });
      setUploadStatus(errorStatus);

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
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    const lineWidth = isMobile ? '100px' : '350px';
    const gridGap = isMobile ? '4rem' : '7rem';

    return (
      <div className="c-steps-grid max-w-[800px] mx-auto relative" style={{ gap: gridGap }}>
        <div className="c-steps-item">
          <div className={`c-steps-dot ${step >= 1 ? 'current' : ''} ${step >= 2 ? 'completed' : ''}`}>
            <div className={`c-steps-dot-inner ${step >= 1 ? 'current' : ''} ${step >= 2 ? 'completed' : ''}`}></div>
          </div>
          <h3 className={`c-step-title ${step >= 2 ? 'completed' : ''}`}>신청서 작성</h3>
          <p className={`c-steps-sub-title ${step >= 2 ? 'completed' : ''}`}>파일과 정보를<br/>입력해 주세요.</p>
        </div>

        {/* 점선을 절대 위치로 두 원 사이 중앙에 배치 - 반응형 */}
        <div className="c-steps-line" style={{ width: lineWidth }}>
          <div
            className={`c-steps-line-dot ${step >= 2 ? 'ongoing' : ''}`}
          ></div>
        </div>

        <div className="c-steps-item">
          <div className={`c-steps-dot ${step >= 2 ? 'current' : 'inactive'}`}>
            <div className={`c-steps-dot-inner ${step >= 2 ? 'current' : 'inactive'}`}></div>
          </div>
          <h3 className={`c-step-title ${step >= 2 ? '' : 'hold'}`}>제출 완료</h3>
          <p className={`c-steps-sub-title ${step >= 2 ? '' : 'hold'}`}>신청 정보를<br/>확인해 주세요.</p>
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

  // 전화번호 자동 포맷팅 함수
  const formatPhoneNumber = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/[^\d]/g, '');

    // 숫자가 없으면 빈 문자열
    if (!numbers) return '';

    // 길이에 따라 포맷팅
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length <= 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    } else {
      // 11자리 초과: 3-4-나머지
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    }
  };

  // 전화번호 입력 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formatted = formatPhoneNumber(value);
    setCustomerPhone(formatted);

    // 숫자 추출
    const numbers = formatted.replace(/[^\d]/g, '');

    // 실시간 검증
    if (numbers.length > 0 && numbers.length < 10) {
      setPhoneError('전화번호는 10~11자리여야 합니다');
    } else if (numbers.length > 11) {
      setPhoneError('전화번호는 최대 11자리입니다');
    } else {
      setPhoneError('');
    }
  };

  // 이메일 입력 핸들러
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomerEmail(value);

    // 입력 중이 아닐 때만 검증 (blur 상태)
    if (value.length > 0 && e.type === 'blur') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setEmailError('올바른 이메일 형식이 아닙니다');
      } else {
        setEmailError('');
      }
    }
  };

  // 이메일 blur 핸들러
  const handleEmailBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setEmailError('올바른 이메일 형식이 아닙니다');
      } else {
        setEmailError('');
      }
    }
  };

  // 폼 유효성 검사
  const validatePhone = (phone: string) => {
    const numbers = phone.replace(/[^\d]/g, '');
    return numbers.length >= 10 && numbers.length <= 11;
  };
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  const validateAddress = (address: string) => address.trim().length > 0;

  const isFormValid = () => {
    // 주문자 정보 검증 (필수)
    const nameValid = customerName.trim() !== '';
    const phoneValid = validatePhone(customerPhone);
    const emailValid = validateEmail(customerEmail);
    const addressValid = validateAddress(customerAddress);

    // 약관 동의 검증 (필수)
    const agreeValid = agree;

    // 모든 탭에 대해 필수 필드 검증
    const tabsValid = tabs.every(tab => {
      // 1. 파일 업로드 (필수)
      const fileValid = tab.files && tab.files.length > 0 && tab.files.every(f => f.file_key && f.file_key !== 'uploading');

      // 2. 녹취 종류 (필수) - recordType은 항상 '전체' 또는 '부분' 중 하나
      const recordTypeValid = tab.recordType === '전체' || tab.recordType === '부분';

      // 3. 부분 녹취인 경우 timestamp 유효성 검증
      let timestampValid = true;
      if (tab.recordType === '부분') {
        timestampValid = tab.timestampRanges &&
                        tab.timestampRanges.length > 0 &&
                        tab.timestampRanges.every((range: any) => range.isValid !== false);
      }

      // 4. 화자 정보 (필수) - 최소 1명 이상의 화자명 필요
      const speakerValid = tab.speakerNames &&
                          tab.speakerNames.length > 0 &&
                          tab.speakerNames.some((name: string) => name.trim() !== '');

      return fileValid && recordTypeValid && timestampValid && speakerValid;
    });

    // 열람 파일 형식 (필수) - 기본값이 있으므로 항상 true
    const fileFormatValid = selectedFileFormat !== '';

    // 최종본 옵션 (필수) - 기본값이 있으므로 항상 true
    const finalOptionValid = selectedFinalOption !== '';

    return nameValid && phoneValid && emailValid && addressValid &&
           agreeValid && tabsValid && fileFormatValid && finalOptionValid;
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
    
    // 새로운 API 호출 (파일별 Request 생성)
    try {
      const requestData = {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        address: customerAddress,
        draft_format: selectedFileFormat,
        final_option: selectedFinalOption,
        agreement: agree,
        is_temporary: false,
        recording_location: tabs[0]?.recordingLocation === '현장' ? '현장' : '통화',
        estimated_price: calculateTotalPrice(), // 실제 계산된 견적
        files: tabs.map(tab => {
          // timestampRanges에서 duration과 timestamps 계산
          let duration = '00:00:00';
          let timestamps: string[] = [];

          if (tab.recordType === '부분' && tab.timestampRanges && Array.isArray(tab.timestampRanges) && tab.timestampRanges.length > 0) {
            // 부분 녹취: timestampRanges에서 구간들을 추출
            try {
              const { calculateTotalDuration } = require('@/utils/timestampUtils');
              duration = calculateTotalDuration(tab.timestampRanges);
            } catch (error) {
              console.error('[handleSubmit] duration 계산 오류:', error);
              duration = '00:00:00';
            }

            // 각 구간을 timestamps 배열로 변환
            timestamps = tab.timestampRanges.map(range =>
              `${range.startTime || '00:00:00'}-${range.endTime || '00:00:00'}`
            );
          } else if (tab.recordType === '전체') {
            // 전체 녹음: 파일에서 추출한 duration 사용
            duration = tab.fileDuration || '00:00:00';
          }
          
          return {
            recordType: tab.recordType,
            timestamps: timestamps,
            duration: duration,
            speakerCount: tab.speakerCount,
            speakerNames: tab.speakerNames.filter(name => name.trim()),
            detail: tab.detail,
            recordingDate: tab.recordingDate,
            recordingTime: tab.recordingTime,
            file_info: tab.files[0] ? {
              file_key: tab.files[0].file_key,
              original_name: tab.files[0].file.name,
              file_type: tab.files[0].file.type,
              file_size: tab.files[0].file.size,
            } : null
          };
        })
      };

      console.log('새로운 API로 전송할 요청 데이터:', requestData);

      const response = await fetch(`${API_URL}/api/requests/create_order_with_files/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });
      
      console.log('응답 상태:', response.status);

      if (response.ok) {
        const result = await response.json();
        console.log('주문 생성 완료:', result);
        setRequestId(result.order_id); // Order ID를 저장
        
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
  
  // 요금표 (분량별, 녹취 위치별)
  const PRICE_TABLE = {
    '통화': [
      { maxMinutes: 3, price: 30000 },
      { maxMinutes: 5, price: 40000 },
      { maxMinutes: 10, price: 70000 },
      { maxMinutes: 20, price: 100000 },
      { maxMinutes: 30, price: 120000 },
      { maxMinutes: 40, price: 140000 },
      { maxMinutes: 50, price: 160000 },
      { maxMinutes: 60, price: 180000 },
      { maxMinutes: Infinity, price: 180000 } // 60분 초과 시 60분 요금 적용
    ],
    '현장': [
      { maxMinutes: 3, price: 50000 },
      { maxMinutes: 5, price: 60000 },
      { maxMinutes: 10, price: 90000 },
      { maxMinutes: 20, price: 120000 },
      { maxMinutes: 30, price: 140000 },
      { maxMinutes: 40, price: 160000 },
      { maxMinutes: 50, price: 180000 },
      { maxMinutes: 60, price: 200000 },
      { maxMinutes: Infinity, price: 200000 } // 60분 초과 시 60분 요금 적용
    ]
  };

  // 시간(HH:MM:SS)을 분으로 변환
  const timeToMinutes = (timeString: string): number => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return (hours * 60) + minutes + (seconds / 60);
  };

  // 각 탭의 속기 구간 길이를 분으로 계산
  const getTabDurationInMinutes = (tab: any): number => {
    if (tab.recordType === '전체') {
      // 전체 녹취: 파일 총 길이 사용
      return timeToMinutes(tab.fileDuration || '00:00:00');
    } else {
      // 부분 녹취: timestampRanges 총합 사용
      if (tab.timestampRanges && tab.timestampRanges.length > 0) {
        const { calculateTotalDuration } = require('@/utils/timestampUtils');
        const totalDuration = calculateTotalDuration(tab.timestampRanges);
        return timeToMinutes(totalDuration);
      }
    }
    return 0;
  };

  // 분량과 녹취 위치에 따른 가격 계산
  const getPriceByDurationAndLocation = (minutes: number, location: '통화' | '현장'): number => {
    const priceTable = PRICE_TABLE[location];
    for (const tier of priceTable) {
      if (minutes <= tier.maxMinutes) {
        return tier.price;
      }
    }
    return priceTable[priceTable.length - 1].price; // 기본값
  };

  // 모든 탭의 총 속기 구간 길이 계산 (분)
  const calculateTotalDuration = (): number => {
    return tabs.reduce((sum, tab) => {
      return sum + getTabDurationInMinutes(tab);
    }, 0);
  };

  // 속기록 제작비 계산 (모든 탭 합산)
  const calculateTranscriptionPrice = (): number => {
    return tabs.reduce((sum, tab) => {
      const minutes = getTabDurationInMinutes(tab);
      const price = getPriceByDurationAndLocation(minutes, tab.recordingLocation || '통화');
      return sum + price;
    }, 0);
  };

  const getSelectedOptionText = () => {
    // 선택된 최종본 옵션에 따른 텍스트
    switch (selectedFinalOption) {
      case 'file':
        return '파일';
      case 'file_usb':
        return '파일+등기우편';
      case 'file_usb_cd':
        return '파일+등기우편+CD';
      case 'file_usb_post':
        return '파일+등기우편+USB';
      default:
        return '파일';
    }
  };

  // 최종본 옵션 가격
  const getSelectedOptionPrice = (): number => {
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

  // 총 견적 계산 (속기록 제작비 + 최종본 옵션 + 부가세 10%)
  const calculateTotalPrice = (): number => {
    const transcriptionPrice = calculateTranscriptionPrice();
    const optionPrice = getSelectedOptionPrice();
    const subtotal = transcriptionPrice + optionPrice;
    const vat = Math.round(subtotal * 0.1); // 부가세 10%
    return subtotal + vat;
  };

  // 부가세 계산
  const calculateVAT = (): number => {
    const transcriptionPrice = calculateTranscriptionPrice();
    const optionPrice = getSelectedOptionPrice();
    const subtotal = transcriptionPrice + optionPrice;
    return Math.round(subtotal * 0.1);
  };

  // 총 속기 구간 길이를 "N분 N초" 형식으로 반환
  const formatTotalDuration = (): string => {
    const totalMinutes = calculateTotalDuration();
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.round((totalMinutes - minutes) * 60);
    return `${minutes}분 ${seconds}초`;
  };

  return showComplete ? (
    <div className="flex flex-col min-h-screen" style={{
      backgroundColor: '#cad5e5',
      backgroundImage: 'url(/new_goStenographe_resource/backgrounds/Background-Blue20-s.png)',
      backgroundPosition: '0 0',
      backgroundSize: 'auto'
    }}>
      <ApplyGNB 
        uploadedFiles={getAllUploadedFiles()}
        onNavigateAway={handleNavigateAway}
        showComplete={showComplete}
      />
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
            <div className="c-steps-grid max-w-[800px] mx-auto relative gap-16 md:gap-28">
              <div className="c-steps-item">
                <div className="c-steps-dot">
                  <div className="c-steps-dot-inner"></div>
                </div>
                <h3 className="c-step-title" style={{color: '#6b7280'}}>신청서 작성</h3>
                <p className="c-steps-sub-title" style={{color: '#6b7280'}}>파일과 정보를<br/>입력해 주세요.</p>
              </div>

              <div className="c-steps-line">
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
              <div className="mobile-hide-quotation" style={{
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
                          <div className="w-layout-grid c-order-info-grid grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3 items-start">
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
                  <div className="w-layout-grid c-client-info-grid grid grid-cols-1 sm:grid-cols-[1fr_2fr] gap-3 bg-white border border-gray-300 rounded-lg p-6">
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
      <ApplyGNB 
        uploadedFiles={getAllUploadedFiles()}
        onNavigateAway={handleNavigateAway}
        showComplete={showComplete}
      />
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
            {/* 탭 헤더 - 모바일에서 스크롤 가능하도록 개선 */}
            <div className="c-tab-header">
              <div className="c-tab-menu w-tab-menu" style={{
                overflowX: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              } as React.CSSProperties}>
                <div className="flex" style={{ minWidth: 'max-content' }}>
                  {tabs.map((tab, index) => (
                    <button
                      key={index}
                      className={`c-file-tab-button-${index === 0 ? 'left' : index === tabs.length - 1 ? 'right' : 'mid'} w-inline-block w-tab-link ${activeTab === index ? 'w--current' : ''}`}
                      onClick={() => setActiveTab(index)}
                      style={{ flexShrink: 0 }}
                    >
                      <div className="c-tab-button-text">파일 {index + 1}</div>
                      <div className="c-tab-button-text-mobile">{index + 1}</div>
                    </button>
                  ))}
                  
                  {tabs.length < 5 && (
                    <button
                      className="c-file-tab-button-right w-inline-block w-tab-link"
                      onClick={handleAddTab}
                      style={{ flexShrink: 0 }}
                    >
                      <div className="c-tab-button-text">+</div>
                      <div className="c-tab-button-text-mobile">+</div>
                    </button>
                  )}
                </div>
              </div>
              
              {/* 삭제 버튼 - 모바일에서 더 작고 이쁘게 */}
              {tabs.length > 1 && (
                <div className="c-delete-button-container">
                  <button
                    className="c-delete-button w-inline-block"
                    onClick={() => handleRemoveTab(activeTab)}
                    style={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      borderRadius: '6px',
                      backgroundColor: '#f97316',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <div className="text-block-2">삭제</div>
                  </button>
                </div>
              )}
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
                      
                      {/* 업로드 상태 표시 */}
                      {tab.files && tab.files.length > 0 && (
                        <div style={{
                          marginBottom: '16px',
                          padding: '12px',
                          backgroundColor: '#f8f9fa',
                          borderRadius: '8px',
                          border: '1px solid #e9ecef'
                        }}>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#495057',
                            marginBottom: '8px'
                          }}>
                            📁 업로드된 파일
                          </div>
                          {tab.files.map((file: any, fileIndex: number) => {
                            const fileName = file.file?.name || '알 수 없음';
                            const status = uploadStatus[fileName] || 'idle';
                            const isUploaded = file.file_key && file.file_key !== 'uploading';
                            
                            return (
                              <div key={fileIndex} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 12px',
                                backgroundColor: isUploaded ? '#d4edda' : '#fff3cd',
                                borderRadius: '6px',
                                marginBottom: '4px',
                                border: `1px solid ${isUploaded ? '#c3e6cb' : '#ffeaa7'}`
                              }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ fontSize: '12px', fontWeight: '500' }}>📄</span>
                                  <span style={{ fontSize: '13px', color: '#495057' }}>{fileName}</span>
                                  {status === 'uploading' && <span style={{ fontSize: '12px', color: '#007bff' }}>⏳ 업로드 중...</span>}
                                  {status === 'success' && <span style={{ fontSize: '12px', color: '#28a745' }}>✅ 업로드 완료</span>}
                                  {status === 'error' && <span style={{ fontSize: '12px', color: '#dc3545' }}>❌ 업로드 실패</span>}
                                </div>
                                {isUploaded && (
                                  <div style={{
                                    fontSize: '11px',
                                    color: '#6c757d',
                                    backgroundColor: '#e9ecef',
                                    padding: '2px 6px',
                                    borderRadius: '4px'
                                  }}>
                                    완료
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                      
                      <div className="link-block w-inline-block">
                        <FileUploadSection
                          formData={tab as any}
                          setFormData={(data) => {
                            const newTabs = [...tabs];
                            newTabs[index] = { ...tab, ...data };
                            setTabs(newTabs);
                          }}
                          onFileSelect={handleFileSelect}
                          uploadStatus={uploadStatus}
                        />
                      </div>
                    </div>
                    
                    {/* 녹취 위치 섹션 */}
                    <div className="c-file-block" style={{
                      backgroundColor: '#f4f6f9',
                      borderRadius: '20px',
                      padding: '2rem'
                    }}>
                      <div className="w-layout-hflex c-file-block-title">
                        <h2 className="c-file-block-heading">녹취 위치</h2>
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
                      <RecordingLocationSection
                        formData={tab as any}
                        setFormData={(data) => {
                          const newTabs = [...tabs];
                          newTabs[index] = { ...tab, ...data };
                          setTabs(newTabs);
                        }}
                        tabIndex={index}
                      />
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
                              // 전체 녹취: 파일 총 길이 표시
                              if (tab.recordType === '전체') {
                                const duration = tab.fileDuration || '00:00:00';
                                const [hours, minutes, seconds] = duration.split(':');
                                return `${hours}시간 ${minutes}분 ${seconds}초`;
                              }
                              
                              // 부분 녹취: timestampRanges에서 계산
                              if (tab.timestampRanges && Array.isArray(tab.timestampRanges) && tab.timestampRanges.length > 0) {
                                try {
                                  const { calculateTotalDuration } = require('@/utils/timestampUtils');
                                  const totalDuration = calculateTotalDuration(tab.timestampRanges);
                                  const [hours, minutes, seconds] = totalDuration.split(':');
                                  return `${hours}시간 ${minutes}분 ${seconds}초`;
                                } catch (error) {
                                  console.error('[속기 구간 길이] 계산 오류:', error);
                                  return '00시간 00분 00초';
                                }
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
                              <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
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
                    <input type="radio" name="final-option" value="file_usb_cd" checked={selectedFinalOption === 'file_usb_cd'} onChange={(e) => setSelectedFinalOption(e.target.value)} className="w-form-formradioinput w-radio-input" />
                    <span className="w-form-label" style={{fontSize: '1rem'}}>파일 +등기 우편 +CD (+6,000원)</span>
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
                  <input className="c-text-input-field w-input" maxLength={100} name="customer-name" placeholder="신청인 성함" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
                  <div style={{width: '100%'}}>
                    <input
                      className={`c-text-input-field w-input ${phoneError ? 'border-red-500 border-2' : ''}`}
                      maxLength={100}
                      name="customer-phone"
                      placeholder="연락처 (000-0000-0000)"
                      type="text"
                      value={customerPhone}
                      onChange={handlePhoneChange}
                      required
                      style={{width: '100%'}}
                    />
                    {phoneError && (
                      <p className="text-red-500 text-sm mt-1">{phoneError}</p>
                    )}
                  </div>
                  <div style={{width: '100%'}}>
                    <input
                      className={`c-text-input-field w-input ${emailError ? 'border-red-500 border-2' : ''}`}
                      maxLength={100}
                      name="customer-email"
                      placeholder="이메일 (example@email.com)"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      onBlur={handleEmailBlur}
                      required
                      style={{width: '100%'}}
                    />
                    {emailError && (
                      <p className="text-red-500 text-sm mt-1">{emailError}</p>
                    )}
                  </div>
                  <input className="c-text-input-field w-input" maxLength={100} name="customer-address" placeholder="주소 (최종본 수령지)" type="text" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} required />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
      
      {/* 견적 섹션과 겹치지 않도록 하단 여백 추가 */}
      <div className="pb-48"></div>
      
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
                <h6 className="c-checkout-f-text">- 속기록 제작 ({formatTotalDuration()})</h6>
                <h6 className="c-checkout-f-text">{calculateTranscriptionPrice().toLocaleString()}원</h6>
              </div>
              <div className="w-layout-hflex c-checkout-factor">
                <h6 className="c-checkout-f-text">- 최종본: {getSelectedOptionText()}</h6>
                <h6 className="c-checkout-f-text">{getSelectedOptionPrice().toLocaleString()}원</h6>
              </div>
              <div className="w-layout-hflex c-checkout-factor">
                <h6 className="c-checkout-f-text">- 부가세 (10%)</h6>
                <h6 className="c-checkout-f-text">{calculateVAT().toLocaleString()}원</h6>
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
            <button onClick={handleSubmit} className="c-button-checkout w-button" disabled={!isFormValid()} style={{opacity: isFormValid() ? 1 : 0.5, cursor: isFormValid() ? 'pointer' : 'not-allowed'}}>접수 완료하기</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Page() {
  return <Reception />;
}
