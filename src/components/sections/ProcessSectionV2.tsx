"use client";
import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "서비스 신청",
    desc: "온라인으로 간편하게 서비스를 신청하세요.",
    details: ["녹음 파일 업로드", "화자 정보 입력", "세부 요구사항 작성"]
  },
  {
    number: "02",
    title: "검수 및 견적",
    desc: "전문가가 파일을 검토하고 정확한 견적을 안내해드립니다.",
    details: ["음질 확인", "작업 난이도 평가", "소요 시간 산정"]
  },
  {
    number: "03",
    title: "결제",
    desc: "안전한 결제 시스템으로 편리하게 결제하세요.",
    details: ["계좌이체", "카드결제 (예정)"]
  },
  {
    number: "04",
    title: "작업 진행 및 납품",
    desc: "전문 속기사가 신속하게 작업을 진행하고 결과물을 납품합니다.",
    details: ["초안 전달 및 확인", "수정 요청 반영", "최종본 납품"]
  }
];

export default function ProcessSectionV2() {
  return (
    <section id="process" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">진행 과정</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-blue-50 rounded-xl p-8 shadow-md flex flex-col items-center"
            >
              <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mb-4">{step.number}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-600 mb-4 text-center">{step.desc}</p>
              <ul className="text-sm text-gray-700 space-y-1">
                {step.details.map((d, idx) => (
                  <li key={idx}>• {d}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 