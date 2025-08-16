'use client';

import GNB from '@/components/GNB';
import Footer from '@/components/Footer';
import styles from './support.module.css';

export default function Support() {
  return (
    <div className="flex min-h-screen flex-col">
      <GNB />
      <main className="flex-1">
        <div className={styles.container}>
          <h1>고객센터</h1>
          <div className={styles.contactInfo}>
            <div className={styles.infoCard}>
              <h2>전화 문의</h2>
              <p className={styles.highlight}>010-2681-2571</p>
              <p>평일 09:00 - 18:00</p>
            </div>
            <div className={styles.infoCard}>
              <h2>이메일 문의</h2>
              <p className={styles.highlight}>sokgijung@gmail.com</p>
              <p>24시간 접수 가능</p>
            </div>
          </div>
          
          <div className={styles.faqSection}>
            <h2>자주 묻는 질문</h2>
            <div className={styles.faqList}>
              <div className={styles.faqItem}>
                <h3>Q. 견적은 어떻게 받을 수 있나요?</h3>
                <p>서비스 신청 페이지에서 녹음 파일과 함께 기본 정보를 입력해주시면, 검토 후 정확한 견적을 안내해드립니다.</p>
              </div>
              <div className={styles.faqItem}>
                <h3>Q. 긴급 작업도 가능한가요?</h3>
                <p>네, 가능합니다. 긴급 작업의 경우 추가 요금이 발생하며, 12시간 이내 납품을 보장합니다.</p>
              </div>
              <div className={styles.faqItem}>
                <h3>Q. 어떤 파일 형식을 지원하나요?</h3>
                <p>mp3, wav, m4a, ogg 등 대부분의 오디오 파일과 mp4, wmv, mov, avi 등의 동영상 파일을 지원합니다.</p>
              </div>
              <div className={styles.faqItem}>
                <h3>Q. 수정 요청은 어떻게 하나요?</h3>
                <p>결과물 수령 후 48시간 이내에 이메일이나 전화로 수정 요청을 해주시면 신속하게 처리해드립니다.</p>
              </div>
            </div>
          </div>

          <div className={styles.contactForm}>
            <h2>문의하기</h2>
            <form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name">이름</label>
                <input type="text" id="name" className={styles.input} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="email">이메일</label>
                <input type="email" id="email" className={styles.input} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="phone">연락처</label>
                <input type="tel" id="phone" className={styles.input} required />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="message">문의 내용</label>
                <textarea id="message" className={styles.textarea} rows={5} required />
              </div>
              <button type="submit" className={styles.submitButton}>
                문의하기
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 