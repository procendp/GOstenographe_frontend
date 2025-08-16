"use client";
import React from "react";
import Image from "next/image";
import { useScrollAnimation, useStaggerAnimation, useMouseFollowAnimation } from "../../hooks/useGSAPAnimations";

const features = [
  {
    icon: "/new_goStenographe_resource/icons/solar_rocket-2-bold.png",
    title: "신속성",
    description: "24시간 이내 완성되는 녹취록"
  },
  {
    icon: "/new_goStenographe_resource/icons/solar_cup-bold.png", 
    title: "정확성",
    description: "오탈자 ZERO\n10년차 1급 국가공인 속기사가 직접 검수"
  },
  {
    icon: "/new_goStenographe_resource/icons/solar_clock-square-bold.png",
    title: "정시성", 
    description: "약속된 시간에 정확히 전달"
  },
  {
    icon: "/new_goStenographe_resource/icons/solar_smile-square-bold.png",
    title: "간편함",
    description: "3단계만에 신청 완료\n방문 없이, 모든 과정 비대면 진행"
  },
  {
    icon: "/new_goStenographe_resource/icons/solar_devices-bold.png",
    title: "높은 접근성", 
    description: "음성·영상 파일만 있으면 OK\n전국 어디서나 신청 가능\n(출장 서비스 포함)"
  },
  {
    icon: "/new_goStenographe_resource/icons/solar_chat-round-call-bold.png",
    title: "빠른 CS 대응",
    description: "접수부터 납품까지 1:1 고객응대\n카카오톡 · 이메일 · 전화 상담"
  }
];

export default function FeaturesSection() {
  // GSAP 애니메이션 훅들
  const titleRef = useScrollAnimation<HTMLDivElement>('fadeInUp', { delay: 0.2, duration: 1 });
  const cardsRef = useStaggerAnimation<HTMLDivElement>('.td-feature-card', 'fadeInUp', { 
    stagger: 0.15, 
    delay: 0.3, 
    duration: 0.8,
    start: "top 85%" 
  });

  return (
    <section id="Feature-Section" className="td-section-features">
      <div className="td-container">
        {/* 섹션 제목 */}
        <div 
          ref={titleRef}
          className="td-section-title"
        >
          <p className="td-section-subtitle">수많은 고객이 선택한 이유</p>
          <h2 className="td-section-heading">속도·정확도·편의성</h2>
        </div>

        {/* 특징 그리드 */}
        <div ref={cardsRef} className="td-features-grid">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

// 개별 Feature Card 컴포넌트
function FeatureCard({ feature, index }: { feature: typeof features[0], index: number }) {
  const cardRef = useMouseFollowAnimation<HTMLDivElement>(0.02, "power2.out");
  const iconRef = useMouseFollowAnimation<HTMLDivElement>(0.05, "elastic.out(1, 0.3)");

  return (
    <div 
      ref={cardRef}
      className="td-feature-card"
    >
      <div 
        ref={iconRef}
        className="td-feature-icon"
      >
        <Image
          src={feature.icon}
          alt={`${feature.title} 아이콘`}
          width={72}
          height={72}
        />
      </div>
      <h5 className="td-feature-title">{feature.title}</h5>
      <p className="td-feature-description">
        {feature.description.split('\n').map((line, lineIndex) => (
          <React.Fragment key={lineIndex}>
            {line}
            {lineIndex < feature.description.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
} 