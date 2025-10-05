"use client";

import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center px-4">
        <img
          src="https://d3e54v103j8qbb.cloudfront.net/static/page-not-found.211a85e40c.svg"
          alt="Page Not Found"
          className="mx-auto mb-8 max-w-md w-full"
        />
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved
        </p>
        <Link
          href="/"
          className="inline-block bg-[#1c58af] hover:bg-[#164a94] text-white font-semibold px-8 py-3 rounded-lg transition-colors duration-300"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
