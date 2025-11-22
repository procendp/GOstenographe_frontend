"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function NewFooter() {
  const handleScrollClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <style jsx>{`
        @media (max-width: 470px) {
          .footer-mobile-center {
            align-items: center !important;
            text-align: center !important;
          }
          .footer-mobile-center-flex {
            justify-content: center !important;
            align-items: center !important;
          }
          .footer-mobile-center-col {
            flex-direction: column !important;
            align-items: center !important;
            width: 100% !important;
          }
        }
      `}</style>
      <footer className="bg-white text-gray-900 pt-2 pb-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start justify-between gap-8">
        {/* 좌측: 큰 홈버튼(로고) */}
        <div className="flex flex-col items-start footer-mobile-center w-full md:w-auto pl-0 pt-0 mt-6 mb-0">
          <Link
            href="/"
            className="inline-block mb-0 flex-shrink-0 w-[220px] h-[80px] rounded-3xl bg-white"
            aria-label="홈으로 이동"
            style={{ boxSizing: 'border-box' }}
          >
            <Image src="/new_goStenographe_resource/Logo/LogoNavy2.png" alt="홈 로고" width={220} height={80} priority style={{ width: '100%', height: '100%', objectFit: 'contain' }} className="w-full h-full" />
          </Link>
        </div>
        {/* 우측: 버튼+정보 구조 */}
        <div className="flex flex-col md:flex-row items-end md:items-start w-full md:w-auto gap-4 md:gap-8 mt-6">
          {/* 모바일: 작은 버튼 + 소개 섹션을 가로로 배치 */}
          <div className="flex flex-row items-start footer-mobile-center-col gap-4 w-full md:hidden">
            {/* 작은 서비스 신청 버튼 */}
            <motion.a
              href="/apply"
              whileTap={{ scale: 0.98 }}
              className="flex justify-center items-center text-center bg-[#222] text-white hover:text-white px-8 py-4 rounded-xl font-bold text-base transition-all duration-300 flex-shrink-0 active:opacity-90"
            >
              서비스 신청
            </motion.a>
            {/* 소개 섹션 */}
            <div className="flex-1 footer-mobile-center">
              <div className="mb-2 text-right footer-mobile-center" style={{fontSize: '0.83rem', fontWeight: 'normal', color: 'rgba(29, 31, 30, 0.6)'}}>소개</div>
              <div className="flex flex-col gap-1 items-end footer-mobile-center">
                <a href="#Feature-Section" onClick={(e) => handleScrollClick(e, '#Feature-Section')} className="hover:underline cursor-pointer text-right whitespace-nowrap" style={{fontSize: '1rem', color: '#1d1f1e', paddingTop: '0.25em', paddingBottom: '0.25em'}}>주요 서비스</a>
                <a href="#FAQ-Section" onClick={(e) => handleScrollClick(e, '#FAQ-Section')} className="hover:underline cursor-pointer text-right whitespace-nowrap" style={{fontSize: '1rem', color: '#1d1f1e', paddingTop: '0.25em', paddingBottom: '0.25em'}}>자주 묻는 질문</a>
                <a href="#Support-Section" onClick={(e) => handleScrollClick(e, '#Support-Section')} className="hover:underline cursor-pointer text-right whitespace-nowrap" style={{fontSize: '1rem', color: '#1d1f1e', paddingTop: '0.25em', paddingBottom: '0.25em'}}>고객센터</a>
              </div>
            </div>
          </div>
          
          {/* 데스크톱: 가로 정렬 버튼 */}
          <motion.a
            href="/apply"
            whileHover={{ scale: 1.02, opacity: 0.9 }}
            whileTap={{ scale: 0.98 }}
            className="hidden md:flex justify-center items-center text-center bg-[#272929] text-white hover:text-white px-6 py-4 rounded-none font-bold text-lg transition-all duration-300 mt-6"
          >
            서비스 신청
          </motion.a>
          
          {/* 정보 블록 - 모바일에서는 나머지 섹션들만, 데스크톱에서는 모든 섹션 */}
          <div className="flex flex-col items-end md:items-start footer-mobile-center gap-6 text-right md:text-left w-full md:w-auto mt-6">
            {/* 데스크톱에서만 소개 섹션 표시 */}
            <div className="hidden md:block">
              <div className="mb-2 text-left" style={{fontSize: '0.83rem', fontWeight: 'normal', color: 'rgba(29, 31, 30, 0.6)'}}>소개</div>
              <div className="flex flex-col gap-1 items-start">
                <a href="#Feature-Section" onClick={(e) => handleScrollClick(e, '#Feature-Section')} className="hover:underline cursor-pointer text-left whitespace-nowrap" style={{fontSize: '1rem', color: '#1d1f1e', paddingTop: '0.25em', paddingBottom: '0.25em'}}>주요 서비스</a>
                <a href="#FAQ-Section" onClick={(e) => handleScrollClick(e, '#FAQ-Section')} className="hover:underline cursor-pointer text-left whitespace-nowrap" style={{fontSize: '1rem', color: '#1d1f1e', paddingTop: '0.25em', paddingBottom: '0.25em'}}>자주 묻는 질문</a>
                <a href="#Support-Section" onClick={(e) => handleScrollClick(e, '#Support-Section')} className="hover:underline cursor-pointer text-left whitespace-nowrap" style={{fontSize: '1rem', color: '#1d1f1e', paddingTop: '0.25em', paddingBottom: '0.25em'}}>고객센터</a>
              </div>
            </div>
            {/* 약관 */}
            <div className="footer-mobile-center">
              <div className="mb-2 text-right md:text-left footer-mobile-center" style={{fontSize: '0.83rem', fontWeight: 'normal', color: 'rgba(29, 31, 30, 0.6)'}}>약관</div>
              <div className="flex flex-col gap-1 items-end md:items-start footer-mobile-center">
                <Link href="/terms" className="hover:underline text-right md:text-left whitespace-nowrap" style={{fontSize: '1rem', color: '#1d1f1e', paddingTop: '0.25em', paddingBottom: '0.25em'}}>서비스 이용약관</Link>
                <Link href="/policy" className="hover:underline text-right md:text-left whitespace-nowrap" style={{fontSize: '1rem', color: '#1d1f1e', paddingTop: '0.25em', paddingBottom: '0.25em'}}>개인정보처리방침</Link>
              </div>
            </div>
            {/* 회사 정보 */}
            <div className="footer-mobile-center">
              <div className="mb-2 text-right md:text-left footer-mobile-center" style={{fontSize: '0.83rem', fontWeight: 'normal', color: 'rgba(29, 31, 30, 0.6)'}}>회사 정보</div>
              <div className="flex flex-col gap-1 items-end md:items-start footer-mobile-center">
                <div className="flex items-center justify-end md:justify-start footer-mobile-center-flex">
                  <span style={{fontSize: '1rem', fontWeight: 600, color: '#1d1f1e', whiteSpace: 'nowrap', marginRight: '8px'}}>사업자번호</span>
                  <span style={{fontSize: '1rem', fontWeight: 300, color: '#1d1f1e', whiteSpace: 'nowrap'}}>174-58-00563</span>
                </div>
                <div className="flex items-center justify-end md:justify-start footer-mobile-center-flex">
                  <span style={{fontSize: '1rem', fontWeight: 600, color: '#1d1f1e', whiteSpace: 'nowrap', marginRight: '8px'}}>국가기술자격번호</span>
                  <span style={{fontSize: '1rem', fontWeight: 300, color: '#1d1f1e', whiteSpace: 'nowrap'}}>16-G1-RT0932</span>
                </div>
              </div>
            </div>
            {/* 고객센터 */}
            <div className="footer-mobile-center">
              <div className="mb-2 text-right md:text-left footer-mobile-center" style={{fontSize: '0.83rem', fontWeight: 'normal', color: 'rgba(29, 31, 30, 0.6)'}}>고객센터</div>
              <div className="flex flex-col gap-1 items-end md:items-start footer-mobile-center">
                <div className="flex items-center justify-end md:justify-start footer-mobile-center-flex">
                  <span style={{fontSize: '1rem', fontWeight: 600, color: '#1d1f1e', whiteSpace: 'nowrap', marginRight: '8px'}}>연락처</span>
                  <a href="tel:010-2681-2571" className="hover:underline" style={{fontSize: '1rem', fontWeight: 300, color: '#1d1f1e', whiteSpace: 'nowrap'}}>010-2681-2571</a>
                </div>
                <div className="flex items-center justify-end md:justify-start footer-mobile-center-flex">
                  <span style={{fontSize: '1rem', fontWeight: 600, color: '#1d1f1e', whiteSpace: 'nowrap', marginRight: '8px'}}>이메일</span>
                  <a href="mailto:info@sokgijung.com" className="hover:underline" style={{fontSize: '1rem', fontWeight: 300, color: '#1d1f1e', whiteSpace: 'nowrap'}}>info@sokgijung.com</a>
                </div>
                <div className="flex items-center justify-end md:justify-start footer-mobile-center-flex">
                  <span style={{fontSize: '1rem', fontWeight: 600, color: '#1d1f1e', whiteSpace: 'nowrap', marginRight: '8px'}}>카카오톡</span>
                  <a href="https://open.kakao.com/o/sCaE9jih" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{fontSize: '1rem', fontWeight: 300, color: '#1d1f1e', whiteSpace: 'nowrap'}}>오픈채팅 '속기사무소 정'</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
} 