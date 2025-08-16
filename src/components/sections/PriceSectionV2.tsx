"use client";
import React from "react";
import { motion } from "framer-motion";

const prices = [
  { time: "3분 이내", call: "30,000원", field: "50,000원" },
  { time: "5분 이내", call: "40,000원", field: "60,000원" },
  { time: "10분 이내", call: "70,000원", field: "90,000원" },
  { time: "20분 이내", call: "100,000원", field: "120,000원" },
  { time: "30분 이내", call: "120,000원", field: "140,000원" },
  { time: "40분 이내", call: "140,000원", field: "160,000원" },
  { time: "50분 이내", call: "160,000원", field: "180,000원" },
  { time: "60분 이내", call: "180,000원", field: "200,000원" }
];

export default function PriceSectionV2() {
  return (
    <section id="price" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">이용 요금</h2>
        </motion.div>
        <motion.div initial="initial" whileInView="animate" viewport={{ once: true }} className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-lg rounded-lg overflow-hidden">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left">분량</th>
                <th className="px-6 py-4 text-center">통화 녹음</th>
                <th className="px-6 py-4 text-center">현장 녹음</th>
              </tr>
            </thead>
            <tbody>
              {prices.map((row, i) => (
                <motion.tr
                  key={row.time}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  whileHover={{ backgroundColor: "#f8fafc" }}
                  className="border-b border-gray-200"
                >
                  <td className="px-6 py-4 font-semibold">{row.time}</td>
                  <td className="px-6 py-4 text-center">{row.call}</td>
                  <td className="px-6 py-4 text-center">{row.field}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </section>
  );
} 