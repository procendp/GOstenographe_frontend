import type { Metadata } from 'next'
import '../styles/testdocu-base.css'
import '../styles/webflow-apply.css'
import '../styles/webflow-gnb.css'
import './globals.css'
import '../styles/tab-override.css'
import '../styles/quotation-isolated.css'
import '../styles/completion-mobile.css'
import '../styles/completion-desktop-override.css'

export const metadata: Metadata = {
  title: {
    default: '전문 녹취록 작성 서비스 | 공인 속기사 음성 파일 텍스트변환',
    template: '%s | 속기사무소 정'
  },
  description: '법원 공증 가능한 전문 속기사의 정확한 녹취록 작성. 회의록, 통화녹음, 음성파일 텍스트변환, 자막 제작까지. 빠르고 정확한 속기 타이핑 서비스를 합리적인 비용으로 이용하세요.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  keywords: [
    // 핵심 서비스
    '속기사', '속기', '녹취록', '녹취록작성', '회의록', 'STT',

    // 변환 서비스
    '음성텍스트변환', '음성녹음텍스트변환', '녹음텍스트변환',
    '음성파일텍스트변환', '녹음파일텍스트변환', '텍스트음성변환',

    // 녹음 관련
    '통화녹음', '음성녹음', '녹취',

    // 증거/법률
    '녹취록증거', '공증',

    // 비용/업체
    '녹취록비용', '속기사무소',

    // 기타
    '타이핑', '자막',

    // 브랜드
    '속기사무소 정', '국가공인 1급 속기사'
  ],
  authors: [{ name: '속기사무소 정' }],
  creator: '속기사무소 정',
  publisher: '속기사무소 정',
  metadataBase: new URL('https://sokgijung.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    title: '전문 속기사의 정확한 녹취록 작성 서비스',
    description: '회의록, 통화녹음, 음성파일을 정확한 텍스트로 변환. 법원 공증 가능한 전문 속기사무소의 신뢰할 수 있는 녹취록 작성 서비스입니다.',
    siteName: '속기사무소 정',
    images: [
      {
        url: '/new_goStenographe_resource/images/HeroImage2.png',
        width: 1200,
        height: 900,
        alt: '국가공인 1급 속기사 전문 서비스',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '전문 속기사의 정확한 녹취록 작성 서비스',
    description: '회의록, 통화녹음, 음성파일을 정확한 텍스트로 변환. 법원 공증 가능한 전문 속기사무소의 신뢰할 수 있는 녹취록 작성 서비스입니다.',
    images: ['/new_goStenographe_resource/images/HeroImage2.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '2HfKemjqjafv25U-q6H8_HMnIZFY1K7_YRAXv_BKyLw',
    other: {
      'naver-site-verification': '504d8c386c92c2311100d0d32e2e813cf35b286f',
    },
  },
}

// 구조화된 데이터 (JSON-LD)
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: '속기사무소 정',
  description: '국가공인 1급 속기사가 제공하는 전문 속기 서비스',
    url: 'https://sokgijung.com',
  telephone: '+82-10-2681-2571',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'KR',
    addressLocality: '서울시', // 실제 주소로 변경 필요
  },
  openingHours: 'Mo-Su 00:00-24:00',
  serviceType: '속기 서비스',
  areaServed: '대한민국',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: '속기 서비스',
    itemListElement: [
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '회의록 작성',
          description: '각종 회의의 음성을 정확한 텍스트로 변환',
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '강의록 작성',
          description: '강의, 세미나 음성의 전문적인 텍스트 변환',
        }
      },
      {
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: '인터뷰 녹취록',
          description: '인터뷰 음성의 정확한 문서화',
        }
      }
    ]
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '150', // 실제 리뷰 수로 변경 필요
    bestRating: '5',
    worstRating: '1'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        {/* 구조화된 데이터 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {/* Preload 중요 리소스 */}
        <link
          rel="preload"
          href="/fonts/Pretendard-Regular.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/SpoqaHanSansNeo-Regular.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/Pretendard-Bold.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/SpoqaHanSansNeo-Bold.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/new_goStenographe_resource/images/HeroImage2.png"
          as="image"
        />
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
      </head>
      <body className="td-font-primary">
        {children}
      </body>
    </html>
  )
}
