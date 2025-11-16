import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '녹취록 작성 신청 | 전문 속기 서비스 비용 안내',
  description: '음성파일 텍스트변환 신청하기. 통화녹음, 회의록, 법원 제출용 녹취록까지 전문 속기사가 정확하게 작성합니다. 합리적인 녹취록 비용으로 빠른 납품 가능.',
  openGraph: {
    title: '전문 녹취록 작성 서비스 신청하기',
    description: '음성녹음을 텍스트로 변환하는 전문 속기 서비스. 간편한 신청으로 정확한 녹취록을 받아보세요. 공증 가능, 법원 증거 제출용 작성 가능.',
    url: '/apply',
  },
  twitter: {
    title: '전문 녹취록 작성 서비스 신청하기',
    description: '음성녹음을 텍스트로 변환하는 전문 속기 서비스. 간편한 신청으로 정확한 녹취록을 받아보세요.',
  },
}

export default function ApplyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
