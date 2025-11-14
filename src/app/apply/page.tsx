'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import DaumPostcode from 'react-daum-postcode';
import ApplyGNB from '@/components/ApplyGNB';
import NewFooter from '@/components/NewFooter';
import OrdererInfoSection from '@/components/OrdererInfoSection';
import RequestInfoSection from '@/components/RequestInfoSection';
import FileUploadSection from '@/components/FileUploadSection';
import RecordingLocationSection from '@/components/RecordingLocationSection';
import QuotationSection from '@/components/QuotationSection';
import { uploadMultipleFiles } from '@/utils/fileUpload';
import { getMediaDuration } from '@/utils/mediaDuration';
import { Z_INDEX } from '@/constants/zIndex';
import { PRICE_TABLE, FINAL_OPTION_PRICES, FINAL_OPTION_LABELS, OVERTIME_RATE } from '@/config/pricing';

// API 기본 URL
const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

function Reception() {
  // 기본 상태들
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerDetailAddress, setCustomerDetailAddress] = useState('');
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
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedFileFormat, setSelectedFileFormat] = useState('docx');
  const [selectedFinalOption, setSelectedFinalOption] = useState('file');
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'idle' | 'uploading' | 'success' | 'error'>>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tabToDelete, setTabToDelete] = useState<number | null>(null);
  const [isDeletingTab, setIsDeletingTab] = useState(false);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  // 신청 시점의 금액 정보를 저장 (백엔드 전송 금액과 신청완료 페이지 표시 금액을 일치시키기 위함)
  const [submittedPriceInfo, setSubmittedPriceInfo] = useState<{
    totalPrice: number;
    transcriptionPrice: number;
    optionPrice: number;
    vatAmount: number;
    totalDuration: string;
    finalOptionText: string;
  } | null>(null);
  // tabs 최신값을 이벤트 리스너에서 안전하게 참조하기 위한 ref
  const tabsRef = useRef(tabs);
  // 파일 삭제 완료 플래그 (popstate → beforeunload 중복 방지)
  const filesDeletedRef = useRef(false);
  useEffect(() => {
    tabsRef.current = tabs;
  }, [tabs]);

  // ApplyGNB용: tabs 변경 시 자동 재계산되는 uploadedFiles
  const uploadedFiles = useMemo(() => {
    const allFiles: Array<{ file_key: string; file: File }> = [];

    tabs.forEach((tab) => {
      if (tab.files && tab.files.length > 0) {
        tab.files.forEach(f => {
          if (f.file_key && f.file_key !== 'uploading') {
            allFiles.push({ file_key: f.file_key, file: f.file });
          }
        });
      }
    });

    return allFiles;
  }, [tabs]);

  // 이벤트 핸들러용: 항상 최신 tabs 값을 참조 (tabsRef 사용)
  const getAllUploadedFiles = () => {
    const allFiles: Array<{ file_key: string; file: File }> = [];
    const currentTabs = tabsRef.current;

    currentTabs.forEach(tab => {
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

  // 파일이 있는지 확인 (이벤트 핸들러용)
  const hasUploadedFiles = () => {
    if (showComplete) return false;
    return getAllUploadedFiles().length > 0;
  };

  // 페이지 이탈 시 파일 삭제 (S3 + Supabase 동시 삭제)
  const handleNavigateAway = async () => {
    const filesToDelete = getAllUploadedFiles();
    
    if (filesToDelete.length === 0) return;

    const fileKeys = filesToDelete.map(f => f.file_key);
    console.log('[NAVIGATE_AWAY] 삭제할 파일 keys:', fileKeys);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${backendUrl}/api/database/public-delete-uploaded-files/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_keys: fileKeys })
      });
      if (!response.ok) {
        console.error('[NAVIGATE_AWAY] 일괄 삭제 실패', await response.text());
      } else {
        console.log('[NAVIGATE_AWAY] 일괄 삭제 성공');
      }
    } catch (error) {
      console.error('[NAVIGATE_AWAY] 일괄 삭제 요청 오류:', error);
    }
  };

  // 삭제 중일 때 페이지 이탈 방지
  useEffect(() => {
    if (isDeletingTab) {
      const blockExit = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };

      window.addEventListener('beforeunload', blockExit);
      return () => window.removeEventListener('beforeunload', blockExit);
    }
  }, [isDeletingTab]);

  // beforeunload 이벤트 - 새로고침/브라우저 닫기 시 경고만 표시
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // 삭제 중일 때는 별도로 처리됨
      if (isDeletingTab) return;

      // popstate에서 이미 삭제했으면 스킵 (뒤로가기 중복 방지)
      if (filesDeletedRef.current) {
        console.log('[BEFOREUNLOAD] 이미 삭제됨, 스킵');
        return;
      }

      if (hasUploadedFiles()) {
        // 경고만 표시 (파일 삭제 안 함)
        // 취소 → 페이지 유지, 파일 유지, 계속 작성 가능
        // 확인 → 페이지 이탈, 파일 유지 (서버에서 6시간 후 자동 삭제)
        console.log('[BEFOREUNLOAD] 경고 표시 (파일 유지, 서버에서 6시간 후 자동 정리)');
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [showComplete]);

  // popstate 이벤트 - 브라우저 뒤로가기 버튼 경고 (안전한 지연 초기화)
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (showComplete) return;

      if (hasUploadedFiles()) {
        const confirmLeave = window.confirm(
          '업로드된 파일이 있습니다.\n페이지를 나가시면 파일이 삭제됩니다.\n정말 나가시겠습니까?'
        );

        if (!confirmLeave) {
          window.history.pushState(null, '', window.location.href);
        } else {
          // 파일 삭제 후 플래그 설정 (beforeunload 스킵용)
          handleNavigateAway().then(() => {
            filesDeletedRef.current = true;
            console.log('[POPSTATE] 파일 삭제 완료, beforeunload 스킵 플래그 설정');
            window.history.back();
          });
        }
      }
    };

    // Next 내부 초기화 이후 한 번만 pushState 수행
    const initTimer = setTimeout(() => {
      try {
        window.history.pushState(null, '', window.location.href);
      } catch (err) {
        console.warn('[HISTORY] 초기 pushState 실패:', err);
      }
    }, 0);
    window.addEventListener('popstate', handlePopState);
    
    return () => {
      clearTimeout(initTimer);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [showComplete]);

  // 기본 함수들
  const handleNewRequest = () => {
    // 페이지 새로고침으로 초기 상태로 돌아가기
    window.location.reload();
  };

  const handleAddTab = () => {
    if (tabs.length >= 5) return;
    setTabs([...tabs, { files: [], speakerNames: [''], selectedDates: [], detail: '', speakerCount: 1, timestamps: [], timestampRanges: [], recordType: '전체', recordingLocation: '통화', recordingDate: '', recordingTime: '', recordingUnsure: false, fileDuration: '00:00:00' }]);
    setActiveTab(tabs.length);
  };

  // 삭제 버튼 클릭 시 모달 표시
  const handleRemoveTabClick = (idx: number) => {
    if (tabs.length === 1) return;

    const targetTab = tabs[idx];
    // 파일이 업로드된 경우에만 확인 모달 표시
    if (targetTab && Array.isArray(targetTab.files) && targetTab.files.length > 0) {
      const hasUploadedFile = targetTab.files.some(f => f.file_key && f.file_key !== 'uploading');
      if (hasUploadedFile) {
        setTabToDelete(idx);
        setShowDeleteModal(true);
        return;
      }
    }

    // 파일이 없으면 바로 삭제
    confirmRemoveTab(idx);
  };

  // 실제 탭 삭제 처리
  const confirmRemoveTab = async (idx: number) => {
    if (tabs.length === 1) return;

    // 삭제 대상 탭의 업로드 파일을 S3 + Supabase에서 먼저 삭제
    const targetTab = tabs[idx];
    if (targetTab && Array.isArray(targetTab.files) && targetTab.files.length > 0) {
      const fileKeys = targetTab.files
        .map((f: any) => f?.file_key)
        .filter((k: string) => k && k !== 'uploading');

      if (fileKeys.length > 0) {
        try {
          const response = await fetch(`${API_URL}/api/database/public-delete-uploaded-files/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file_keys: fileKeys })
          });
          if (!response.ok) {
            console.warn('[TAB_REMOVE] 일괄 삭제 실패', await response.text());
          } else {
            console.log('[TAB_REMOVE] 일괄 삭제 성공');
          }
        } catch (e) {
          console.error('[TAB_REMOVE] 파일 삭제 중 오류:', e);
        }
      }
    }

    // 탭 제거 및 활성 탭 보정
    const newTabs = tabs.filter((_, i) => i !== idx);
    setTabs(newTabs);
    if (activeTab === idx) {
      setActiveTab(Math.max(0, idx - 1));
    } else if (activeTab > idx) {
      setActiveTab(activeTab - 1);
    }
  };

  // 삭제 확인 모달 - 확인 버튼
  const handleConfirmDelete = async () => {
    setIsDeletingTab(true);

    try {
      if (tabToDelete !== null) {
        await confirmRemoveTab(tabToDelete);
      }

      // 네트워크 전송 완료 보장을 위한 짧은 대기
      await new Promise(resolve => setTimeout(resolve, 300));

      setShowDeleteModal(false);
      setTabToDelete(null);
    } catch (error) {
      console.error('[TAB_DELETE] 탭 삭제 중 오류:', error);
    } finally {
      setIsDeletingTab(false);
    }
  };

  // 삭제 확인 모달 - 취소 버튼
  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setTabToDelete(null);
  };

  // 개별 파일 삭제 핸들러
  const handleDeleteFile = async (tabIndex: number) => {
    const targetTab = tabs[tabIndex];
    if (!targetTab || !targetTab.files || targetTab.files.length === 0) return;

    const file = targetTab.files[0];
    const fileName = file.file?.name || '파일';

    const confirmDelete = window.confirm(
      `"${fileName}"을(를) 삭제하시겠습니까?\n\n파일 ${tabIndex + 1}의 업로드된 파일이 삭제됩니다.`
    );

    if (!confirmDelete) return;

    // S3에서 파일 삭제
    if (file.file_key && file.file_key !== 'uploading') {
      try {
        const response = await fetch(`${API_URL}/api/database/public-delete-uploaded-files/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ file_keys: [file.file_key] })
        });

        if (!response.ok) {
          console.warn('[FILE_DELETE] 파일 삭제 실패', await response.text());
          alert('파일 삭제에 실패했습니다.');
          return;
        }

        console.log('[FILE_DELETE] 파일 삭제 성공:', file.file_key);
      } catch (e) {
        console.error('[FILE_DELETE] 파일 삭제 중 오류:', e);
        alert('파일 삭제 중 오류가 발생했습니다.');
        return;
      }
    }

    // tabs 상태 업데이트 - 파일만 삭제, 탭은 유지
    const newTabs = [...tabs];
    newTabs[tabIndex] = {
      ...newTabs[tabIndex],
      files: [],
      fileDuration: '00:00:00'
    };
    setTabs(newTabs);

    // uploadStatus에서도 제거
    const newUploadStatus = { ...uploadStatus };
    if (file.file?.name) {
      delete newUploadStatus[file.file.name];
      setUploadStatus(newUploadStatus);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // 업로드 상태 초기화 (기존 상태 유지)
    const newUploadStatus: Record<string, 'idle' | 'uploading' | 'success' | 'error'> = {};
    files.forEach(file => {
      newUploadStatus[file.name] = 'uploading';
    });
    setUploadStatus(prev => ({...prev, ...newUploadStatus}));

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
      console.log('[apply/page] setTabs 실행 전');
      console.log('  - uploadedFiles:', uploadedFiles);
      console.log('  - uploadedFiles 상세:', uploadedFiles.map(uf => ({
        fileName: uf.file.name,
        fileKey: uf.fileKey
      })));

      setTabs(tabs => tabs.map((tab, idx) =>
        idx === activeTab ? {
          ...tab,
          files: uploadedFiles.map(({file, fileKey}) => ({file, file_key: fileKey})),
          fileDuration: fileDuration
        } : tab
      ));

      console.log('[apply/page] setTabs 실행 후');

      // 업로드 성공 상태 업데이트 (기존 상태 유지)
      const successStatus: Record<string, 'idle' | 'uploading' | 'success' | 'error'> = {};
      files.forEach(file => {
        successStatus[file.name] = 'success';
      });
      setUploadStatus(prev => ({...prev, ...successStatus}));

      console.log('파일 업로드 완료:', uploadedFiles);
      console.log('파일 재생시간:', fileDuration);

    } catch (error) {
      console.error('파일 업로드 실패:', error);
      
      // 업로드 실패 상태 업데이트 (기존 상태 유지)
      const errorStatus: Record<string, 'idle' | 'uploading' | 'success' | 'error'> = {};
      files.forEach(file => {
        errorStatus[file.name] = 'error';
      });
      setUploadStatus(prev => ({...prev, ...errorStatus}));

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
        <div className="ml-auto flex items-center">
          <button
            className="c-delete-button"
            onClick={() => handleRemoveTabClick(activeTab)}
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
    const value = e.target.value.replace(/\s/g, '');
    setCustomerEmail(value);
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

  // 검증 에러 수집 함수
  const collectValidationErrors = () => {
    const errors: string[] = [];

    // 주문자 정보 검증
    if (customerName.trim() === '') {
      errors.push('주문자 성함을 입력해주세요.');
    }
    if (!validatePhone(customerPhone)) {
      errors.push('주문자 전화번호를 올바르게 입력해주세요. (10~11자리)');
    }
    if (!validateEmail(customerEmail)) {
      errors.push('주문자 이메일을 올바른 형식으로 입력해주세요.');
    }
    if (!validateAddress(customerAddress)) {
      errors.push('주문자 주소를 입력해주세요.');
    }
    if (customerDetailAddress.trim() === '') {
      errors.push('상세 주소를 입력해주세요.');
    }

    // 약관 동의 검증
    if (!agree) {
      errors.push('개인정보 수집 및 이용에 동의해주세요.');
    }

    // 각 파일별 검증
    tabs.forEach((tab, index) => {
      const fileNumber = index + 1;

      // 파일 업로드 검증
      if (!tab.files || tab.files.length === 0) {
        errors.push(`파일 ${fileNumber}: 파일을 업로드해주세요.`);
      } else if (tab.files.some(f => !f.file_key || f.file_key === 'uploading')) {
        errors.push(`파일 ${fileNumber}: 파일 업로드가 완료될 때까지 기다려주세요.`);
      }

      // 녹취 종류 검증 (기본값이 있으므로 항상 통과)
      if (tab.recordType !== '전체' && tab.recordType !== '부분') {
        errors.push(`파일 ${fileNumber}: 녹취 종류를 선택해주세요.`);
      }

      // 부분 녹취 시 타임스탬프 검증 (강화됨)
      if (tab.recordType === '부분') {
        if (!tab.timestampRanges || tab.timestampRanges.length === 0) {
          errors.push(`파일 ${fileNumber}: 녹취 구간을 입력해주세요.`);
        } else {
          // 모든 구간이 완전히 입력되었는지 확인
          const hasEmptyRange = tab.timestampRanges.some((range: any) =>
            !range.startTime || !range.endTime || range.startTime === '' || range.endTime === ''
          );

          if (hasEmptyRange) {
            errors.push(`파일 ${fileNumber}: 모든 녹취 구간의 시작/종료 시간을 입력해주세요.`);
          } else if (tab.timestampRanges.some((range: any) => range.isValid === false)) {
            // 유효하지 않은 구간이 있으면 해당 에러 메시지 표시
            const invalidRange = tab.timestampRanges.find((range: any) => range.isValid === false);
            if (invalidRange && invalidRange.error) {
              errors.push(`파일 ${fileNumber}: ${invalidRange.error}`);
            } else {
              errors.push(`파일 ${fileNumber}: 녹취 구간이 올바르지 않습니다.`);
            }
          }
        }
      }

      // 화자 정보 검증
      if (!tab.speakerNames || tab.speakerNames.length === 0) {
        errors.push(`파일 ${fileNumber}: 화자 정보를 입력해주세요.`);
      } else if (tab.speakerNames.some((name: string) => name.trim() === '')) {
        errors.push(`파일 ${fileNumber}: 모든 화자의 이름을 입력해주세요.`);
      }

      // 녹음 일시 검증 (필수)
      if (!tab.recordingUnsure && !tab.recordingDate) {
        errors.push(`파일 ${fileNumber}: 녹음 일시를 선택하거나 '잘 모르겠어요'를 체크해주세요.`);
      }
    });

    return errors;
  };

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

      // 4. 화자 정보 (필수) - 모든 화자명 입력 필요
      const speakerValid = tab.speakerNames &&
                          tab.speakerNames.length > 0 &&
                          tab.speakerNames.every((name: string) => name.trim() !== '');

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
    // 검증 에러 수집
    const errors = collectValidationErrors();

    if (errors.length > 0) {
      setValidationErrors(errors);
      setShowValidationModal(true);
      return;
    }
    
    // 새로운 API 호출 (파일별 Request 생성)
    try {
      // 신청 시점의 금액 정보를 계산하고 저장 (백엔드 전송 금액과 신청완료 페이지 표시 금액을 일치시키기 위함)
      const totalPrice = calculateTotalPrice();
      const transcriptionPrice = calculateTranscriptionPrice();
      const optionPrice = getSelectedOptionPrice();
      const vatAmount = calculateVAT();
      const totalDuration = formatTotalDuration();
      const finalOptionText = getSelectedOptionText();

      // 금액 정보 저장
      setSubmittedPriceInfo({
        totalPrice,
        transcriptionPrice,
        optionPrice,
        vatAmount,
        totalDuration,
        finalOptionText
      });

      const requestData = {
        name: customerName,
        phone: customerPhone,
        email: customerEmail,
        address: `${customerAddress}, ${customerDetailAddress}`,
        draft_format: selectedFileFormat,
        final_option: selectedFinalOption,
        agreement: agree,
        is_temporary: false,
        recording_location: tabs[0]?.recordingLocation === '현장' ? '현장' : '통화',
        estimated_price: totalPrice, // 계산된 견적 사용
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

      const response = await fetch(`${API_URL}/api/requests/create_order_with_files/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (response.ok) {
        const result = await response.json();
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
        alert(`신청 실패 (${response.status}): ${JSON.stringify(errorData)}`);
      }
    } catch (error) {
      alert('신청 처리 중 오류가 발생했습니다.');
    }
  };

  // 동적 견적 계산 함수들

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

  // 분량과 녹음 종류에 따른 가격 계산
  const getPriceByDurationAndLocation = (minutes: number, location: '통화' | '현장'): number => {
    // 0분일 때는 0원 반환 (파일 없음 또는 구간 미입력)
    if (minutes === 0) {
      return 0;
    }

    // 60분 이하: 기존 가격표 조회
    if (minutes <= 60) {
      const priceTable = PRICE_TABLE[location];
      for (const tier of priceTable) {
        if (minutes <= tier.maxMinutes) {
          return tier.price;
        }
      }
    }

    // 60분 초과: 기본 60분 요금 + 10분 단위 추가 요금
    const basePrice = PRICE_TABLE[location].find(tier => tier.maxMinutes === 60)!.price;
    const overtimeMinutes = minutes - 60;
    const overtimeSlots = Math.ceil(overtimeMinutes / 10);
    const overtimePrice = overtimeSlots * OVERTIME_RATE[location];

    return basePrice + overtimePrice;
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
    return FINAL_OPTION_LABELS[selectedFinalOption as keyof typeof FINAL_OPTION_LABELS] || FINAL_OPTION_LABELS.file;
  };

  // 최종본 옵션 가격
  const getSelectedOptionPrice = (): number => {
    return FINAL_OPTION_PRICES[selectedFinalOption as keyof typeof FINAL_OPTION_PRICES] || 0;
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
      backgroundColor: '#cad5e5' // 진한 청회색 배경
    }}>
      <ApplyGNB
        uploadedFiles={uploadedFiles}
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
                <br className="mobile-break" />
                <strong>비용 안내드리겠습니다.</strong>
              </h2>
              <p className="c-finito-subtitle-pharagraph" style={{color: '#ef4444', fontSize: '1rem', marginTop: '0.5rem'}}>
                * 작업 순서에 따라 안내가 지연될 수 있습니다.
              </p>
            </div>

            {/* 예상 견적 섹션 - 완전히 독립적인 컴포넌트 */}
            <QuotationSection
              totalPrice={submittedPriceInfo?.totalPrice || calculateTotalPrice()}
              transcriptionPrice={submittedPriceInfo?.transcriptionPrice || calculateTranscriptionPrice()}
              optionPrice={submittedPriceInfo?.optionPrice || getSelectedOptionPrice()}
              vatAmount={submittedPriceInfo?.vatAmount || calculateVAT()}
              totalDuration={submittedPriceInfo?.totalDuration || formatTotalDuration()}
              finalOptionText={submittedPriceInfo?.finalOptionText || getSelectedOptionText()}
            />

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
                      <div className="c-app-info-grid-contents">{customerAddress && customerDetailAddress ? `${customerAddress}, ${customerDetailAddress}` : '미입력'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </section>
      <NewFooter />
    </div>
  ) : (
    <div className="flex flex-col min-h-screen apply-page-background" style={{
      backgroundColor: '#cad5e5' // 진한 청회색 배경
    }}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <ApplyGNB
        uploadedFiles={uploadedFiles}
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
                      style={{ flexShrink: 0, padding: '6px 8px' }}
                    >
                      <div className="c-tab-button-text">파일 {index + 1}</div>
                      <div className="c-tab-button-text-mobile">{index + 1}</div>
                    </button>
                  ))}
                  
                  {tabs.length < 5 && (
                    <button
                      className="c-file-tab-button-right w-inline-block w-tab-link"
                      onClick={handleAddTab}
                      style={{ flexShrink: 0, padding: '6px 8px' }}
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
                    onClick={() => handleRemoveTabClick(activeTab)}
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

            <div className="c-tab-content w-tab-content" style={{ marginBottom: '5rem' }}>
              {tabs.map((tab, index) => (
                <div key={index} className={`c-file-tab-pane w-tab-pane ${index === activeTab ? 'w--tab-active' : ''}`}>
                  <div className="w-layout-vflex file-tab-container" style={{
                    backgroundColor: 'white',
                    borderBottomRightRadius: '20px',
                    borderBottomLeftRadius: '20px',
                    padding: '0 1rem 1rem', // 좌우 패딩을 줄여서 더 넓은 공간 확보
                    maxWidth: '100%', // 최대 너비 제한 해제
                    width: '100%' // 전체 너비 사용
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

                      {/* 첨부 가능한 파일 형식 안내 */}
                      <div style={{
                        marginTop: '16px',
                        padding: '12px 16px',
                        backgroundColor: '#f3f4f6',
                        borderRadius: '8px',
                        fontSize: '14px',
                        lineHeight: '1.6',
                        color: '#374151'
                      }}>
                        <div style={{ fontWeight: '600', marginBottom: '8px' }}>* 첨부 가능한 파일 형식</div>
                        <div style={{ paddingLeft: '8px' }}>
                          <div>- 음성 : mp3, wav, m4a, cda, mod, ogg, wma, flac, asf</div>
                          <div>- 영상 : avi, mp4, asf, wmv, m2v, mpeg, dpg, mts, webm, divx, amv</div>
                        </div>
                      </div>

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
                          currentTabIndex={index}
                          onDeleteFile={handleDeleteFile}
                        />
                      </div>
                    </div>
                    
                    {/* 녹음 종류 섹션 */}
                    <div className="c-file-block" style={{
                      backgroundColor: '#f4f6f9',
                      borderRadius: '20px',
                      padding: '2rem'
                    }}>
                      <div className="w-layout-hflex c-file-block-title">
                        <h2 className="c-file-block-heading">녹음 종류</h2>
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
                      minHeight: '120px', // 최소 높이 설정으로 공간 확보
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      padding: '2rem'
                    }}>
                      {/* 화자 정보 구조와 동일하게 적용 */}
                      <div className="w-layout-hflex c-file-block-title between">
                        {/* 왼쪽: 녹취 종류 + 필수 태그 */}
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

                        {/* 오른쪽: 속기 구간 길이 */}
                        <div className="w-layout-hflex c-type-static-wrapper">
                          <h2 className="c-file-block-heading light">속기 구간 길이</h2>
                          <h2 className="c-file-block-heading highlight">
                            {(() => {
                              if (tab.recordType === '전체') {
                                const duration = tab.fileDuration || '00:00:00';
                                const [hours, minutes, seconds] = duration.split(':');
                                return `${hours}시간 ${minutes}분 ${seconds}초`;
                              }

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

                      {/* 전체/부분 녹취 버튼 */}
                      <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem' }}>
                        <button
                          onClick={() => {
                            const newTabs = [...tabs];
                            newTabs[index] = { ...tab, recordType: '전체' };
                            setTabs(newTabs);
                          }}
                          style={{
                            backgroundColor: tab.recordType === '전체' ? '#374151' : 'white',
                            color: tab.recordType === '전체' ? 'white' : '#374151',
                            border: '1px solid #374151',
                            borderRight: 'none',
                            padding: '12px 24px',
                            fontSize: '14px',
                            fontWeight: tab.recordType === '전체' ? '600' : '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          전체 녹취
                        </button>
                        <button
                          onClick={() => {
                            const newTabs = [...tabs];
                            newTabs[index] = { ...tab, recordType: '부분' };
                            setTabs(newTabs);
                          }}
                          style={{
                            backgroundColor: tab.recordType === '부분' ? '#374151' : 'white',
                            color: tab.recordType === '부분' ? 'white' : '#374151',
                            border: '1px solid #374151',
                            padding: '12px 24px',
                            fontSize: '14px',
                            fontWeight: tab.recordType === '부분' ? '600' : '500',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          부분 녹취
                        </button>
                      </div>
                      
                      {/* 부분 녹취 입력 영역 */}
                      {tab.recordType === '부분' && (
                        <RequestInfoSection
                          formData={tab as any}
                          setFormData={(data) => {
                            const newTabs = [...tabs];
                            newTabs[index] = { ...tab, ...data };
                            setTabs(newTabs);
                          }}
                          fileDuration={tab.fileDuration || '00:00:00'}
                        />
                      )}
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
                                      zIndex: Z_INDEX.INPUT_OVERLAY
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
                                      zIndex: Z_INDEX.INPUT_OVERLAY
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
                        <div className="c-file-block-title-tag" style={{
                          border: '1px solid #d1d5db',
                          backgroundColor: '#e5e7eb',
                          borderRadius: '10px',
                          padding: '2px 8px',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}>
                          <div className="c-tag-text" style={{
                            color: '#374151',
                            fontFamily: 'Pretendard',
                            fontSize: '14px'
                          }}>선택</div>
                        </div>
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
                                    if (e.target.value.length <= 2000) {
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
                                  {(tab.detail || '').length}/2000
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
          <div className="order-info-section w-layout-vflex" style={{
            backgroundColor: '#ece8d7',
            backgroundImage: 'url(/new_goStenographe_resource/backgrounds/Background-Beige.png)',
            backgroundPosition: '0 0',
            backgroundSize: 'auto',
            borderRadius: '20px',
            padding: '1.5rem 2rem 1rem',
            marginTop: '-5rem',
            width: '100%',
            position: 'relative',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            <div className="c-file-title-block">
              <h2 className="c-order-info-heading" style={{
                fontFamily: 'Pretendard, sans-serif',
                color: '#333',
                fontSize: '22px',
                fontWeight: '700',
                marginBottom: '0.25rem',
                marginTop: '0'
              }}>주문 정보</h2>
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
                    <span className="w-form-label final-option-label" style={{fontSize: '1rem'}}>파일 +등기 우편 <span className="price-break">(+5,000원)</span></span>
                  </label>
                  <label className="radio-button-field w-radio" style={{fontSize: '1rem'}}>
                    <input type="radio" name="final-option" value="file_usb_cd" checked={selectedFinalOption === 'file_usb_cd'} onChange={(e) => setSelectedFinalOption(e.target.value)} className="w-form-formradioinput w-radio-input" />
                    <span className="w-form-label final-option-label" style={{fontSize: '1rem'}}>파일 +등기 우편 +CD <span className="price-break">(+6,000원)</span></span>
                  </label>
                  <label className="radio-button-field w-radio" style={{fontSize: '1rem'}}>
                    <input type="radio" name="final-option" value="file_usb_post" checked={selectedFinalOption === 'file_usb_post'} onChange={(e) => setSelectedFinalOption(e.target.value)} className="w-form-formradioinput w-radio-input" />
                    <span className="w-form-label final-option-label" style={{fontSize: '1rem'}}>파일 +등기 우편 +USB <span className="price-break">(+10,000원)</span></span>
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
              <div className="form-block w-form" style={{width: '100%', display: 'flex', justifyContent: 'flex-start'}}>
                <div className="c-apply-form vertical" style={{gap: '0.5rem', width: '100%', maxWidth: '800px'}}>
                  <input className="c-text-input-field w-input" maxLength={100} name="customer-name" placeholder="신청인 성함" type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value.trim())} required style={{marginBottom: '0'}} />
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
                      style={{width: '100%', marginBottom: '0'}}
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
                      onChange={(e) => setCustomerEmail(e.target.value.replace(/\s/g, ''))}
                      onBlur={handleEmailBlur}
                      required
                      style={{width: '100%', marginBottom: '0'}}
                    />
                    {emailError && (
                      <p className="text-red-500 text-sm mt-1">{emailError}</p>
                    )}
                  </div>
                  <div className="address-input-wrapper" style={{width: '100%'}}>
                    <div style={{display: 'flex', gap: '0.5rem', width: '100%', marginBottom: '0.5rem'}}>
                      <input
                        className="c-text-input-field w-input"
                        maxLength={200}
                        name="customer-address"
                        placeholder="주소 (최종본 수령지)"
                        type="text"
                        value={customerAddress}
                        onChange={(e) => setCustomerAddress(e.target.value)}
                        required
                        style={{flex: 1, minWidth: '0', marginBottom: '0'}}
                      />
                      <button
                        type="button"
                        onClick={() => setIsAddressModalOpen(true)}
                        className="address-search-btn"
                        style={{
                          padding: '12px 16px',
                          backgroundColor: '#3d5a80',
                          color: 'white',
                          border: '1px solid #3d5a80',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          fontWeight: '600',
                          whiteSpace: 'nowrap',
                          transition: 'opacity 0.3s ease',
                          flexShrink: 0,
                          height: '48px',
                          lineHeight: '1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                      >
                        주소 찾기
                      </button>
                    </div>
                    <input
                      className="c-text-input-field w-input"
                      maxLength={100}
                      name="customer-detail-address"
                      placeholder="상세 주소 (동/호수 등)"
                      type="text"
                      value={customerDetailAddress}
                      onChange={(e) => setCustomerDetailAddress(e.target.value)}
                      required
                      style={{width: '100%', marginBottom: '0'}}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 주소 검색 모달 */}
            {isAddressModalOpen && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  zIndex: Z_INDEX.MODAL_OVERLAY
                }}
                onClick={() => setIsAddressModalOpen(false)}
              >
                <div
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    maxWidth: '500px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflow: 'auto',
                    position: 'relative'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <h3 style={{margin: 0, fontSize: '1.25rem', fontWeight: 'bold'}}>주소 검색</h3>
                    <button
                      onClick={() => setIsAddressModalOpen(false)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '1.5rem',
                        cursor: 'pointer',
                        color: '#666'
                      }}
                    >
                      ×
                    </button>
                  </div>
                  <DaumPostcode
                    onComplete={(data: any) => {
                      let fullAddress = data.address;
                      let extraAddress = '';

                      if (data.addressType === 'R') {
                        if (data.bname !== '') {
                          extraAddress += data.bname;
                        }
                        if (data.buildingName !== '') {
                          extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
                        }
                        fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
                      }

                      setCustomerAddress(fullAddress);
                      setIsAddressModalOpen(false);
                    }}
                    style={{ width: '100%', height: '400px' }}
                  />
                </div>
              </div>
            )}
          </div>

        </div>
      </section>
      
      {/* 견적 섹션과 겹치지 않도록 하단 여백 추가 */}
      <div className="pb-32"></div>
      
      {/* 예상 견적란 - 재설계된 구조 */}
      <section className="c-checkout-section-new">
        <div className="c-checkout-container-new">
          {/* 왼쪽: 견적 정보 */}
          <div className="c-checkout-left-new">
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              paddingBottom: '0.5rem',
              marginBottom: '0.5rem',
              borderBottom: '1px solid #e5e7eb'
            }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: '#1a202c',
                margin: 0
              }}>예상 견적</h2>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                color: '#1a202c',
                margin: 0
              }}>{calculateTotalPrice().toLocaleString()}원</h2>
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#4a5568',
              lineHeight: '1.6',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>- 속기록 제작 ({formatTotalDuration()})</span>
                <span>{calculateTranscriptionPrice().toLocaleString()}원</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>- 최종본: {getSelectedOptionText()}</span>
                <span>{getSelectedOptionPrice().toLocaleString()}원</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>- 부가세 (10%)</span>
                <span>{calculateVAT().toLocaleString()}원</span>
              </div>
            </div>
          </div>
          
          {/* 오른쪽: 파란색 박스 */}
          <div className="c-checkout-right-new">
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              color: 'white',
              marginBottom: '0.5rem'
            }}>
              <input 
                type="checkbox" 
                checked={agree} 
                onChange={(e) => setAgree(e.target.checked)}
                style={{
                  width: '14px',
                  height: '14px',
                  accentColor: 'white',
                  cursor: 'pointer'
                }}
              />
              <span>주문 내용, 서비스 이용약관 및 개인정보처리방침을 확인 했으며, 정보 제공에 동의합니다.</span>
            </label>
            <button
              onClick={handleSubmit}
              style={{
                width: '100%',
                padding: '0.75rem 1.5rem',
                backgroundColor: 'white',
                color: '#1c58af',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              접수 완료하기
            </button>
          </div>
        </div>
      </section>

      {/* 탭 삭제 확인 모달 */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: Z_INDEX.MODAL_OVERLAY
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗑️</div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#dc2626',
                marginBottom: '12px'
              }}>
                파일 {tabToDelete !== null ? tabToDelete + 1 : ''}을(를) 삭제하시겠습니까?
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.6'
              }}>
                이 탭에 업로드된 <strong>파일과 작성된 모든 정보가 삭제</strong>됩니다.<br/>
                이 작업은 되돌릴 수 없습니다.
              </p>
            </div>

            {isDeletingTab ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{
                  display: 'inline-block',
                  width: '40px',
                  height: '40px',
                  border: '4px solid #e5e7eb',
                  borderTop: '4px solid #dc2626',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  marginBottom: '16px'
                }} />
                <p style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#374151'
                }}>
                  파일 삭제 중...
                </p>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginTop: '8px'
                }}>
                  잠시만 기다려주세요
                </p>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center'
              }}>
                <button
                  onClick={handleCancelDelete}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#e5e7eb',
                    color: '#374151',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#d1d5db'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                >
                  취소
                </button>
                <button
                  onClick={handleConfirmDelete}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                >
                  삭제하기
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 검증 에러 모달 */}
      {showValidationModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: Z_INDEX.MODAL_OVERLAY
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#dc2626',
                marginBottom: '12px'
              }}>
                입력 정보를 확인해주세요
              </h3>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                lineHeight: '1.6'
              }}>
                아래 항목을 확인하고 다시 시도해주세요.
              </p>
            </div>

            <div style={{
              backgroundColor: '#fee2e2',
              borderLeft: '4px solid #dc2626',
              borderRadius: '8px',
              padding: '16px',
              marginBottom: '24px'
            }}>
              {validationErrors.map((error, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginBottom: index < validationErrors.length - 1 ? '12px' : '0',
                  fontSize: '14px',
                  color: '#374151',
                  lineHeight: '1.6'
                }}>
                  <span style={{
                    color: '#dc2626',
                    fontWeight: '600',
                    marginRight: '8px',
                    flexShrink: 0
                  }}>•</span>
                  <span>{error}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowValidationModal(false)}
              style={{
                width: '100%',
                padding: '12px 24px',
                backgroundColor: '#dc2626',
                color: 'white',
                borderRadius: '8px',
                border: 'none',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Page() {
  return <Reception />;
}
