import React from 'react';
import styles from './ProcessSection.module.css';

export default function ProcessSection() {
  return (
    <section id="process" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">진행 과정</h2>
        
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

          <div className={styles.timelineItem}>
            <div className={styles.timelineNumber}>04</div>
            <div className={styles.timelineContent}>
              <h3>작업 진행</h3>
              <p>전문 속기사가 정확하게 작업을 진행합니다.</p>
              <ul>
                <li>1차 속기</li>
                <li>전문가 검수</li>
                <li>최종 점검</li>
              </ul>
            </div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineNumber}>05</div>
            <div className={styles.timelineContent}>
              <h3>완료 및 전달</h3>
              <p>완성된 파일을 이메일로 전달해드립니다.</p>
              <ul>
                <li>최종 결과물 전송</li>
                <li>수정 요청 접수</li>
                <li>피드백 반영</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 