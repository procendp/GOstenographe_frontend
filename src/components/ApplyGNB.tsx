"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface ApplyGNBProps {
  uploadedFiles?: Array<{ file_key: string; file: File }>;
  onNavigateAway?: () => void;
  showComplete?: boolean;
}

export default function ApplyGNB({ uploadedFiles, onNavigateAway, showComplete }: ApplyGNBProps = {}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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

  // 페이지 이탈 시 파일 정리 (props가 전달된 경우에만)
  useEffect(() => {
    if (onNavigateAway && uploadedFiles && uploadedFiles.length > 0) {
      const handleBeforeUnload = () => {
        onNavigateAway();
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [onNavigateAway, uploadedFiles]);

  const navLinks = [
    { href: "/", text: "주요 서비스" },
    { href: "/", text: "자주 묻는 질문" },
    { href: "/", text: "고객센터" }
  ];

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
          <Link href="/" className="c-gnb-brand w-nav-brand">
            <Image
              src="/new_goStenographe_resource/Logo/LogoNavy2.png"
              alt="속기사무소 정 로고"
              width={180}
              height={60}
              priority
              className="c-gnb-brand-image"
            />
          </Link>

          {/* 데스크톱 메뉴 */}
          <nav role="navigation" className="fn-navbar-menu-box-second w-nav-menu">
            <div className="fn-navbar-menu-wrapper-second">
              <div className="fn-navbar-links-wrapper">
                {navLinks.map((link, index) => (
                  <a 
                    key={index}
                    href={link.href}
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
    </>
  );
}
