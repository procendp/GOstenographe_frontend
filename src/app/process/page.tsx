/*
'use client';

import GNB from '@/components/GNB';
import Footer from '@/components/Footer';
import styles from './process.module.css';

export default function Process() {
  return (
    <div className="flex min-h-screen flex-col">
      <GNB />
      <main className="flex-1">
        <div className={styles.container}>
          <h1>진행 과정</h1>
          <div className={styles.timeline}>
            <div className={styles.timelineItem}>
              <div className={styles.timelineNumber}>01</div>
              <div className={styles.timelineContent}>
                <h3>서비스 신청</h3>
                <p>온라인으로 간편하게 서비스를 신청하세요.</p>
                <ul>
                  <li>녹음 파일 업로드</li>
                  <li>화자 정보 입력</li>
                  <li>세부 요구사항 작성</li>
                </ul>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineNumber}>02</div>
              <div className={styles.timelineContent}>
                <h3>검수 및 견적</h3>
                <p>전문가가 파일을 검토하고 정확한 견적을 안내해드립니다.</p>
                <ul>
                  <li>음질 확인</li>
                  <li>작업 난이도 평가</li>
                  <li>소요 시간 산정</li>
                </ul>
              </div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelineNumber}>03</div>
              <div className={styles.timelineContent}>
                <h3>결제</h3>
                <p>안전한 결제 시스템으로 편리하게 결제하세요.</p>
                <ul>
                  <li>계좌이체</li>
                  <li>카드결제 (예정)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
*/ 