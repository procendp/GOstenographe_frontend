"use client";
import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useScrollAnimation, useStaggerAnimation } from "../../hooks/useGSAPAnimations";

const faqData = {
  서비스: [
    {
      id: 'service-1',
      question: "소요 시간과 비용이 궁금합니다.",
      answer: "파일의 길이와 난이도에 따라 다르지만, 일반적으로 24시간 이내에 초안 파일을 보내드립니다. 비용은 파일의 길이에 따라 책정됩니다."
    },
    {
      id: 'service-2',
      question: "녹취록을 법원에 제출할 때 증거로써의 효력을 갖추나요?",
      answer: "그렇습니다. 국가공인 자격을 갖춘 속기사가 작성하고 날인한 녹취록은 증거자료나 참고자료로 채택이 가능합니다."
    },
    {
      id: 'service-3',
      question: "회의 내용을 녹취록, 회의록 방식 중 어떤 것으로 하는 게 좋나요?",
      answer: "회의의 성격에 따라 다르지만, 법정 제출용이거나 중요한 회의의 경우 발언 내용을 그대로 담고 있는 녹취록을 추천드립니다."
    },
    {
      id: 'service-4',
      question: "전자소송용 녹취록은 어떻게 제출하나요?",
      answer: "녹취록 최종본 PDF 파일을 보내드립니다. 그 파일을 첨부하시면 됩니다."
    }
  ],
  신청: [
    {
      id: 'apply-1',
      question: "방문 신청 해야 하나요?",
      answer: "온라인으로 스마트폰에서도, PC에서도 24시간 365일 간편하게 신청하실 수 있습니다."
    },
    {
      id: 'apply-2',
      question: "웹사이트에서만 접수 가능한가요?",
      answer: "현재는 웹사이트를 통한 접수만 진행하고 있지만 이용이 어려우신 경우, 고객센터로 연락 주시면 다른 접수 방법을 안내해 드리겠습니다."
    },
    {
      id: 'apply-3',
      question: "파일 용량이 너무 커서 신청할 수 없습니다.",
      answer: "고객센터 메일 주소로 파일과 아래 신청 정보를 적어 보내주시면 확인 후 연락드리겠습니다. 메일 첨부가 어려우신 경우, 카카오톡으로 문의 주시면 별도 업로드 방법을 안내해 드리겠습니다. (하단 고객센터 정보 참고)"
    }
  ],
  결제: [
    {
      id: 'payment-1',
      question: "결제 방식이 어떻게 되나요?",
      answer: "현재는 계좌이체만 가능합니다. (현금영수증 발행 가능)\n서비스 신청을 최종적으로 완료하시면 신청서에 작성하신 메일과 휴대폰 문자로 결제 방식을 안내해 드립니다."
    },
    {
      id: 'payment-2',
      question: "전자세금계산서 발급이 가능한가요?",
      answer: "가능합니다. 사업자등록증을 보내주시면 발급해 드리겠습니다."
    }
  ]
};

// testDocu와 동일한 아래쪽 화살표 아이콘 (정확한 SVG)
const ChevronDownIcon = React.memo(() => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 15C30 18.9782 28.4196 22.7936 25.6066 25.6066C22.7936 28.4196 18.9782 30 15 30C11.0218 30 7.20644 28.4196 4.3934 25.6066C1.58035 22.7936 0 18.9782 0 15C0 11.0218 1.58035 7.20644 4.3934 4.3934C7.20644 1.58035 11.0218 0 15 0C18.9782 0 22.7936 1.58035 25.6066 4.3934C28.4196 7.20644 30 11.0218 30 15ZM15.9375 8.4375C15.9375 8.18886 15.8387 7.9504 15.6629 7.77459C15.4871 7.59877 15.2486 7.5 15 7.5C14.7514 7.5 14.5129 7.59877 14.3371 7.77459C14.1613 7.9504 14.0625 8.18886 14.0625 8.4375L14.0625 19.2994L10.0387 15.2738C9.86271 15.0977 9.62395 14.9988 9.375 14.9988C9.12605 14.9988 8.88729 15.0977 8.71125 15.2738C8.53521 15.4498 8.43632 15.6885 8.43632 15.9375C8.43632 16.1865 8.53521 16.4252 8.71125 16.6012L14.3363 22.2262C14.4233 22.3136 14.5268 22.3828 14.6407 22.4301C14.7546 22.4773 14.8767 22.5017 15 22.5017C15.1233 22.5017 15.2454 22.4773 15.3593 22.4301C15.4732 22.3828 15.5767 22.3136 15.6637 22.2262L21.2887 16.6012C21.4648 16.4252 21.5637 16.1865 21.5637 15.9375C21.5637 15.6885 21.4648 15.4498 21.2887 15.2738C21.1127 15.0977 20.874 14.9988 20.625 14.9988C20.376 14.9988 20.1373 15.0977 19.9613 15.2738L15.9375 19.2994L15.9375 8.4375Z" fill="currentColor"/>
  </svg>
));

ChevronDownIcon.displayName = 'ChevronDownIcon';

