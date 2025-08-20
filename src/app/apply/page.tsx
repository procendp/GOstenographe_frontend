'use client';

import GNB from '@/components/GNB';
import Footer from '@/components/Footer';
import { useState, useRef, useEffect } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import OrdererInfoSection from '@/components/OrdererInfoSection';
import RequestInfoSection from '@/components/RequestInfoSection';
import FileUploadSection from '@/components/FileUploadSection';
import { ReceptionFormData } from '@/types/reception';


function Reception() {
  // 기본 상태들
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [tabs, setTabs] = useState([{ files: [] as { file: File, file_key: string }[], speakerNames: [''], selectedDates: [] as string[], detail: '', speakerCount: 1, timestamps: [] as string[], recordType: '전체' as '전체' | '부분' }]);
  const [activeTab, setActiveTab] = useState(0);
  const [agree, setAgree] = useState(false);
  const router = useRouter();
  const [requestId, setRequestId] = useState<number|null>(null);
  const [filesData, setFilesData] = useState<any[]>([]);
  const [showComplete, setShowComplete] = useState(false);
  const [openIndexes, setOpenIndexes] = useState([0]);
  const [phoneError, setPhoneError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [addressError, setAddressError] = useState('');

  // 기본 함수들
  const handleNewRequest = () => {
    setShowComplete(false);
    setTabs([{ files: [], speakerNames: [''], selectedDates: [], detail: '', speakerCount: 1, timestamps: [], recordType: '전체' }]);
    router.push('/apply');
  };

  const handleAddTab = () => {
    if (tabs.length >= 5) return;
    setTabs([...tabs, { files: [], speakerNames: [''], selectedDates: [], detail: '', speakerCount: 1, timestamps: [], recordType: '전체' }]);
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
    setTabs(tabs => tabs.map((tab, idx) => idx === activeTab ? {...tab, files: files.map(file => ({file, file_key: ''}))} : tab));
  };

  const toggleFile = (idx: number) => {
    setOpenIndexes((prev) =>
      prev.includes(idx)
        ? prev.filter((i) => i !== idx)
        : [...prev, idx]
    );
  };

  // 스텝 인디케이터
  const Stepper = ({ step }: { step: number }) => (
    <div className="flex items-center justify-center w-full">
      <div className="flex items-center justify-center w-full max-w-3xl">
        <div className="flex flex-col items-center flex-1">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 ${
            step >= 1 ? 'bg-blue-600' : 'bg-gray-300'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              step >= 1 ? 'bg-blue-600' : 'bg-gray-300'
            }`}></div>
          </div>
          <h5 className={`text-base font-bold mb-1 ${
            step >= 1 ? 'text-gray-900' : 'text-gray-400'
          }`}>신청서 작성</h5>
          <p className={`text-sm text-center ${
            step >= 1 ? 'text-gray-700' : 'text-gray-400'
          }`}>
            파일과 정보를<br/>입력해 주세요.
          </p>
        </div>
        
        <div className="flex items-center justify-center px-4 py-0">
          <div className="w-full h-0 flex justify-center items-center" style={{ height: '10px', marginBottom: '0', marginLeft: '0', marginRight: '0' }}>
            <div 
              className={`w-full h-0 ${
                step >= 2 ? 'border-blue-400' : 'border-blue-300'
              }`}
              style={{
                borderStyle: 'none none dotted',
                borderWidth: '5px',
                borderBottomColor: step >= 2 ? '#60a5fa' : '#93c5fd'
              }}
            ></div>
          </div>
        </div>
        
        <div className="flex flex-col items-center flex-1">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center mb-2 ${
            step >= 2 ? 'bg-blue-600' : 'bg-gray-300'
          }`}>
            <div className={`w-3 h-3 rounded-full ${
              step >= 2 ? 'bg-blue-600' : 'bg-gray-300'
            }`}></div>
          </div>
          <h5 className={`text-base font-bold mb-1 ${
            step >= 2 ? 'text-gray-900' : 'text-gray-400'
          }`}>제출 완료</h5>
          <p className={`text-sm text-center ${
            step >= 2 ? 'text-gray-700' : 'text-gray-400'
          }`}>
            신청 정보를<br/>확인해 주세요.
          </p>
        </div>
      </div>
    </div>
  );

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
    if (!isFormValid()) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    try {
      const formData = {
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        customer_address: customerAddress,
        tabs: tabs.map(tab => ({
          files: tab.files.map(f => f.file_key),
          speaker_names: tab.speakerNames,
          selected_dates: tab.selectedDates,
          detail: tab.detail,
          speaker_count: tab.speakerCount,
          timestamps: tab.timestamps,
          record_type: tab.recordType,
        })),
      };

      const response = await fetch('http://localhost:8000/api/reception/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        setRequestId(result.id);
        setShowComplete(true);
        setFilesData(tabs.map(tab => ({
          name: tab.files.map(f => f.file.name).join(', '),
          type: tab.recordType,
          ranges: tab.timestamps,
          speakers: tab.speakerNames.join(', '),
          date: tab.selectedDates.join(', '),
          detail: tab.detail,
          format: 'hwp',
          option: 'file+usb',
        })));
      } else {
        const errorData = await response.json();
        alert(`신청 실패: ${errorData.error || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('신청 처리 중 오류:', error);
      alert('신청 처리 중 오류가 발생했습니다.');
    }
  };

  return showComplete ? (
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
          <div className="w-full max-w-[960px] mx-auto rounded-2xl bg-blue-500 flex flex-row items-center justify-between px-8 py-6 mb-10">
            <div className="font-extrabold text-white text-lg sm:text-2xl">예상 견적</div>
            <div className="font-extrabold text-white text-lg sm:text-2xl">100,000원</div>
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
    <div className="flex flex-col min-h-screen" style={{
      backgroundColor: '#cad5e5',
      backgroundImage: 'url(/new_goStenographe_resource/backgrounds/Background-Blue20-s.png)',
      backgroundPosition: '0 0',
      backgroundSize: 'auto'
    }}>
      <GNB />
      <section className="c-apply-section">
        <div className="c-apply-container">
          <div className="w-layout-vflex apply-title-wrapper">
            <div className="f-margin-bottom-0">
              <div id="cs" className="c-apply-title-wrapper">
                <div className="f-margin-bottom-73 f-text-weight-bold"></div>
                <h2 className="c-section-heading">서비스 신청</h2>
              </div>
            </div>
            <div className="c-step-component">
              <div className="c-steps-grid">
                <div id="w-node-da8c1f2a-0e82-b3e2-52b2-200bd7cf58ab-7a47d824" className="c-steps-item">
                  <div className="c-steps-dot current"></div>
                  <h5 className="c-step-title">신청서 작성</h5>
                  <p className="c-steps-sub-title">파일과 정보를<br/>입력해 주세요.</p>
                </div>
                <div className="c-steps-line">
                  <div className="c-steps-line-dot ongoing"></div>
                </div>
                <div className="c-steps-item">
                  <div className="c-steps-dot"></div>
                  <h5 className="c-step-title hold">제출 완료</h5>
                  <p className="c-steps-sub-title hold">신청 정보를<br/>확인해 주세요.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div data-duration-in="300" data-duration-out="100" data-current="파일 1" data-easing="ease" className="c-tab-container w-tabs">
            <div className="c-tab-menu w-tab-menu">
              {renderTabs()}
            </div>
            
            <div className="c-tab-content w-tab-content">
              <div className="c-tab-pane">
                <div className="c-file-title-block">
                  <h2 className="c-file-heading">유의사항</h2>
                  <p className="c-paragraph-title">- 음성 파일의 녹음 상태로 인해 신청이 반려될 수 있습니다.<br/>- 작업 순서에 따라 안내가 지연될 수 있습니다.<br/>- 작업 과정에서 추가 화자가 확인되는 경우 등 화자수에 따라 추가 요금이 청구될 수 있습니다.<br/>- 상단 더하기(+) 버튼을 눌러 최대 5개의 파일을 한 번에 등록할 수 있습니다.</p>
                </div>
                
                <div className="c-file-block">
                  <div className="w-layout-hflex c-file-block-title">
                    <h2 className="c-file-block-heading">파일 업로드</h2>
                    <div className="c-file-block-title-tag">
                      <div className="c-tag-text">필수</div>
                    </div>
                  </div>
                  <p className="c-paragraph-caution">* 첨부 가능한 파일 형식<br/>- 영상 : mp3, wav, m4a, cda, mod, ogg, wma, flac, asf<br/>- 음성 : avi, mp4, asf, wmv, m2v, mpeg, dpg, mts, webm, divx, amv</p>
                  <FileUploadSection
                    formData={tabs[activeTab] as any}
                    setFormData={data => setTabs(tabs => tabs.map((tab, idx) => idx === activeTab ? { ...tab, ...data } : tab))}
                    onFileSelect={handleFileSelect}
                  />
                </div>
                
                <div className="c-file-block">
                  <div className="w-layout-hflex c-file-block-title">
                    <h2 className="c-file-block-heading">신청 정보</h2>
                    <div className="c-file-block-title-tag">
                      <div className="c-tag-text">필수</div>
                    </div>
                  </div>
                  <RequestInfoSection
                    formData={tabs[activeTab] as any}
                    setFormData={data => setTabs(tabs => tabs.map((tab, idx) => idx === activeTab ? { ...tab, ...data } : tab))}
                  />
                </div>
                
                <div className="w-full flex justify-center py-12">
                  <div className="max-w-5xl w-full bg-[#E9ECF1] rounded-2xl p-10 space-y-8">
                    <div className="mb-8">
                      <span className="text-2xl font-bold text-gray-900">주문 정보</span>
                    </div>
                    
                    <div className="bg-white rounded-xl p-8 shadow-sm">
                      <div className="flex items-center mb-4">
                        <h2 className="text-xl font-bold mr-2">주문자 정보</h2>
                        <span className="bg-red-100 text-red-500 text-xs font-bold px-2 py-1 rounded ml-2">필수</span>
                      </div>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <FaUser className="text-gray-400 w-5 h-5" />
                          <input type="text" placeholder="신청인 성함" className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                        </div>
                        <div className="flex items-center gap-4">
                          <FaPhone className="text-gray-400 w-5 h-5" />
                          <input type="tel" placeholder="연락처 (숫자만, 10~11자리)" className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" value={customerPhone} onChange={e => {
                            const onlyNum = e.target.value.replace(/[^0-9]/g, '');
                            setCustomerPhone(onlyNum);
                            if (!validatePhone(onlyNum)) {
                              setPhoneError('숫자만 입력, 10~11자리여야 합니다.');
                            } else {
                              setPhoneError('');
                            }
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
                          }} />
                          {addressError && <span className="text-red-500 text-xs ml-2">{addressError}</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-blue-200 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between py-6 px-8">
          <div className="flex-1 flex items-center">
            <div>
              <div className="font-bold text-lg mb-1">예상 견적</div>
              <div className="text-sm text-gray-600">
                - 속기록 제작 (60분) 90,000원<br/>
                - 최종본 옵션(파일+등기우편+USB) 10,000원
              </div>
            </div>
            <div className="font-extrabold text-2xl text-blue-700 ml-8">100,000원</div>
          </div>
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
