"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function MainGNB() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('');

  // 스크롤 방향 감지 및 활성 섹션 감지 로직
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 스크롤 다운 - GNB 숨기기
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY) {
        // 스크롤 업 - GNB 보이기
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
      
      // 현재 활성 섹션 감지
      const sections = ['Hero', 'Feature-Section', 'FAQ-Section', 'Support-Section'];
      const scrollPosition = currentScrollY + 150; // GNB 높이 고려
      
      let currentSection = '';
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const elementTop = element.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;
          
          if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
            currentSection = `#${sectionId}`;
            break;
          }
        }
      }
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  // 4000포트와 동일한 섹션 ID들로 수정
  const navLinks = [
    { href: "#Feature-Section", text: "주요 서비스" },
    { href: "#FAQ-Section", text: "자주 묻는 질문" },
    { href: "#Support-Section", text: "고객센터" }
  ];

  return (
    <>
      {/* 네비게이션 바 - 스크롤 방향에 따라 숨김/표시 */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between"
        role="banner"
        style={{
          backgroundColor: 'rgba(28, 88, 175, 0.8)', // 4000포트: 파란색 반투명 배경
          paddingTop: '5px', // 배경 더 축소
          paddingBottom: '5px', // 배경 더 축소
          paddingLeft: '5%',
          paddingRight: '5%',
          transform: isVisible ? 'translateY(0)' : 'translateY(-100%)',
          transition: 'transform 0.3s ease-in-out'
        }}
      >
        {/* 로고 - 4000포트와 동일한 크기 */}
        <Link 
          href="/" 
          className="flex items-center flex-shrink-0"
          aria-current="page"
          style={{ 
            maxWidth: '280px', 
            width: 'auto',
            flexFlow: 'column',
            justifyContent: 'center',
            alignItems: 'flex-start'
          }}
        >
          <Image
            src="/new_goStenographe_resource/Logo/LogoWhite2.png"
            alt="속기사무소 정 로고"
            width={190} // 조금 더 키우기: 180 → 190
            height={59} // 비율에 맞게: 56 → 59
            priority
            className="h-auto w-auto"
            style={{ 
              display: 'block', 
              overflow: 'auto',
              objectFit: 'scale-down'
            }}
          />
        </Link>

        {/* 데스크톱 메뉴 */}
        <div className="hidden md:flex items-center flex-1 justify-end">
          <div className="flex items-center justify-end">
            <div className="flex items-center justify-start">
              {navLinks.map((link, index) => {
                const isActive = activeSection === link.href;
                return (
                  <a
                    key={index}
                    href={link.href}
                    onClick={(e) => handleMenuClick(e, link.href)}
                    className="font-medium transition-colors duration-300 hover:opacity-80 text-white"
                    style={{
                      fontSize: '17px', // 폰트 크기 증가
                      fontWeight: 500, // 폰트 두께 증가
                      fontFamily: 'var(--_concept-1---font-accent, "Pretendard", sans-serif)',
                      paddingTop: '25px', // 패딩 증가
                      paddingBottom: '25px', // 패딩 증가
                      paddingLeft: '16px', // 패딩 증가
                      paddingRight: '16px', // 패딩 증가
                      marginLeft: 0,
                      alignItems: 'center',
                      display: 'flex',
                      color: isActive ? '#FFB000' : 'var(--flowui-component-library--white, #ffffff)' // 활성 메뉴는 밝고 진한 골드색
                    }}
                  >
                    {link.text} 
                  </a>
                );
              })}
            </div>
            
            {/* CTA 버튼 - 4000포트 스타일 */}
            <div style={{ marginLeft: '20px' }}>
              <Link
                href="/reception"
                className="inline-block font-semibold transition-all duration-300 hover:opacity-90"
                style={{
                  fontFamily: 'var(--_concept-1---font-accent, "Pretendard", sans-serif)',
                  fontSize: '16px', // 폰트 크기 증가
                  fontWeight: 600,
                  backgroundColor: '#2b2b2b', // 검은색으로 변경
                  color: 'white',
                  padding: '14px 28px', // 패딩 증가
                  borderRadius: '8px',
                  textDecoration: 'none'
                }}
              >
                신청하기
              </Link>
            </div>
          </div>
        </div>

        {/* 모바일 메뉴 버튼 - 4000포트 스타일 */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 transition-colors duration-200"
          aria-label="메뉴 열기/닫기"
        >
          <div className="w-6 h-6 flex flex-col justify-center items-center">
            <div 
              className={`w-5 h-0.5 transition-all duration-300 bg-white ${isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
              style={{ backgroundColor: 'white' }}
            />
            <div 
              className={`w-5 h-0.5 mt-1 transition-all duration-300 bg-white ${isMobileMenuOpen ? "opacity-0" : ""}`}
              style={{ backgroundColor: 'white' }}
            />
            <div 
              className={`w-5 h-0.5 mt-1 transition-all duration-300 bg-white ${isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
              style={{ backgroundColor: 'white' }}
            />
          </div>
        </button>
      </nav>

      {/* 모바일 메뉴 - 4000포트 스타일 적용 */}
      <div 
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen 
            ? "opacity-100 visible" 
            : "opacity-0 invisible"
        }`}
      >
        {/* 배경 오버레이 */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* 메뉴 컨텐츠 - 4000포트와 동일한 다크 스타일 */}
        <div 
          className={`absolute top-0 right-0 w-64 h-full shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ 
            backgroundColor: '#0f1213',
            borderRadius: '16px 0 0 16px'
          }}
        >
          <div className="flex flex-col h-full" style={{ paddingTop: '80px', paddingLeft: '15px', paddingRight: '15px' }}>
            <div className="flex-1">
              {navLinks.map((link, index) => {
                const isActive = activeSection === link.href;
                return (
                  <a
                    key={index}
                    href={link.href}
                    onClick={(e) => handleMenuClick(e, link.href)}
                    className="block text-lg font-medium transition-colors duration-200 hover:opacity-80"
                    style={{
                      color: isActive ? '#FFB000' : '#ecf0ef', // 활성 메뉴는 밝고 진한 골드색
                      borderTop: index > 0 ? '1px solid #3e4545' : 'none',
                      paddingTop: '36px', // 패딩 증가
                      paddingBottom: '36px', // 패딩 증가
                      fontFamily: 'var(--_concept-1---font-accent, "Pretendard", sans-serif)',
                      fontSize: '18px', // 폰트 크기 증가
                      fontWeight: 500 // 폰트 두께 증가
                    }}
                  >
                    {link.text}
                  </a>
                );
              })}
            </div>
            
            {/* 모바일 CTA 버튼 - 4000포트 스타일 */}
            <div className="pb-6">
              <Link
                href="/reception"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-center font-semibold transition-colors duration-300 hover:opacity-90"
                style={{
                  width: '170px', // 너비 증가
                  margin: '0 auto',
                  padding: '14px 28px', // 패딩 증가
                  backgroundColor: '#2b2b2b', // 검은색으로 변경
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '16px', // 폰트 크기 증가
                  fontWeight: 600,
                  fontFamily: 'var(--_concept-1---font-accent, "Pretendard", sans-serif)'
                }}
              >
                신청하기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
