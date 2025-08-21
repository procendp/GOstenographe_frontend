import type { Metadata } from 'next'
import '../styles/testdocu-base.css'
import '../styles/webflow-gnb.css'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: '국가공인 1급 속기사 - 전문 속기 서비스 | GO스테노그래프',
    template: '%s | GO스테노그래프'
  },
  description: '24시간 이내 완성되는 전문 속기 서비스. 국가공인 1급 속기사가 직접 검수하는 정확하고 신속한 녹취록 제작 서비스를 제공합니다.',
  keywords: ['속기', '속기사', '녹취록', '회의록', '음성변환', '텍스트변환', '국가공인', '1급속기사', 'GO스테노그래프'],
  authors: [{ name: 'GO스테노그래프' }],
  creator: 'GO스테노그래프',
  publisher: 'GO스테노그래프',
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: '/',
    title: '국가공인 1급 속기사 - 전문 속기 서비스',
    description: '24시간 이내 완성되는 전문 속기 서비스. 정확하고 신속한 녹취록 제작',
    siteName: 'GO스테노그래프',
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
    title: '국가공인 1급 속기사 - 전문 속기 서비스',
    description: '24시간 이내 완성되는 전문 속기 서비스',
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
    // 나중에 Google Search Console, Naver 등록 시 추가
    // google: 'google-site-verification-code',
    // other: {
    //   'naver-site-verification': 'naver-verification-code',
    // },
  },
}

// 구조화된 데이터 (JSON-LD)
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'GO스테노그래프',
  description: '국가공인 1급 속기사가 제공하는 전문 속기 서비스',
  url: 'http://localhost:3000',
  telephone: '+82-10-0000-0000', // 실제 번호로 변경 필요
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
