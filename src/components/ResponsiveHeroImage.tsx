"use client";
import React from "react";
import Image from "next/image";

interface ResponsiveHeroImageProps {
  desktopSrc: string;
  mobileSrc?: string;
  alt: string;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function ResponsiveHeroImage({
  desktopSrc,
  mobileSrc,
  alt,
  priority = false,
  className = "",
  style = {}
}: ResponsiveHeroImageProps) {
  return (
    <>
      {/* 모바일용 이미지 - flexbox로 우측 하단 배치 */}
      <div className="block md:hidden mobile-hero-image-container" style={{ 
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginTop: '2rem',
        paddingRight: '1rem'
      }}>
        <Image
          src={mobileSrc || desktopSrc}
          alt={alt}
          width={400}
          height={300}
          priority={priority}
          className={`${className} mobile-hero-image`}
          sizes="100vw"
          style={{
            width: '60%', /* 화면 너비의 60% */
            maxWidth: '400px', /* 최대 크기 증가: 250px → 400px */
            height: 'auto',
            objectFit: 'contain',
            ...style
          }}
        />
      </div>

      {/* 데스크톱용 이미지 */}
      <div className="hidden md:block">
        <Image
          src={desktopSrc}
          alt={alt}
          width={1400}
          height={1050}
          priority={priority}
          className={`${className} desktop-hero-image`}
          sizes="(max-width: 768px) 0vw, (max-width: 1200px) 50vw, 40vw"
          style={{
            width: '100%',
            height: 'auto',
            objectFit: 'contain',
            ...style
          }}
        />
      </div>
    </>
  );
}
