import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '가격 안내',
  description: '투명하고 합리적인 속기 서비스 가격. 30,000원부터 시작하는 녹취록 작성 비용. 분당 요금제로 정확한 견적을 제공합니다. 추가 비용 없이 명확한 가격 정책.',
  openGraph: {
    title: '가격 안내 | 속기사무소 정',
    description: '투명하고 합리적인 속기 서비스 가격. 30,000원부터 시작하는 녹취록 작성 비용.',
    url: '/price',
  },
  twitter: {
    title: '가격 안내 | 속기사무소 정',
    description: '투명하고 합리적인 속기 서비스 가격',
  },
}

export default function PriceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
