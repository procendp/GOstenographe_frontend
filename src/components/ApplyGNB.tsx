"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Z_INDEX } from "@/constants/zIndex";

interface ApplyGNBProps {
  uploadedFiles?: Array<{ file_key: string; file: File }>;
  onNavigateAway?: () => Promise<void>;
  showComplete?: boolean;
}

export default function ApplyGNB({ uploadedFiles = [], onNavigateAway, showComplete = false }: ApplyGNBProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // 삭제 중일 때 페이지 이탈 방지
  useEffect(() => {
    if (isDeleting) {
      const blockExit = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };

      window.addEventListener('beforeunload', blockExit);
      return () => window.removeEventListener('beforeunload', blockExit);
    }
  }, [isDeleting]);

  // 스크롤 방향 감지 및 GNB 숨김/표시 로직
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 스크롤 다운 - GNB 숨기기
        setIsVisible(false);
      } else if (currentScrollY <= 100) {
        // 페이지 최상단 근처(100px 이하)에 도착했을 때만 - GNB 보이기
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { href: "/", text: "주요 서비스" },
    { href: "/", text: "자주 묻는 질문" },
    { href: "/", text: "고객센터" }
  ];

  // 파일이 업로드된 상태인지 확인
  const hasUploadedFiles = () => {
    console.log('[ApplyGNB] hasUploadedFiles 체크');
    console.log('  - showComplete:', showComplete);
    console.log('  - uploadedFiles:', uploadedFiles);
    console.log('  - uploadedFiles.length:', uploadedFiles?.length);

    if (showComplete) {
      console.log('  → showComplete=true, 경고 안함');
      return false; // 제출 완료 후에는 경고 안함
    }

    const result = uploadedFiles && uploadedFiles.length > 0 &&
           uploadedFiles.some(f => f.file_key && f.file_key !== 'uploading');

    console.log('  → 최종 결과:', result);
    return result;
  };

  // 네비게이션 클릭 핸들러
  const handleNavigation = (e: React.MouseEvent, href: string) => {
    console.log('[ApplyGNB] handleNavigation 호출');
    console.log('  - href:', href);
    e.preventDefault();

    const hasFiles = hasUploadedFiles();
    console.log('  - hasFiles:', hasFiles);

    if (hasFiles) {
      console.log('  → 경고 모달 표시');
      // 파일 업로드됨 → 경고 모달 표시
      setPendingNavigation(href);
      setShowExitModal(true);
    } else {
      console.log('  → 바로 이동:', href);
      // 파일 없음 → 바로 이동
      router.push(href);
    }
  };

  // 모달 확인 버튼 (파일 삭제 후 이동)
  const handleConfirmExit = async () => {
    setIsDeleting(true);

    try {
      if (onNavigateAway) {
        await onNavigateAway();
      }

      // 네트워크 전송 완료 보장을 위한 짧은 대기
      await new Promise(resolve => setTimeout(resolve, 300));

      setShowExitModal(false);

      if (pendingNavigation) {
        router.push(pendingNavigation);
      }
    } catch (error) {
      console.error('[GNB_EXIT] 파일 삭제 중 오류:', error);
      setIsDeleting(false);
    }
  };

  // 모달 취소 버튼
  const handleCancelExit = () => {
    setShowExitModal(false);
    setPendingNavigation(null);
  };

  return (
    <>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* 웹플로우 apply GNB - 완벽 일치 */}
      <div 
        data-animation="default" 
        data-collapse="medium" 
        data-duration="400" 
        data-easing="ease" 
        data-easing2="ease" 
        role="banner" 
        className="c-navbar-section-fixed w-nav"
        style={{
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        <div className="fn-navbar-container-second">
          {/* 로고 */}
          <div
            className="c-gnb-brand w-nav-brand"
            onClick={(e) => handleNavigation(e, '/')}
            style={{ cursor: 'pointer' }}
          >
            <Image
              src="/new_goStenographe_resource/Logo/LogoNavy2.png"
              alt="속기사무소 정 로고"
              width={190}
              height={59}
              priority
              className="c-gnb-brand-image"
            />
          </div>

          {/* 데스크톱 메뉴 */}
          <nav role="navigation" className="fn-navbar-menu-box-second w-nav-menu">
            <div className="fn-navbar-menu-wrapper-second">
              <div className="fn-navbar-links-wrapper">
                {navLinks.map((link, index) => (
                  <div
                    key={index}
                    onClick={(e) => handleNavigation(e, link.href)}
                    className={`fn-navbar-link-second-2 _5 w-nav-link ${index === navLinks.length - 1 ? 'last-link-on-mobile' : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    {link.text}
                  </div>
                ))}
              </div>
              
              {/* CTA 버튼 */}
              <div className="fn-gnb-button-wrapper">
                <Link 
                  href="/apply" 
                  aria-current="page" 
                  className="fn-button _4 w-button w--current"
                >
                  신청하기
                </Link>
              </div>
            </div>
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <div 
            className="fn-menu-button-second w-nav-button"
            onClick={toggleMobileMenu}
            style={{ cursor: 'pointer' }}
          >
            <div className="nav-menu-button-wrap">
              <div className="fn-nav-line-1 green-line"></div>
              <div className="fn-nav-line-2 green-line"></div>
              <div className="fn-nav-line-3 green-line"></div>
            </div>
          </div>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      <div className={`webflow-mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="webflow-mobile-menu-links">
          {navLinks.map((link, index) => (
            <div
              key={index}
              onClick={(e) => {
                setIsMobileMenuOpen(false);
                handleNavigation(e, link.href);
              }}
              className="webflow-mobile-menu-link"
              style={{ cursor: 'pointer' }}
            >
              {link.text}
            </div>
          ))}
        </div>
        <Link
          href="/apply"
          className="webflow-navbar-button"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          신청하기
        </Link>
      </div>

      {/* 페이지 이탈 경고 모달 */}
      {showExitModal && (
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
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>⚠️</div>
              <h3 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#dc2626',
                marginBottom: '12px'
              }}>
                페이지를 나가시겠습니까?
              </h3>
              <p style={{ 
                fontSize: '14px', 
                color: '#374151',
                lineHeight: '1.6'
              }}>
                업로드한 파일이 있습니다.<br/>
                페이지를 나가면 <strong>모든 작성 내용과 업로드된 파일이 삭제</strong>됩니다.
              </p>
            </div>

            {isDeleting ? (
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
                  onClick={handleCancelExit}
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
                  취소 (머무르기)
                </button>
                <button
                  onClick={handleConfirmExit}
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
                  나가기 (파일 삭제)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
