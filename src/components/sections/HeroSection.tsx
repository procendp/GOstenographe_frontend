"use client";
import React from "react";
import Image from "next/image";
import { useTypewriterAnimation, useScrollAnimation, useParallaxAnimation, useMouseFollowAnimation } from "../../hooks/useGSAPAnimations";

const FADE_TEXTS = [
  "국가 공인 1급 속기사",
  "걱정과 수고로움을 덜어드려요."
];

export default function HeroSection() {
  // GSAP 애니메이션 훅들
  const typewriterRef = useTypewriterAnimation<HTMLHeadingElement>(FADE_TEXTS, 4000, 0.08);
  const subtitleRef = useScrollAnimation<HTMLDivElement>('fadeInUp', { delay: 0.1, duration: 0.8 });
  const titleRef = useScrollAnimation<HTMLHeadingElement>('slideInLeft', { delay: 0.3, duration: 1 });
  const descriptionRef = useScrollAnimation<HTMLParagraphElement>('fadeInUp', { delay: 0.6, duration: 0.8 });
  const buttonRef = useScrollAnimation<HTMLAnchorElement>('scaleIn', { delay: 0.8, duration: 0.6 });
  const imageRef = useParallaxAnimation<HTMLDivElement>(0.3, 'vertical');
  const mouseFollowRef = useMouseFollowAnimation<HTMLDivElement>(0.05, "power3.out");

  return (
    <section 
      id="Hero" 
      className="td-section-hero"
      style={{
        backgroundColor: '#1c58af', // 4000포트와 동일한 파란색 배경
        backgroundImage: "url('/new_goStenographe_resource/backgrounds/bg-b-vl.png')",
        backgroundPosition: '0 0',
        backgroundRepeat: 'repeat',
        paddingTop: '80px', // GNB 높이 고려 + 4000포트와 동일한 패딩
        paddingBottom: '80px', // 4000포트와 동일한 크기로 축소
        color: '#ecf0ef',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        display: 'flex',
        minHeight: 'auto' // 고정 높이 제거
      }}
    >
      <div className="td-hero-container">
        {/* 자격번호 */}
        <div 
          ref={subtitleRef}
          className="td-hero-subtitle"
          style={{ gridColumn: '1 / -1', gridRow: '1' }}
        >
          국가기술자격번호 16-G1-RT0932
        </div>
        
        {/* 메인 타이틀 영역 */}
        <div 
          className="flex flex-col"
          style={{ gridColumn: '1 / 9', gridRow: '2 / 4' }}
        >
          {/* 애니메이션되는 첫 번째 타이틀 */}
          <div className="min-h-[65px] mb-2 relative overflow-hidden">
            <h1 
              ref={typewriterRef}
              className="td-hero-title" 
              style={{ color: 'var(--td-beige)' }}
            >
              {FADE_TEXTS[0]}
            </h1>
          </div>
          
          {/* 고정된 두 번째 타이틀 */}
          <h1 
            ref={titleRef}
            className="td-hero-title"
          >
            신뢰할 수 있는 전문 속기 서비스
          </h1>
        </div>
        
        {/* 히어로 이미지 - 패럴랙스와 마우스 추적 효과 */}
        <div 
          ref={mouseFollowRef}
          className="relative"
          style={{ gridColumn: '9 / -1', gridRow: '2 / 6' }}
        >
          <div ref={imageRef}>
            <Image 
              src="/new_goStenographe_resource/images/HeroImage2.png" 
              alt="국가공인 1급 속기사 일러스트 - 전문 속기 서비스" 
              width={1200} 
              height={900}
              priority 
              className="td-hero-image"
            />
          </div>
        </div>
        
        {/* 설명 텍스트 */}
        <p 
          ref={descriptionRef}
          className="td-hero-description"
          style={{ gridColumn: '1 / 7', gridRow: '5' }}
        >
          24시간 이내 완성되는 전문 속기 서비스를 간편하게 이용하세요.
        </p>
        
        {/* CTA 버튼 */}
        <div 
          style={{ gridColumn: '1 / 5', gridRow: '6' }}
        >
          <a 
            ref={buttonRef}
            href="/reception" 
            className="td-button-primary"
            title="속기 서비스 신청하기"
          >
            서비스 신청
          </a>
        </div>
      </div>
    </section>
  );
} 