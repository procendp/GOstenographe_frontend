'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {/* 소개 */}
          <motion.div variants={fadeInUp} className="lg:col-span-1">
            <h3 className="text-lg font-bold mb-4">소개</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <Link href="/" className="block hover:text-white transition-colors">주요 서비스</Link>
              <Link href="/support" className="block hover:text-white transition-colors">자주 묻는 질문</Link>
              <Link href="/customer" className="block hover:text-white transition-colors">고객센터</Link>
            </div>
          </motion.div>

          {/* 약관 */}
          <motion.div variants={fadeInUp} className="lg:col-span-1">
            <h3 className="text-lg font-bold mb-4">약관</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <a href="https://collie-retrospective.notion.site/2854b63e1e7a809590fcf1e47548ece7?pvs=74" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">서비스 이용약관</a>
              <a href="https://collie-retrospective.notion.site/2854b63e1e7a80fa937deb4a4020a5cb?pvs=74" target="_blank" rel="noopener noreferrer" className="block hover:text-white transition-colors">개인정보처리방침</a>
            </div>
          </motion.div>

          {/* 회사 정보 */}
          <motion.div variants={fadeInUp} className="lg:col-span-1">
            <h3 className="text-lg font-bold mb-4">회사 정보</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>사업자번호: 174-58-00563</p>
              <p>국가기술자격번호: 16-G1-RT0932</p>
            </div>
          </motion.div>

          {/* 고객센터 */}
          <motion.div variants={fadeInUp} className="lg:col-span-1">
            <h3 className="text-lg font-bold mb-4">고객센터</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>연락처: <a href="tel:010-2681-2571" className="hover:text-white hover:underline transition-colors">010-2681-2571</a></p>
              <p>이메일: <a href="mailto:sokgijung@gmail.com" className="hover:text-white hover:underline transition-colors">sokgijung@gmail.com</a></p>
              <p>카카오톡: <a href="https://open.kakao.com/o/sCaE9jih" target="_blank" rel="noopener noreferrer" className="hover:text-white hover:underline transition-colors">오픈채팅 '속기사무소 정'</a></p>
            </div>
          </motion.div>
        </motion.div>

        {/* 하단 구분선 및 추가 정보 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-12 pt-8 border-t border-gray-700"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Image
                src="/new_goStenographe_resource/Logo/LogoWhite2.png"
                alt="GOstenographe Logo"
                width={120}
                height={32}
                className="h-8 w-auto mr-4"
              />
              <span className="text-sm text-gray-400">© 2024 속기사무소 정. All rights reserved.</span>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/apply">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-colors duration-300">
                  서비스 신청
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer; 