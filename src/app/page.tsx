"use client";

import React from "react";
// import GNB from "../components/GNB";
import MainGNB from "../components/MainGNB";
import NewFooter from "../components/NewFooter";
import HeroSection from "../components/sections/HeroSection";
import FeaturesSection from "../components/sections/FeaturesSection";
import ServiceSection from "../components/sections/ServiceSectionV2";
// import ProcessSection from "../components/sections/ProcessSectionV2";
// import PriceSection from "../components/sections/PriceSectionV2";
import FAQSection from "../components/sections/FAQSectionV2";
import ContactSection from "../components/sections/ContactSectionV2";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <MainGNB />
      {/* <GNB /> */}
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <ServiceSection />
        {/* <ProcessSection /> */}
        {/* <PriceSection /> */}
        <FAQSection />
        <ContactSection />
      </main>
      <NewFooter />
    </div>
  );
} 