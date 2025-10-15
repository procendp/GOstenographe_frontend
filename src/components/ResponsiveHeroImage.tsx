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
      {/* 모바일용 이미지 - 텍스트 아래에 배치 */}
      <div className="block md:hidden" style={{ 
        position: 'relative', 
        zIndex: 0, 
        marginTop: '2rem',
        width: '100%',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Image
          src={mobileSrc || desktopSrc}
          alt={alt}
          width={300}
          height={225}
          priority={priority}
          className={`${className} mobile-hero-image`}
          sizes="100vw"
          style={{
            width: '80%',
            maxWidth: '300px',
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