// FAQ 아이템 컴포넌트를 메모화
const FAQItem = React.memo<{
  item: { id: string; question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
}>(({ item, isOpen, onToggle }) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    onToggle();
  }, [onToggle]);

  return (
    <div className="faq-item td-faq-item">
      <button
        type="button"
        onClick={handleClick}
        className="td-faq-question"
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${item.id}`}
      >
        <h3 className="td-faq-question-text">
          {item.question}
        </h3>
        <div className={`td-faq-icon ${isOpen ? 'open' : ''}`}>
          <ChevronDownIcon />
        </div>
      </button>
      
      <div 
        id={`faq-answer-${item.id}`}
        className={`td-faq-answer-container ${isOpen ? 'open' : ''}`}
        aria-hidden={!isOpen}
      >
        <div className="td-faq-answer">
          {item.answer.split('\n').map((line, lineIndex) => (
            <React.Fragment key={lineIndex}>
              {line}
              {lineIndex < item.answer.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
});

FAQItem.displayName = 'FAQItem';

// 탭 버튼 컴포넌트를 메모화
const TabButton = React.memo<{
  tab: string;
  isActive: boolean;
  position: 'first' | 'middle' | 'last';
  onClick: () => void;
}>(({ tab, isActive, position, onClick }) => {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    onClick();
  }, [onClick]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`td-faq-tab ${isActive ? 'active' : ''} ${position}`}
      aria-pressed={isActive}
    >
      <div className="td-faq-tab-text">{tab}</div>
    </button>
  );
});

TabButton.displayName = 'TabButton';

export default function FAQSectionV2() {
  const [activeTab, setActiveTab] = useState<keyof typeof faqData>("서비스");
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  // 애니메이션 실행 상태 추적
  const [animationsInitialized, setAnimationsInitialized] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  // GSAP 애니메이션을 한 번만 실행
  useEffect(() => {
    if (animationsInitialized) return;

    const initializeAnimations = async () => {
      // 동적 import로 GSAP 로드
      const { gsap } = await import('gsap');
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      
      if (typeof window !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // 제목 애니메이션
        if (titleRef.current) {
          gsap.fromTo(titleRef.current, 
            { 
              opacity: 0, 
              y: 30 
            }, 
            { 
              opacity: 1, 
              y: 0, 
              duration: 1,
              delay: 0.2,
              ease: "power2.out",
              scrollTrigger: {
                trigger: titleRef.current,
                start: "top 85%",
                once: true // 한 번만 실행
              }
            }
          );
        }

        // 탭 애니메이션
        if (tabsRef.current) {
          gsap.fromTo(tabsRef.current, 
            { 
              opacity: 0, 
              x: -30 
            }, 
            { 
              opacity: 1, 
              x: 0, 
              duration: 0.8,
              delay: 0.4,
              ease: "power2.out",
              scrollTrigger: {
                trigger: tabsRef.current,
                start: "top 85%",
                once: true // 한 번만 실행
              }
            }
          );
        }

        setAnimationsInitialized(true);
      }
    };

    initializeAnimations();
  }, [animationsInitialized]);

  // 탭 변경 핸들러를 메모화
  const handleTabChange = useCallback((tab: keyof typeof faqData) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setOpenItems(new Set()); // 탭 변경 시 모든 아이템 닫기
    }
  }, [activeTab]);

  // FAQ 아이템 토글 핸들러들을 메모화
  const createToggleHandler = useCallback((itemId: string) => {
    return () => {
      setOpenItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(itemId)) {
          newSet.delete(itemId);
        } else {
          newSet.add(itemId);
        }
        return newSet;
      });
    };
  }, []);

  // 현재 탭의 데이터를 메모화
  const currentTabData = useMemo(() => faqData[activeTab], [activeTab]);

  // 탭 목록을 메모화
  const tabs = useMemo(() => Object.keys(faqData), []);

  return (
    <section id="FAQ-Section" className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* 섹션 제목 - 애니메이션 최적화 */}
        <div 
          ref={titleRef} 
          className="text-center mb-16"
          style={{ opacity: animationsInitialized ? 1 : 0 }}
        >
          <div className="text-sm font-bold text-blue-600 mb-4 tracking-widest">F A Q</div>
          <h2 className="text-4xl font-bold text-gray-900 td-font-accent">자주 묻는 질문</h2>
        </div>

        {/* testDocu 스타일 탭 메뉴 - 애니메이션 최적화 */}
        <div 
          ref={tabsRef} 
          className="mb-12 flex justify-center"
          style={{ opacity: animationsInitialized ? 1 : 0 }}
        >
          <div className="td-faq-tabs-container">
            {tabs.map((tab, index) => {
              const position = index === 0 ? 'first' : index === tabs.length - 1 ? 'last' : 'middle';
              return (
                <TabButton
                  key={tab}
                  tab={tab}
                  isActive={activeTab === tab}
                  position={position}
                  onClick={() => handleTabChange(tab as keyof typeof faqData)}
                />
              );
            })}
          </div>
        </div>

        {/* FAQ 아이템들 */}
        <div className="space-y-4">
          {currentTabData.map((item) => (
            <FAQItem
              key={item.id} // 안정적인 ID 사용
              item={item}
              isOpen={openItems.has(item.id)}
              onToggle={createToggleHandler(item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
} 