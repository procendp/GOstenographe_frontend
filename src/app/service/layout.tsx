import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '주요 서비스',
  description: '회의록 작성, 강의록 작성, 인터뷰 녹취록, 영상 자막 제작 등 전문 속기 서비스를 제공합니다. 국가공인 1급 속기사가 정확하고 신속하게 작업합니다.',
  openGraph: {
    title: '주요 서비스 | 속기사무소 정',
    description: '회의록, 강의록, 인터뷰 녹취록, 영상 자막 등 다양한 속기 서비스를 제공합니다.',
    url: '/service',
  },
  twitter: {
    title: '주요 서비스 | 속기사무소 정',
    description: '회의록, 강의록, 인터뷰 녹취록, 영상 자막 등 다양한 속기 서비스',
  },
}

export default function ServiceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
