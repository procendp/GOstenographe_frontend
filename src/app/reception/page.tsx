'use client';

import GNB from '@/components/GNB';
import Footer from '@/components/Footer';
import { useState, useRef, useEffect } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCloudUploadAlt, FaPlus, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { userAgent } from 'next/server';
import OrdererInfoSection from '@/components/OrdererInfoSection';
import RequestInfoSection from '@/components/RequestInfoSection';
import FileUploadSection from '@/components/FileUploadSection';
import { ReceptionFormData } from '@/types/reception';

function Reception() {
  // 1. 타입 정의 및 상태 구조 분리
  // 주문자 정보(공통)
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  // 탭별 파일 및 상세 정보만 관리
  interface TabFileData {
    files: { file: File, file_key: string }[];
    speakerNames: string[];
    selectedDates: string[];
    detail: string;
    speakerCount: number;
    timestamps: string[];
    recordType: '전체' | '부분';
  }
  const getDefaultTabData = (): TabFileData => ({
    files: [],
    speakerNames: [''],
    selectedDates: [],
    detail: '',
    speakerCount: 1,
    timestamps: [],
    recordType: '전체',
  });
  const [tabs, setTabs] = useState<TabFileData[]>([getDefaultTabData()]);
  const [activeTab, setActiveTab] = useState(0);
  const [agree, setAgree] = useState(false);
  const router = useRouter();
  const [requestId, setRequestId] = useState<number|null>(null);
  const [filesData, setFilesData] = useState<any[]>([]);
  const [showComplete, setShowComplete] = useState(false);
  const [openIndexes, setOpenIndexes] = useState([0]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [addressError, setAddressError] = useState('');

  const toggleFile = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx)
        ? prev.filter((i) => i !== idx)
        : [...prev, idx]
    );
  };

  const handleAddDate = () => {
    setTabs(tabs.map(tab => ({
      ...tab,
      selectedDates: [...tab.selectedDates, '']
    })));
  };

  const handleNewRequest = () => {
    setShowComplete(false);
    setTabs([getDefaultTabData()]);
    router.push('/reception');
  };

  // 2. handleFileSelect, handleDrop 등 tabs[activeTab].files만 관리
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const MAX_SIZE = 3 * 1024 * 1024 * 1024; // 3GB
    const oversizedFiles = files.filter(file => file.size > MAX_SIZE);
    if (oversizedFiles.length > 0) {
      alert(`다음 파일의 크기가 3GB를 초과합니다:\n${oversizedFiles.map(f => f.name).join('\n')}`);
      e.target.value = '';
      return;
    }
    const fileObjs: {file: File, file_key: string}[] = [];
    for (const file of files) {
      try {
        const uploadBody = {
          file_name: file.name || 'unknown.txt',
          file_type: file.type || 'application/octet-stream',
          file_size: typeof file.size === 'number' ? file.size : 1,
        };
        const uploadHeaders = { 'Content-Type': 'application/json' };
        const response = await fetch('http://localhost:8000/api/s3/presigned-url/', {
          method: 'POST',
          headers: uploadHeaders,
          body: JSON.stringify(uploadBody),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Presigned URL 요청 실패');
        }
        const data = await response.json();
        let file_key = data.file_key || data.key || data.s3_key || (data.presigned_post && data.presigned_post.fields && data.presigned_post.fields.key);
        console.log('[DEBUG] presigned-url 응답:', data);
        console.log('[DEBUG] presigned-url file_key:', file_key);
        if (!file_key) file_key = file.name;
        if (data.presigned_post) {
          const formData = new FormData();
          Object.entries(data.presigned_post.fields).forEach(([key, value]) => {
            formData.append(key, value as string);
          });
          formData.append('file', file);
          const uploadResponse = await fetch(data.presigned_post.url, {
            method: 'POST',
            body: formData
          });
          if (!uploadResponse.ok) throw new Error('파일 업로드 실패');
        } else if (data.upload_url) {
          const uploadResponse = await fetch(data.upload_url, {
            method: 'PUT',
            body: file
          });
          if (!uploadResponse.ok) throw new Error('파일 업로드 실패');
        } else {
          alert('presigned_post 구조 오류: ' + JSON.stringify(data));
          return;
        }
        fileObjs.push({file, file_key});

        // 파일 업로드 성공 후 requestId가 없으면 생성
        if (!requestId) {
          try {
            const requestResponse = await fetch('http://localhost:8000/api/requests/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                name: customerName || '임시 신청자',
                email: customerEmail || 'temp@example.com',
                phone: customerPhone || '01000000000',
                address: customerAddress || '임시 주소'
              })
            });
            if (requestResponse.ok) {
              const requestData = await requestResponse.json();
              setRequestId(requestData.id);
            }
          } catch (error) {
            console.error('임시 request 생성 실패:', error);
          }
        }
      } catch (error) {
        console.error('파일 업로드 중 오류 발생(try-catch):', error);
        alert(error instanceof Error ? error.message : '파일 업로드에 실패했습니다.');
      }
    }
    setTabs(tabs => tabs.map((tab, idx) => idx === activeTab ? {...tab, files: fileObjs} : tab));
    console.log('[DEBUG] 업로드 후 tabs[activeTab].files:', fileObjs);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    setTabs(tabs => tabs.map((tab, idx) => idx === activeTab ? {...tab, files: files.map(file => ({file, file_key: ''}))} : tab));
  };

  const Stepper = ({ step }: { step: number }) => (
    <div className="w-full flex flex-col items-center pt-16 pb-12">
      <h1 className="text-4xl font-bold text-[#222] mb-12 tracking-tight">서비스 신청</h1>
      <div className="flex items-center justify-center w-full max-w-3xl">
        <div className="flex flex-col items-center flex-1">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mb-2">
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
          </div>
          <span className="text-lg font-bold text-[#222]">신청서 작성</span>
          <span className="text-sm text-gray-500 mt-1">파일과 정보를<br/>입력해 주세요.</span>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full h-0.5 border-dotted border-b-2 border-blue-300 mx-2" style={{borderStyle:'dotted'}}></div>
        </div>
        <div className="flex flex-col items-center flex-1">
          <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center mb-2">
            <div className="w-4 h-4 bg-blue-200 rounded-full"></div>
          </div>
          <span className="text-lg font-bold text-gray-400">제출 완료</span>
          <span className="text-sm text-gray-400 mt-1">신청 정보를<br/>확인해 주세요.</span>
        </div>
      </div>
    </div>
  );

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (requestId) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };
    const handleRouteChange = async (url: string) => {
      if (requestId) {
        const confirmed = window.confirm('입력 중인 정보가 모두 삭제됩니다. 정말 나가시겠습니까?');
        if (confirmed) {
          await fetch(`http://localhost:8000/api/requests/${requestId}/`, { method: 'DELETE' });
        } else {
          throw '이동 취소';
        }
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    // Next.js 라우터 이동 감지(예시, 실제 라우터에 맞게 조정 필요)
    // router.events.on('routeChangeStart', handleRouteChange);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [requestId]);

  // 4. isFormValid: tabs의 모든 files, 주문자 정보 등 검증
  const isFormValid = () => {
    const phoneValid = validatePhone(customerPhone);
    const emailValid = validateEmail(customerEmail);
    const addressValid = validateAddress(customerAddress);
    const speakerValid = tabs[activeTab].speakerNames.every((name) => validateSpeakerName(name));
    const fileValid = tabs.every(tab => tab.files && tab.files.length > 0);
    const nameValid = customerName.trim() !== '';
    const agreeValid = agree;
    const speakerCountValid = tabs[activeTab].speakerCount > 0;
    console.log('isFormValid 조건별:', {
      fileValid, speakerCountValid, speakerValid, nameValid, phoneValid, emailValid, addressValid, agreeValid,
      tabs, speakerNames: tabs[activeTab].speakerNames, customerName, customerPhone, customerEmail, customerAddress, agree
    });
    return (
      fileValid &&
      speakerCountValid &&
      speakerValid &&
      nameValid &&
      phoneValid &&
      emailValid &&
      addressValid &&
      agreeValid
    );
  };

  // 5. handleSubmit: 주문자 정보는 공통 상태, 파일 정보는 tabs에서 합쳐서 전송
  const handleSubmit = async () => {
    let newRequestId = null;
    try {
      // 1. 신청서 생성
      const response = await fetch('http://localhost:8000/api/requests/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          address: customerAddress
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('신청서 생성 실패:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData
        });
        throw new Error(`신청서 생성 실패: ${errorData.detail || errorData.message || JSON.stringify(errorData)}`);
      }
      
      const data = await response.json();
      newRequestId = data.id;
      setRequestId(data.id);
      
      // 2. 모든 탭의 파일 정보 DB 등록
      for (const tab of tabs) {
        for (const {file, file_key} of tab.files || []) {
          const fileResponse = await fetch(`http://localhost:8000/api/requests/${data.id}/upload_file/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              file_name: file.name,
              file_size: file.size,
              file_type: file.type,
              file_key: file_key
            })
          });
          
          if (!fileResponse.ok) {
            const fileErrorData = await fileResponse.json();
            console.error('파일 정보 등록 실패:', {
              status: fileResponse.status,
              statusText: fileResponse.statusText,
              error: fileErrorData,
              file: file.name
            });
            throw new Error(`파일 정보 등록 실패 (${file.name}): ${fileErrorData.detail || fileErrorData.message || JSON.stringify(fileErrorData)}`);
          }
        }
      }
      // 3. 정식 신청(임시 → 정식 전환)
      await fetch(`http://localhost:8000/api/requests/${newRequestId}/submit/`, {
        method: 'POST',
      });
    } catch (error) {
      console.error('서비스 신청 중 오류 발생:', error);
      alert(error instanceof Error ? error.message : '서비스 신청에 실패했습니다.');
      return;
    }
    setShowComplete(true);
    console.log('버튼 렌더링 시 isFormValid:', isFormValid());
  };

  // 파일 리스트 UI
  const renderFileList = () => (
    <div className="mt-4">
      <h4 className="font-bold mb-2">업로드된 파일</h4>
      {filesData.length === 0 ? (
        <div className="text-gray-400 text-sm">업로드된 파일이 없습니다.</div>
      ) : (
        <ul className="space-y-2">
          {filesData.map((file, idx) => (
            <li key={idx} className="flex items-center space-x-2">
              <a href={file.presigned_url || file.file} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                {file.original_name || file.file.split('/').pop()}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // 탭 전환
  const handleTabClick = (idx: number) => {
    setActiveTab(idx);
    console.log('activeTab:', idx);
  };

  // 3. handleAddTab, handleRemoveTab 등 tabs만 관리
  const handleAddTab = () => {
    if (tabs.length >= 5) return;
    setTabs([...tabs, getDefaultTabData()]);
    setActiveTab(tabs.length); // 새 탭으로 이동
    setTimeout(() => console.log('activeTab:', tabs.length), 0);
  };

  const handleRemoveTab = async (idx: number) => {
    if (tabs.length === 1) return;
    
    // 디버깅 로그 추가
    console.log('[DEBUG] handleRemoveTab 호출 idx:', idx);
    console.log('[DEBUG] 현재 requestId:', requestId);
    console.log('[DEBUG] tabs[idx].files:', tabs[idx]?.files);
    
    if (tabs[idx].files.length > 0) {
      console.log('[DEBUG] 파일 삭제 for문 진입');
      try {
        // 각 파일에 대해 삭제 API 호출
        for (const {file_key} of tabs[idx].files) {
          console.log('[DEBUG] 탭 삭제 시 DELETE 요청 file_key:', file_key);
          let deleted = false;
          if (requestId) {
            const response = await fetch(`http://localhost:8000/api/requests/${requestId}/delete_file/`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ file_key })
            });
            if (response.ok) {
              deleted = true;
            } else if (response.status === 404) {
              // DB에 파일이 없을 때 S3 직접 삭제로 fallback
              console.warn('[WARN] DB에 파일 없음, S3 직접 삭제 시도:', file_key);
              const s3Response = await fetch('http://localhost:8000/api/s3/delete/', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ file_key })
              });
              if (!s3Response.ok) {
                throw new Error('S3 파일 삭제 실패');
              }
              deleted = true;
            } else {
              throw new Error('파일 삭제 실패');
            }
          } else {
            // requestId가 없는 경우 S3에서 직접 삭제
            const response = await fetch('http://localhost:8000/api/s3/delete/', {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ file_key })
            });
            if (!response.ok) {
              throw new Error('S3 파일 삭제 실패');
            }
            deleted = true;
          }
        }
        // 파일 목록 업데이트
        if (requestId) {
          const filesResponse = await fetch(`http://localhost:8000/api/requests/${requestId}/files/`);
          if (filesResponse.ok) {
            const updatedFilesData = await filesResponse.json();
            setFilesData(updatedFilesData);
          }
        }
      } catch (error) {
        console.error('파일 삭제 중 오류 발생:', error);
        alert('파일 삭제에 실패했습니다.');
        return;
      }
    } else {
      console.log('[DEBUG] 파일 삭제 for문 진입 조건 불충족');
    }
    const newTabs = tabs.filter((_, i) => i !== idx);
    setTabs(newTabs);
    if (activeTab === idx) {
      setActiveTab(Math.max(0, idx - 1));
      setTimeout(() => console.log('activeTab:', Math.max(0, idx - 1)), 0);
    } else if (activeTab > idx) {
      setActiveTab(activeTab - 1);
      setTimeout(() => console.log('activeTab:', activeTab - 1), 0);
    }
  };

  // 탭별 데이터 변경
  const setTabData = (data: TabFileData | ((prev: TabFileData) => TabFileData)) => {
    setTabs(tabs => tabs.map((tab, i) =>
      i === activeTab
        ? (typeof data === 'function' ? (data as (prev: TabFileData) => TabFileData)(tab) : data)
        : tab
    ));
  };

  // 하단 고정 영역에서 사용할 예시 계산값
  const estimate = 90000 + 10000; // 예시

  // 유효성 검사 함수 재정의
  const validatePhone = (phone: string) => /^\d{10,11}$/.test(phone);
  const validateEmail = (email: string) => email.includes('@') && email.includes('.') && email.indexOf('@') < email.lastIndexOf('.') && email.length > 5;
  const validateAddress = (address: string) => /^[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s]{5,}$/.test(address.trim());
  const validateSpeakerName = (name: string) => /^[A-Za-z0-9가-힣ㄱ-ㅎㅏ-ㅣ]{2,}$/.test(name.trim());

  // 탭 렌더링 부분 예시 (탭 스타일 커스텀)
  const renderTabs = () => (
    <div className="flex items-end gap-0 mb-4">
      {tabs.map((tab, idx) => (
        <button
          key={idx}
          className={`px-6 py-2 border-t border-l border-r rounded-t-lg text-base focus:outline-none transition-all
            ${activeTab === idx ? 'bg-blue-600 text-white border-blue-600 z-10' : 'bg-white text-gray-700 border-gray-200'}
            ${idx === 0 ? 'rounded-l-lg' : ''}
            ${idx === tabs.length - 1 ? 'rounded-r-lg' : ''}
          `}
          onClick={() => setActiveTab(idx)}
        >
          파일 {idx + 1}
        </button>
      ))}
      <button
        className="px-4 py-2 border-t border-l border-r rounded-t-lg bg-white text-blue-600 border-gray-200 text-xl focus:outline-none"
        onClick={handleAddTab}
      >
        +
      </button>
    </div>
  );

  // 삭제 버튼 스타일 적용 예시
  const renderDeleteButton = (idx: number) => (
    <button
      className="ml-2 px-4 py-1 rounded bg-[#ff9800] text-white font-semibold hover:bg-orange-500 transition"
      onClick={() => handleRemoveTab(idx)}
    >
      삭제
    </button>
  );

  return showComplete ? (
    // Webflow 스타일 제출 완료 페이지
    // 더미 파일 데이터
    <div className="min-h-screen bg-[#F8FAFC] pt-20">
      <GNB />
      <div className="w-full max-w-[960px] mx-auto pt-12 pb-0 px-4 sm:px-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-900 mb-12">서비스 신청</h1>
        <div className="flex justify-center items-center mb-12">
          <div className="flex flex-col items-center flex-1">
            <div className="w-6 h-6 rounded-full bg-blue-500 mb-2"></div>
            <span className="text-base font-bold text-gray-500">신청서 작성</span>
            <span className="text-xs text-gray-400 mt-1">파일과 정보를 입력해 주세요.</span>
          </div>
          <div className="flex-1 h-1 bg-blue-100 mx-2 relative flex items-center">
            <div className="w-full h-1 border-dashed border-b-2 border-blue-400"></div>
          </div>
          <div className="flex flex-col items-center flex-1">
            <div className="w-6 h-6 rounded-full bg-blue-500 mb-2"></div>
            <span className="text-base font-bold text-gray-900">제출 완료</span>
            <span className="text-xs text-gray-400 mt-1">접수된 신청 정보를 확인해 주세요.</span>
          </div>
        </div>
      </div>
      <main className="w-full min-h-screen flex flex-col items-center bg-white py-0 px-0">
        <div className="w-full max-w-[960px] mx-auto pt-0 pb-12 px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
              감사합니다. 정상 접수되었습니다.
            </h2>
            <div className="text-lg sm:text-xl font-bold leading-normal">
              <span className="text-blue-500">작업 가능 여부 확인 후</span>
              <span className="text-gray-900"> 비용 안내드리겠습니다.</span>
            </div>
            <p className="text-xs sm:text-sm text-red-500 mt-2">
              * 작업 순서에 따라 안내가 지연될 수 있습니다.
            </p>
          </div>
          {/* 예상 견적 박스 */}
          <div className="w-full max-w-[960px] mx-auto rounded-2xl bg-blue-500 flex flex-row items-center justify-between px-8 py-6 mb-10">
            <div className="font-extrabold text-white text-lg sm:text-2xl">예상 견적</div>
            <div className="font-extrabold text-white text-lg sm:text-2xl">100,000원</div>
          </div>
          {/* 서비스 신청 내역 */}
          <div className="w-full max-w-[960px] mx-auto bg-white rounded-2xl shadow-[0_4px_24px_0_rgba(0,0,0,0.04)] p-0 mb-10 border border-[#F1F3F5]">
            <h3 className="text-xl font-bold text-[#222] mb-4 px-8 pt-8">서비스 신청 내역</h3>
            <div className="space-y-3 px-8 pb-8">
              {filesData.map((file, idx) => (
                <div key={idx} className="rounded-xl border border-[#E5E7EB] overflow-hidden">
                  <button
                    className="w-full flex justify-between items-center px-6 py-5 focus:outline-none text-left group bg-blue-100"
                    onClick={() => toggleFile(idx)}
                  >
                    <span className="font-bold text-[#222]">파일 {idx + 1}</span>
                    <span className="flex-1"></span>
                    <svg className={`w-6 h-6 ml-2 transition-transform duration-200 ${openIndexes.includes(idx) ? 'rotate-180' : ''} text-[#B0B8C1] group-hover:text-blue-600`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {openIndexes.includes(idx) && (
                    <div className="pb-6 pt-2 text-base text-[#222]">
                      {[
                        { label: '첨부 파일', value: file.name },
                        { label: '녹취 종류', value: file.type },
                        { label: '구간', value: file.ranges.map((r: any) => <span key={r} className="block ml-0">{r}</span>) },
                        { label: '화자 정보', value: file.speakers },
                        { label: '녹음 일시', value: file.date },
                        { label: '상세 정보', value: file.detail },
                        { label: '열람 파일 형식', value: file.format },
                        { label: '최종본 옵션', value: file.option },
                      ].map((item, i) => (
                        <div key={item.label} className={`flex px-8 py-3 ${i % 2 === 0 ? 'bg-gray-200' : 'bg-white'} items-start`}>
                          <span className="w-32 text-gray-700 flex-shrink-0">{item.label}</span>
                          <span className="flex-1 text-gray-900">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          {/* 주문자 정보 */}
          <div className="w-full max-w-[960px] mx-auto bg-white rounded-2xl shadow-[0_4px_24px_0_rgba(0,0,0,0.04)] p-0 mb-10 border border-[#F1F3F5]">
            <h3 className="text-xl font-bold text-[#222] mb-4 px-8 pt-8">주문자 정보</h3>
            <div>
              {[
                { label: '성함', value: '신청자' },
                { label: '연락처', value: '010-0000-0000' },
                { label: '이메일', value: 'client@thank.you' },
                { label: '주소', value: '서울특별시 마포구 마포로롱 293-11, 1004호' },
              ].map((item, idx) => (
                <div key={item.label} className={`flex px-8 py-3 ${idx % 2 === 0 ? 'bg-gray-200' : 'bg-white'} items-start`}>
                  <span className="w-32 text-gray-700 flex-shrink-0">{item.label}</span>
                  <span className="flex-1 text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={handleNewRequest}
            className="w-full max-w-[960px] mx-auto py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-bold mt-8 text-lg shadow transition-colors duration-200"
          >
            새로운 서비스 신청
          </button>
        </div>
      </main>
      <Footer />
    </div>
  ) : (
    <div className="flex flex-col min-h-screen bg-[#F6F8FB]">
      <GNB />
      <div className="max-w-5xl w-full mx-auto flex-1 pb-40" style={{ paddingTop: '80px' }}>
        {/* 탭 UI */}
        <div className="flex items-center pt-8 pb-0">
          <div className="flex flex-row flex-1 items-center">
            {renderTabs()}
          </div>
          {tabs.length > 1 && renderDeleteButton(activeTab)}
        </div>
        {/* 탭별 세트: 파일 업로드/주문자 정보/신청 정보 */}
        <div className="bg-[#D0E3FF] rounded-2xl p-8 mb-8">
          {/* 유의사항 */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-blue-700 mb-2">유의사항</h3>
            <ul className="text-gray-700 text-sm list-disc pl-5 space-y-1">
              <li>음성 파일의 녹음 상태로 인해 신청이 반려될 수 있습니다.</li>
              <li>작업 순서에 따라 안내가 지연될 수 있습니다.</li>
              <li>작업 과정에서 추가 화자가 확인되는 경우 등 화자수에 따라 추가 요금이 청구될 수 있습니다.</li>
              <li>상단 더하기(+) 버튼을 눌러 최대 5개의 파일을 한 번에 등록할 수 있습니다.</li>
            </ul>
          </div>
          {/* 파일 업로드 */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-blue-700 mb-4">파일 업로드</h3>
            <FileUploadSection
              formData={tabs[activeTab] as any}
              setFormData={data => setTabs(tabs => tabs.map((tab, idx) => idx === activeTab ? { ...tab, ...data } : tab))}
              onFileSelect={handleFileSelect}
            />
          </div>
          {/* 신청 정보 */}
          <div>
            <h3 className="text-xl font-bold text-blue-700 mb-4">신청 정보</h3>
            <RequestInfoSection
              formData={tabs[activeTab] as any}
              setFormData={data => setTabs(tabs => tabs.map((tab, idx) => idx === activeTab ? { ...tab, ...data } : tab))}
            />
          </div>
        </div>
        {/* 주문 정보(공용) 섹션 */}
        <div className="w-full flex justify-center py-12">
          <div className="max-w-5xl w-full bg-[#E9ECF1] rounded-2xl p-10 space-y-8">
            <div className="mb-8">
              <span className="text-2xl font-bold text-gray-900">주문 정보</span>
            </div>
            {/* 열람 파일 형식 */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-bold mr-2">열람 파일 형식</h2>
                <span className="bg-red-100 text-red-500 text-xs font-bold px-2 py-1 rounded ml-2">필수</span>
              </div>
              <p className="text-gray-600 mb-4">속기 초안 완성 후 확인을 위해 고객님 메일로 발송해 드립니다. 열람하기 편한 파일 형식을 선택해 주세요.</p>
              <div className="flex flex-wrap gap-8">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="fileFormat" value="hwp" className="accent-blue-500" />
                  <span>한글(.hwp)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="fileFormat" value="docx" className="accent-blue-500" />
                  <span>워드(.docx)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="fileFormat" value="txt" className="accent-blue-500" />
                  <span>텍스트(.txt)</span>
                </label>
              </div>
            </div>
            {/* 최종본 옵션 */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-bold mr-2">최종본 옵션</h2>
                <span className="bg-red-100 text-red-500 text-xs font-bold px-2 py-1 rounded ml-2">필수</span>
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="finalOption" value="file" className="accent-blue-500" />
                  <span>파일</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="finalOption" value="file+post" className="accent-blue-500" />
                  <span>파일 +등기 우편 (+5,000원)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="finalOption" value="file+cd" className="accent-blue-500" />
                  <span>파일 +등기 우편+CD (+6,000원)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="finalOption" value="file+usb" className="accent-blue-500" />
                  <span>파일 +등기 우편+USB (+10,000원)</span>
                </label>
              </div>
            </div>
            {/* 주문자 정보 */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-bold mr-2">주문자 정보</h2>
                <span className="bg-red-100 text-red-500 text-xs font-bold px-2 py-1 rounded ml-2">필수</span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <FaUser className="text-gray-400 w-5 h-5" />
                  <input type="text" placeholder="신청인 성함" className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={customerName} onChange={e => {
                    setCustomerName(e.target.value);
                    console.log('customerName:', e.target.value);
                  }} />
                </div>
                <div className="flex items-center gap-4">
                  <FaPhone className="text-gray-400 w-5 h-5" />
                  <input type="tel" placeholder="연락처 (숫자만, 10~11자리)" className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={customerPhone} onChange={e => {
                    // 숫자만 입력 허용
                    const onlyNum = e.target.value.replace(/[^0-9]/g, '');
                    setCustomerPhone(onlyNum);
                    if (!validatePhone(onlyNum)) {
                      setPhoneError('숫자만 입력, 10~11자리여야 합니다.');
                    } else {
                      setPhoneError('');
                    }
                    console.log('customerPhone:', onlyNum);
                  }} />
                  {phoneError && <span className="text-red-500 text-xs ml-2">{phoneError}</span>}
                </div>
                <div className="flex items-center gap-4">
                  <FaEnvelope className="text-gray-400 w-5 h-5" />
                  <input type="email" placeholder="이메일 (example@email.com)" className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={customerEmail} onChange={e => {
                    setCustomerEmail(e.target.value);
                    if (!validateEmail(e.target.value)) {
                      setEmailError('이메일 형식이 올바르지 않습니다.');
                    } else {
                      setEmailError('');
                    }
                    console.log('customerEmail:', e.target.value);
                  }} />
                  {emailError && <span className="text-red-500 text-xs ml-2">{emailError}</span>}
                </div>
                <div className="flex items-center gap-4">
                  <FaMapMarkerAlt className="text-gray-400 w-5 h-5" />
                  <input type="text" placeholder="주소 (최종본 수령지, 5자 이상)" className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={customerAddress} onChange={e => {
                    setCustomerAddress(e.target.value);
                    if (!validateAddress(e.target.value)) {
                      setAddressError('주소를 5자 이상 입력하세요.');
                    } else {
                      setAddressError('');
                    }
                    console.log('customerAddress:', e.target.value);
                  }} />
                  {addressError && <span className="text-red-500 text-xs ml-2">{addressError}</span>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 하단 고정 영역 - 견적 상세+합계+약관동의+신청 버튼 */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-blue-200 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between py-6 px-8">
          {/* 견적 설명 및 합계 */}
          <div className="flex-1 flex items-center">
            <div>
              <div className="font-bold text-lg mb-1">예상 견적</div>
              <div className="text-sm text-gray-600">
                - 속기록 제작 (60분) 90,000원<br/>
                - 최종본 옵션(파일+등기우편+USB) 10,000원
              </div>
            </div>
            <div className="font-extrabold text-2xl text-blue-700 ml-8">{estimate.toLocaleString()}원</div>
          </div>
          {/* 약관동의+신청 버튼 */}
          <div className="flex items-center space-x-4 ml-8">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                className="mr-2 accent-blue-500"
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
              />
              서비스 이용약관에 동의합니다.
            </label>
            <button
              className="px-8 py-3 rounded-lg bg-blue-500 text-white font-bold disabled:bg-blue-200"
              disabled={!isFormValid()}
              onClick={handleSubmit}
            >
              서비스 신청
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <Reception />;
} 