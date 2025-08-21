"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function GNB() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isApplyPage = pathname === "/apply";

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { href: "#Service-Section", text: "주요 서비스" },
    { href: "#FAQ-Section", text: "자주 묻는 질문" },
    { href: "#Support-Section", text: "고객센터" }
  ];

  // /apply 페이지에서는 메인페이지로 이동, 메인페이지에서는 섹션으로 이동
  const handleNavLinkClick = (linkHref: string, e: React.MouseEvent) => {
    if (isApplyPage) {
      // /apply에서 클릭 시 메인페이지 홈으로
      router.push("/");
    } else {
      // 메인페이지에서 클릭 시 주소에 섹션 추가하고 스크롤
      e.preventDefault();
      
      // 주소에 해시 추가 (Next.js와 충돌하지 않도록)
      const currentPath = window.location.pathname;
      const newUrl = `${currentPath}${linkHref}`;
      window.history.replaceState(null, '', newUrl);
      
      // 스크롤 처리
      setTimeout(() => {
        const element = document.querySelector(linkHref);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <>
      <nav className={`webflow-navbar ${isApplyPage ? 'apply-page' : ''}`}>
        <div className="webflow-navbar-container">
          {/* 로고 */}
          <Link href="/" className="webflow-navbar-brand">
            <Image
              src="/new_goStenographe_resource/Logo/LogoNavy2.png"
              alt="속기사무소 정 로고"
              width={120}
              height={40}
              priority
            />
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="webflow-navbar-menu">
            <div className="webflow-navbar-links">
              {navLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.href}
                  className="webflow-navbar-link"
                  onClick={(e) => handleNavLinkClick(link.href, e)}
                >
                  {link.text}
                </a>
              ))}
            </div>
            
            {/* CTA 버튼 */}
            <Link href="/apply" className="webflow-navbar-button">
              신청하기
            </Link>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button 
            className={`webflow-mobile-menu-button ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="메뉴 열기/닫기"
          >
            <div className="webflow-mobile-menu-line green-line"></div>
            <div className="webflow-mobile-menu-button-line green-line"></div>
            <div className="webflow-mobile-menu-line green-line"></div>
          </button>
        </div>
      </nav>

      {/* 모바일 메뉴 */}
      <div className={`webflow-mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="webflow-mobile-menu-links">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="webflow-navbar-link"
              onClick={(e) => handleNavLinkClick(link.href, e)}
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