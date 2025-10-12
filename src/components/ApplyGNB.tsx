"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
    if (showComplete) return false; // 제출 완료 후에는 경고 안함
    return uploadedFiles && uploadedFiles.length > 0 && 
           uploadedFiles.some(f => f.file_key && f.file_key !== 'uploading');
  };

  // 네비게이션 클릭 핸들러
  const handleNavigation = (e: React.MouseEvent, href: string) => {
    if (hasUploadedFiles()) {
      e.preventDefault();
      setPendingNavigation(href);
      setShowExitModal(true);
    }
  };

  // 모달 확인 버튼 (파일 삭제 후 이동)
  const handleConfirmExit = async () => {
    if (onNavigateAway) {
      await onNavigateAway(); // 부모 컴포넌트에서 파일 삭제 처리
    }
    setShowExitModal(false);
    if (pendingNavigation) {
      router.push(pendingNavigation);
    }
  };

  // 모달 취소 버튼
  const handleCancelExit = () => {
    setShowExitModal(false);
    setPendingNavigation(null);
  };

  return (
    <>
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
          <a 
            href="/" 
            className="c-gnb-brand w-nav-brand"
            onClick={(e) => handleNavigation(e, '/')}
          >
            <Image
              src="/new_goStenographe_resource/Logo/LogoNavy2.png"
              alt="속기사무소 정 로고"
              width={180}
              height={60}
              priority
              className="c-gnb-brand-image"
            />
          </a>

          {/* 데스크톱 메뉴 */}
          <nav role="navigation" className="fn-navbar-menu-box-second w-nav-menu">
            <div className="fn-navbar-menu-wrapper-second">
              <div className="fn-navbar-links-wrapper">
                {navLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.href}
                    onClick={(e) => handleNavigation(e, link.href)}
                    className={`fn-navbar-link-second-2 _5 w-nav-link ${index === navLinks.length - 1 ? 'last-link-on-mobile' : ''}`}
                  >
                    {link.text}
                  </a>
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
          <div className="fn-menu-button-second w-nav-button">
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
            <a
              key={index}
              href={link.href}
              onClick={(e) => handleNavigation(e, link.href)}
              className="webflow-mobile-menu-link"
            >
              {link.text}
            </a>
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
          zIndex: 9999
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
          </div>
        </div>
      )}
    </>
  );
}
