"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const contacts = [
  {
    icon: "/new_goStenographe_resource/icons/solar_letter-bold.png",
    title: "이메일 상담",
    desc: "대용량 파일 접수 등",
    contact: "sokgijung@gmail.com",
    contactType: "email"
  },
  {
    icon: "/new_goStenographe_resource/icons/solar_chat-round-bold.png",
    title: "카카오톡 상담",
    desc: "오픈채팅 '속기사무소 정'",
    contact: "채팅 상담 시작",
    contactType: "chat"
  },
  {
    icon: "/new_goStenographe_resource/icons/solar_phone-calling-rounded-bold.png",
    title: "전화 상담",
    desc: "",
    contact: "010-2681-2571",
    contactType: "phone"
  }
];

const blue = "#2051a2";
const lightBlue = "#eaf2fb";

export default function ContactSectionV2() {
  return (
    <section
      id="Support-Section"
      className="w-full py-24 flex flex-col items-center bg-cover bg-center"
      style={{
        backgroundImage: "url('/new_goStenographe_resource/backgrounds/Background-Blue20-s.png')",
        minHeight: '600px',
      }}
    >
      <div className="text-center mb-10">
        <div className="text-base md:text-lg font-medium text-gray-500 mb-2">고객지원</div>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">도움이 필요하신가요?</h2>
      </div>
      <div
        className="w-full bg-white/95 rounded-2xl shadow-2xl px-8 md:px-20 pt-24 pb-40 flex flex-col items-center"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)', minHeight: '700px', maxWidth: '900px' }}
      >
        <div className="text-center mb-10">
          <div className="mb-2" style={{color: '#1c58af', fontSize: '1.375rem', fontWeight: 'bold'}}>고객센터 운영 시간</div>
          <div className="text-center" style={{color: '#1d1f1e', fontSize: '1.375rem', lineHeight: '1.3em', fontWeight: 'bold'}}>
            평일 09:00 ~ 18:00<br />
            <sub style={{fontSize: '0.875rem', fontWeight: 'bold'}}>점심시간 12-13시<br />주말 및 공휴일 휴무</sub>
          </div>
        </div>
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          {contacts.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="px-16 py-12 rounded-xl shadow-lg text-center flex flex-col items-center border-none"
              style={{ backgroundColor: '#f4f6f9' }}
            >
              <div className="w-12 h-12 mb-3 flex items-center justify-center">
                <Image src={c.icon} alt={c.title} width={48} height={48} className="object-contain" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">{c.title}</h3>
              <p className="text-gray-600 text-sm mb-2 whitespace-nowrap">{c.desc}</p>
              {c.contactType === "email" && (
                <p className="text-base whitespace-nowrap" style={{color: blue}}>{c.contact}</p>
              )}
              {c.contactType === "chat" && (
                <p className="text-base whitespace-nowrap" style={{color: blue}}>{c.contact}</p>
              )}
              {c.contactType === "phone" && (
                <p className="text-black text-base whitespace-nowrap">{c.contact}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 