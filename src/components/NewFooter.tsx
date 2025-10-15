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
    <footer className="bg-white text-gray-900 pt-2 pb-8 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start justify-between gap-8">
        {/* 좌측: 큰 홈버튼(로고) */}
        <div className="flex flex-col items-start w-full md:w-auto pl-0 pt-0 mt-6 mb-0">
          <Link
            href="/"
            className="inline-block mb-0 flex-shrink-0 w-[220px] h-[80px] rounded-3xl bg-white"
            aria-label="홈으로 이동"
            style={{ boxSizing: 'border-box' }}
          >
            <Image src="/new_goStenographe_resource/Logo/LogoNavy2.png" alt="홈 로고" width={220} height={80} priority style={{ width: '100%', height: '100%', objectFit: 'contain' }} className="w-full h-full" />
          </Link>
        </div>
        {/* 우측: 버튼+정보 flex-row 구조 */}
        <div className="flex flex-col md:flex-row items-end md:items-start w-full md:w-auto gap-4 md:gap-8 mt-6">
          {/* 서비스 신청 버튼 - 모바일에서는 가로, 데스크톱에서는 세로 */}
          <motion.a
            href="/apply"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex justify-center items-center text-center bg-[#222] hover:bg-[#333] text-white px-6 py-3 w-full md:w-[220px] md:h-[80px] rounded-xl font-bold text-lg transition-colors duration-300 mt-6 md:mt-6"
            style={{
              writingMode: 'horizontal-tb', // 모바일에서는 가로 텍스트
            }}
          >
            <span className="md:hidden">서비스 신청</span>
            <span className="hidden md:block" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>서비스 신청</span>
          </motion.a>
          {/* 정보 블록 - 모바일에서는 오른쪽 정렬, 데스크톱에서는 왼쪽 정렬 */}
          <div className="flex flex-col items-end md:items-start gap-6 text-right md:text-left w-full md:w-auto mt-6">
            {/* 소개 */}
            <div>
              <div className="mb-2 text-right md:text-left" style={{fontSize: '0.83rem', fontWeight: 'normal', color: 'rgba(29, 31, 30, 0.6)'}}>소개</div>
              <div className="flex flex-col gap-1 items-end md:items-start">
                <a href="#Feature-Section" onClick={(e) => handleScrollClick(e, '#Feature-Section')} className="hover:underline cursor-pointer text-right md:text-left whitespace-nowrap" style={{fontSize: '1rem', color: '#1d1f1e', paddingTop: '0.25em', paddingBottom: '0.25em'}}>주요 서비스</a>
                <a href="#FAQ-Section" onClick={(e) => handleScrollClick(e, '#FAQ-Section')} className="hover:underline cursor-pointer text-right md:text-left whitespace-nowrap" style={{fontSize: '1rem', color: '#1d1f1e', paddingTop: '0.25em', paddingBottom: '0.25em'}}>자주 묻는 질문</a>
                <a href="#Support-Section" onClick={(e) => handleScrollClick(e, '#Support-Section')} className="hover:underline cursor-pointer text-right md:text-left whitespace-nowrap" style={{fontSize: '1rem', color: '#1d1f1e', paddingTop: '0.25em', paddingBottom: '0.25em'}}>고객센터</a>
              </div>
            </div>
            {/* 약관 */}
            <div>
              <div className="mb-2 text-right md:text-left" style={{fontSize: '0.83rem', fontWeight: 'normal', color: 'rgba(29, 31, 30, 0.6)'}}>약관</div>
              <div className="flex flex-col gap-1 items-end md:items-start">
                <Link href="/terms" className="hover:underline text-right md:text-left whitespace-nowrap" style={{fontSize: '1rem', color: '#1d1f1e', paddingTop: '0.25em', paddingBottom: '0.25em'}}>서비스 이용약관</Link>
                <Link href="/privacy" className="hover:underline text-right md:text-left whitespace-nowrap" style={{fontSize: '1rem', color: '#1d1f1e', paddingTop: '0.25em', paddingBottom: '0.25em'}}>개인정보처리방침</Link>
              </div>
            </div>
            {/* 회사 정보 */}
            <div>
              <div className="mb-2 text-right md:text-left" style={{fontSize: '0.83rem', fontWeight: 'normal', color: 'rgba(29, 31, 30, 0.6)'}}>회사 정보</div>
              <div className="flex flex-col gap-1 items-end md:items-start">
                <div className="flex items-center justify-end md:justify-start">
                  <span style={{fontSize: '1rem', fontWeight: 600, color: '#1d1f1e', whiteSpace: 'nowrap', marginRight: '8px'}}>사업자번호</span>
                  <span style={{fontSize: '1rem', fontWeight: 300, color: '#1d1f1e', whiteSpace: 'nowrap'}}>174-58-00563</span>
                </div>
                <div className="flex items-center justify-end md:justify-start">
                  <span style={{fontSize: '1rem', fontWeight: 600, color: '#1d1f1e', whiteSpace: 'nowrap', marginRight: '8px'}}>국가기술자격번호</span>
                  <span style={{fontSize: '1rem', fontWeight: 300, color: '#1d1f1e', whiteSpace: 'nowrap'}}>16-G1-RT0932</span>
                </div>
              </div>
            </div>
            {/* 고객센터 */}
            <div>
              <div className="mb-2 text-right md:text-left" style={{fontSize: '0.83rem', fontWeight: 'normal', color: 'rgba(29, 31, 30, 0.6)'}}>고객센터</div>
              <div className="flex flex-col gap-1 items-end md:items-start">
                <div className="flex items-center justify-end md:justify-start">
                  <span style={{fontSize: '1rem', fontWeight: 600, color: '#1d1f1e', whiteSpace: 'nowrap', marginRight: '8px'}}>연락처</span>
                  <a href="tel:010-2681-2571" className="hover:underline" style={{fontSize: '1rem', fontWeight: 300, color: '#1d1f1e', whiteSpace: 'nowrap'}}>010-2681-2571</a>
                </div>
                <div className="flex items-center justify-end md:justify-start">
                  <span style={{fontSize: '1rem', fontWeight: 600, color: '#1d1f1e', whiteSpace: 'nowrap', marginRight: '8px'}}>이메일</span>
                  <a href="mailto:sokgijung@gmail.com" className="hover:underline" style={{fontSize: '1rem', fontWeight: 300, color: '#1d1f1e', whiteSpace: 'nowrap'}}>sokgijung@gmail.com</a>
                </div>
                <div className="flex items-center justify-end md:justify-start">
                  <span style={{fontSize: '1rem', fontWeight: 600, color: '#1d1f1e', whiteSpace: 'nowrap', marginRight: '8px'}}>카카오톡</span>
                  <a href="https://open.kakao.com/o/sCaE9jih" target="_blank" rel="noopener noreferrer" className="hover:underline" style={{fontSize: '1rem', fontWeight: 300, color: '#1d1f1e', whiteSpace: 'nowrap'}}>오픈채팅 '속기사무소 정'</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 