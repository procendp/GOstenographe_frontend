"use client";

import React from "react";
import MainGNB from "../components/MainGNB";
import NewFooter from "../components/NewFooter";
import HeroSection from "../components/sections/HeroSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import ServiceSectionV2 from "../components/sections/ServiceSectionV2";
import FAQSectionV2 from "../components/sections/FAQSectionV2";
import ContactSectionV2 from "../components/sections/ContactSectionV2";
import FloatingButtons from "../components/FloatingButtons";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MainGNB />
      {/* <GNB /> */}
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <ServiceSectionV2 />
        <FAQSectionV2 />
        <ContactSectionV2 />
      </main>
      <NewFooter />
      <FloatingButtons />
    </div>
  );
} // Trigger Vercel deployment - Mon Oct 13 02:34:35 KST 2025
