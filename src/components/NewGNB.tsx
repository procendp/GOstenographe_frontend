"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const menu = [
  { label: "주요 서비스", href: "#service" },
  { label: "진행 과정", href: "#process" },
  { label: "가격", href: "#price" },
  { label: "FAQ", href: "#faq" },
  { label: "고객센터", href: "#contact" },
];

export default function NewGNB() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleMenuClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setMobileOpen(false);
    }
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 shadow-lg backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/new_goStenographe_resource/Logo/LogoNavy2.png" alt="로고" width={40} height={40} />
          <span className={`text-lg font-bold tracking-tight ${isScrolled ? "text-gray-900" : "text-white"}`}>속기사무소 정</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <ul className="flex items-center gap-8">
            {menu.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={e => handleMenuClick(e, item.href)}
                  className={`text-base font-medium transition-colors duration-300 hover:opacity-80 ${isScrolled ? "text-gray-900" : "text-white"}`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.02, opacity: 0.9 }}
            whileTap={{ scale: 0.98 }}
            onClick={e => handleMenuClick(e, "#contact")}
            className="ml-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-base transition-all duration-300 shadow-lg"
          >
            서비스 신청
          </motion.a>
        </div>
        {/* 모바일 메뉴 버튼 */}
        <button className="md:hidden flex items-center" onClick={() => setMobileOpen(v => !v)}>
          <span className="sr-only">메뉴 열기</span>
          <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path stroke={isScrolled ? "#222" : "#fff"} strokeWidth="2" strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16"/></svg>
        </button>
        {/* 모바일 메뉴 */}
        {mobileOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-lg flex flex-col items-center py-6 z-50 animate-fadeIn">
            {menu.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={e => handleMenuClick(e, item.href)}
                className="block w-full text-center py-3 text-lg font-semibold text-gray-900 hover:bg-blue-50"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={e => handleMenuClick(e, "#contact")}
              className="block w-full text-center py-3 mt-2 bg-blue-600 text-white rounded-lg font-semibold active:opacity-90"
            >
              서비스 신청
            </a>
          </div>
        )}
      </div>
    </motion.nav>
  );
} 