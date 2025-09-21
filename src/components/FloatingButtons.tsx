"use client";
import React, { useState, useEffect } from "react";

export default function FloatingButtons() {
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  // 스크롤 위치에 따라 최상단 이동 버튼 표시 여부 결정
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollToTop(true);
      } else {
        setShowScrollToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 최상단으로 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // 카카오톡 오픈채팅방 이동
  const openKakaoChat = () => {
    window.open('https://open.kakao.com/o/sCaE9jih', '_blank');
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 flex flex-col gap-2 md:gap-3 z-50">
      {/* 카카오톡 오픈채팅방 버튼 */}
      <button
        onClick={openKakaoChat}
        className="w-12 h-12 md:w-14 md:h-14 bg-yellow-400 hover:bg-yellow-500 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="카카오톡 상담"
      >
        {/* 카카오톡 아이콘 */}
        <svg
          width="24"
          height="24"
          className="md:w-7 md:h-7"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 3C7.03 3 3 6.58 3 11c0 2.58 1.25 4.88 3.21 6.38L5.5 21l4.48-1.71C10.64 19.76 11.31 20 12 20c4.97 0 9-3.58 9-8s-4.03-8-9-8z"
            fill="#3C1E1E"
          />
        </svg>
      </button>

      {/* 최상단 이동 버튼 - 스크롤 시에만 표시 */}
      {showScrollToTop && (
        <button
          onClick={scrollToTop}
          className="w-12 h-12 md:w-14 md:h-14 bg-gray-800 hover:bg-gray-900 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
          aria-label="맨 위로"
        >
          {/* 위쪽 화살표 아이콘 */}
          <svg
            width="20"
            height="20"
            className="md:w-6 md:h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m18 15-6-6-6 6"/>
          </svg>
        </button>
      )}
    </div>
  );
}