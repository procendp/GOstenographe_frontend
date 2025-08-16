"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function GNB() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { href: "#Service-Section", text: "주요 서비스" },
    { href: "#FAQ-Section", text: "자주 묻는 질문" },
    { href: "#Support-Section", text: "고객센터" }
  ];

  return (
    <>
      <nav className={`td-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="td-navbar-container">
          {/* 로고 */}
          <Link href="/" className="td-navbar-brand">
            <Image
              src="/new_goStenographe_resource/Logo/LogoWhite2.png"
              alt="속기사무소 정 로고"
              width={120}
              height={40}
              priority
            />
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="td-navbar-menu">
            <div className="td-navbar-links">
              {navLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.href} 
                  className="td-navbar-link"
                >
                  {link.text}
                </a>
              ))}
            </div>
            
            {/* CTA 버튼 */}
            <Link href="/reception" className="td-navbar-button">
              신청하기
            </Link>
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button 
            className={`td-mobile-menu-button ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="메뉴 열기/닫기"
          >
            <div className="td-mobile-menu-line"></div>
            <div className="td-mobile-menu-line"></div>
            <div className="td-mobile-menu-line"></div>
          </button>
        </div>
      </nav>

      {/* 모바일 메뉴 */}
      <div className={`td-mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="td-mobile-menu-links">
          {navLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="td-mobile-menu-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.text}
            </a>
          ))}
        </div>
        <Link 
          href="/reception" 
          className="td-navbar-button"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          신청하기
        </Link>
      </div>
    </>
  );
} 