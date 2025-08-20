"use client";
import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";

export default function ServiceSectionV2() {
  const [tab, setTab] = useState<'녹취록' | '회의록'>('녹취록');
  // 진행과정/이용요금 토글 상태
  const [ntab, setNtab] = useState<'process'|'price'>('process');

  // 색상 추정값
  const lightBeige = '#ede9d4'; // 진행과정 배경
  const darkBeige = '#e2c89d';  // 이용요금 배경
  const lineBeige = '#e5dcc3';  // 세로 라인

  return (
    <section id="service" className="bg-[url('/new_goStenographe_resource/backgrounds/Background-Beige.png')] bg-cover bg-center w-full py-20" style={{padding: '8rem 5%'}}>
      <div className="w-full max-w-[1280px] mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-base sm:text-lg font-medium text-gray-800 mb-2">어떤 상황에서도 완벽하게</h2>
          <h3 className="text-3xl sm:text-4xl text-gray-900 mb-8">맞춤형 속기 서비스</h3>
        </div>
        <div className="flex mb-8 w-full max-w-md mx-auto justify-center">
          <button
            className={`w-1/3 py-2 rounded-l-xl text-lg border border-black ${tab==='녹취록' ? 'bg-gray-800 text-white' : 'bg-[#f6f1e7] text-gray-700'}`}
            style={{marginRight: '-1px'}}
            onClick={()=>setTab('녹취록')}
          >
            녹취록
          </button>
          <button
            className={`w-1/3 py-2 rounded-r-xl text-lg border-l-0 border border-black ${tab==='회의록' ? 'bg-gray-800 text-white' : 'bg-[#f6f1e7] text-gray-700'}`}
            onClick={()=>setTab('회의록')}
          >
            회의록
          </button>
        </div>
        <div className="bg-white/90 rounded-2xl shadow-2xl px-4 sm:px-10 py-10 flex flex-col items-center">
          {tab === '녹취록' ? (
            <div className="w-full flex flex-col md:flex-row gap-6">
              {/* 좌측: 안내+버튼+박스+버튼 */}
              <div className="w-full md:w-1/2 flex flex-col gap-4 justify-start">
                {/* 안내 타이틀/텍스트 */}
                <div className="mb-2">
                  <div className="text-2xl sm:text-3xl text-gray-900 mb-2 leading-tight">녹취록 속기<br /><span className="font-normal">(음성·영상 파일 속기)</span></div>
                  <ul className="mb-4">
                    <li className="flex items-start mb-0.5">
                      <span className="inline-block w-6 h-6 mr-2 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12.0002 19.6386C7.78126 19.6386 4.36133 16.2187 4.36133 11.9997C4.36133 7.78077 7.78126 4.36084 12.0002 4.36084C16.2192 4.36084 19.6391 7.78077 19.6391 11.9997C19.6391 16.2187 16.2192 19.6386 12.0002 19.6386ZM11.2386 15.0553L16.6393 9.65383L15.5592 8.57369L11.2386 12.895L9.07758 10.734L7.99744 11.8141L11.2386 15.0553Z" fill="#272929"/></svg></span>
                      <div className="flex flex-col">
                        <span className="text-gray-900" style={{fontSize: '16px'}}>법적 효력을 가진 녹취 증거 제출이 필요할 때</span>
                        <span className="text-gray-500" style={{fontSize: '16px'}}>(민형사 사건 소송, 노무 관련 사건/민원 등)</span>
                      </div>
                    </li>
                    <li className="flex items-start mb-1">
                      <span className="inline-block w-6 h-6 mr-2 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12.0002 19.6386C7.78126 19.6386 4.36133 16.2187 4.36133 11.9997C4.36133 7.78077 7.78126 4.36084 12.0002 4.36084C16.2192 4.36084 19.6391 7.78077 19.6391 11.9997C19.6391 16.2187 16.2192 19.6386 12.0002 19.6386ZM11.2386 15.0553L16.6393 9.65383L15.5592 8.57369L11.2386 12.895L9.07758 10.734L7.99744 11.8141L11.2386 15.0553Z" fill="#272929"/></svg></span>
                      <span className="text-gray-900" style={{fontSize: '16px'}}>국가공인 속기사 날인 포함</span>
                    </li>
                    <li className="flex items-start mb-1">
                      <span className="inline-block w-6 h-6 mr-2 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12.0002 19.6386C7.78126 19.6386 4.36133 16.2187 4.36133 11.9997C4.36133 7.78077 7.78126 4.36084 12.0002 4.36084C16.2192 4.36084 19.6391 7.78077 19.6391 11.9997C19.6391 16.2187 16.2192 19.6386 12.0002 19.6386ZM11.2386 15.0553L16.6393 9.65383L15.5592 8.57369L11.2386 12.895L9.07758 10.734L7.99744 11.8141L11.2386 15.0553Z" fill="#272929"/></svg></span>
                      <span className="text-gray-900" style={{fontSize: '16px'}}>24시간 내 결과물 작성</span>
                    </li>
                  </ul>
                </div>
                {/* 진행 과정/이용요금 박스형 버튼 */}
                <div className="flex flex-col gap-3 mb-6">
                  <motion.div
                    animate={{ 
                      opacity: ntab==='process' ? 1 : 0.95, 
                      boxShadow: ntab==='process' ? '0 4px 16px 0 rgba(0,0,0,0.06)' : 'none' 
                    }}
                    transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                    style={{ originY: 0, zIndex: ntab==='process' ? 2 : 1, position: 'relative' }}
                  >
                    <button
                      className={`w-full text-left rounded-xl p-6 flex items-start gap-3 border transition-all duration-200 ${ntab==='process' ? 'bg-[#e2c89d] border-[#e2c89d]' : 'bg-[#ede9d4] border-[#ede9d4]'} group hover:opacity-80`}
                      onClick={()=>setNtab('process')}
                    >
                      <span className={`inline-block w-6 h-6 mt-1 transition-opacity duration-200 ${ntab==='process' ? '' : 'opacity-60'}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#272929" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="8" x="3" y="3" rx="2"></rect><path d="M7 11v4a2 2 0 0 0 2 2h4"></path><rect width="8" height="8" x="13" y="13" rx="2"></rect></svg></span>
                      <div>
                        <div className={`text-lg mb-1 text-gray-900 transition-colors duration-200`}>진행 과정</div>
                        <AnimatePresence>
                          {ntab==='process' && (
                            <motion.div
                              key="process-content"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              style={{ overflow: 'hidden' }}
                            >
                              <ul className="text-base list-disc pl-5 text-gray-900">
                                <li>다양한 형식의 녹음 음성 파일, 영상 파일 접수 가능</li>
                                <li>대용량 파일은 메일로 접수</li>
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  </motion.div>
                  <motion.div
                    animate={{ 
                      opacity: ntab==='price' ? 1 : 0.95, 
                      boxShadow: ntab==='price' ? '0 4px 16px 0 rgba(0,0,0,0.06)' : 'none' 
                    }}
                    transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                    style={{ originY: 0, zIndex: ntab==='price' ? 2 : 1, position: 'relative' }}
                  >
                    <button
                      className={`w-full text-left rounded-xl p-6 flex items-start gap-3 border transition-all duration-200 ${ntab==='price' ? 'bg-[#e2c89d] border-[#e2c89d]' : 'bg-[#ede9d4] border-[#ede9d4]'} group hover:opacity-80`}
                      onClick={()=>setNtab('price')}
                    >
                      <span className={`inline-block w-6 h-6 mt-1 transition-opacity duration-200 ${ntab==='price' ? '' : 'opacity-60'}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#272929" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="m9 12 2 2 4-4"></path></svg></span>
                      <div>
                        <div className={`text-lg mb-1 text-gray-900 transition-colors duration-200`}>이용 요금</div>
                        <AnimatePresence>
                          {ntab==='price' && (
                            <motion.div
                              key="price-content"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              style={{ overflow: 'hidden' }}
                            >
                              <ul className="text-base list-disc pl-5 text-gray-900">
                                <li>화자수에 따른 추가 요금 발생 가능</li>
                                <li>부가세 10% 별도</li>
                                <li>부가 옵션: 등기 우편 발송 5천원, 저장장치(CD/USB) 선택 1</li>
            </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  </motion.div>
                </div>
                {/* 서비스 신청/상담 문의 버튼 */}
                <div className="flex flex-col gap-2">
                  <Link href="/apply">
                    <button className="w-full py-3 rounded-lg bg-black text-white text-lg">서비스 신청</button>
                  </Link>
                  <button className="w-full py-3 rounded-lg border border-black text-black text-lg bg-white">상담 문의</button>
                </div>
              </div>
              {/* 우측: 프로세스/요금표 */}
              <div className="w-full md:w-1/2 flex flex-col justify-center ml-0 md:ml-8">
                <AnimatePresence mode="wait">
                  {ntab==='process' ? (
                    <motion.div
                      key="process"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-0 items-start w-full px-2"
                    >
                      {/* 목표 이미지 스타일의 세로 프로세스 */}
                      <div className="relative flex flex-col items-start w-full" style={{minHeight: 380}}>
                        {[
                          {icon: 'document', label: '서비스 신청'},
                          {icon: 'search', label: '작업 가능 여부 확인'},
                          {icon: 'card', label: '요금 결제'},
                          {icon: 'text', label: '초안 확인 및 수정 요청'},
                          {icon: 'box', label: '최종본 수령'},
                        ].map((step, idx, arr) => (
                          <div key={step.label} className="flex items-center w-full mb-4" style={{minHeight: 75, position: 'relative'}}>
                            {/* 세로 점선 */}
                            {idx < arr.length-1 && (
                              <div style={{position:'absolute', left:21, top:49, height:60, width:2, zIndex:0}}>
                                <div style={{height:'100%', borderLeft:'2px dotted #e5dcc3'}}></div>
                              </div>
                            )}
                            {/* 원형 아이콘 */}
                            <span className="flex items-center justify-center" style={{width:50, height:50, borderRadius:999, background:'#e2c89d', zIndex:1, marginRight:20}}>
                              {/* 웹플로우와 동일한 SVG 아이콘들 */}
                              {step.icon==='document' && (
                                <svg width="25" height="25" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                  <path d="M11 11a5 5 0 0 1 0 6"></path>
                                  <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                                  <path d="M4 6.765V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-.93-.23"></path>
                                  <path d="M7 10.51a.5.5 0 0 0-.826-.38l-1.893 1.628A1 1 0 0 1 3.63 12H2.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h1.129a1 1 0 0 1 .652.242l1.893 1.63a.5.5 0 0 0 .826-.38z"></path>
                                </svg>
                              )}
                              {step.icon==='search' && (
                                <svg width="25" height="25" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                  <path d="m8 11 2 2 4-4"></path>
                                  <circle cx="11" cy="11" r="8"></circle>
                                  <path d="m21 21-4.3-4.3"></path>
                                </svg>
                              )}
                              {step.icon==='card' && (
                                <svg width="25" height="25" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                  <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                                  <line x1="2" x2="22" y1="10" y2="10"></line>
                                </svg>
                              )}
                              {step.icon==='text' && (
                                <svg width="25" height="25" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                  <path d="m6 16 6-12 6 12"></path>
                                  <path d="M8 12h8"></path>
                                  <path d="m16 20 2 2 4-4"></path>
                                </svg>
                              )}
                              {step.icon==='box' && (
                                <svg width="25" height="25" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                  <path d="m16 16 2 2 4-4"></path>
                                  <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path>
                                  <path d="m7.5 4.27 9 5.15"></path>
                                  <polyline points="3.29 7 12 12 20.71 7"></polyline>
                                  <line x1="12" x2="12" y1="22" y2="12"></line>
                                </svg>
                              )}
                            </span>
                            <span className="text-base text-gray-900 font-normal" style={{letterSpacing:'-0.5px'}}>{step.label}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="price"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      {/* 요금표 테이블 */}
                      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                        <table className="min-w-full text-center text-base">
                          <thead style={{backgroundColor: darkBeige}}>
                            <tr>
                              <th className="py-2 px-3 font-normal">분량</th>
                              <th className="py-2 px-3 font-normal">통화 녹음</th>
                              <th className="py-2 px-3 font-normal">현장 녹음</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              ['3분 이내', '30,000원', '50,000원'],
                              ['5분 이내', '40,000원', '60,000원'],
                              ['10분 이내', '70,000원', '90,000원'],
                              ['20분 이내', '100,000원', '120,000원'],
                              ['30분 이내', '120,000원', '140,000원'],
                              ['40분 이내', '140,000원', '160,000원'],
                              ['50분 이내', '160,000원', '180,000원'],
                              ['60분 이내', '180,000원', '200,000원'],
                            ].map((row, i) => (
                              <tr key={i} className={i%2===0 ? 'bg-[#f6f1e7]' : ''}>
                                {row.map((cell, j) => (
                                  <td key={j} className="py-2 px-3 font-normal">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
          </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            // 회의록 탭 리뉴얼 시작
            <div className="w-full flex flex-col md:flex-row gap-6">
              {/* 좌측 안내+토글+내용 */}
              <div className="w-full md:w-1/2 flex flex-col gap-4 justify-start">
                {/* 안내 타이틀/텍스트 */}
                <div className="mb-2">
                  <div className="text-2xl sm:text-3xl text-gray-900 mb-2 leading-tight">회의록 속기<br /><span className="font-normal">(대면·비대면)</span></div>
                  <ul className="mb-4">
                    <li className="flex items-start mb-1">
                      <span className="inline-block w-6 h-6 mr-2 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12.0002 19.6386C7.78126 19.6386 4.36133 16.2187 4.36133 11.9997C4.36133 7.78077 7.78126 4.36084 12.0002 4.36084C16.2192 4.36084 19.6391 7.78077 19.6391 11.9997C19.6391 16.2187 16.2192 19.6386 12.0002 19.6386ZM11.2386 15.0553L16.6393 9.65383L15.5592 8.57369L11.2386 12.895L9.07758 10.734L7.99744 11.8141L11.2386 15.0553Z" fill="#272929"/></svg></span>
                      <div className="flex flex-col">
                        <span className="text-gray-900" style={{fontSize: '16px'}}>대면/비대면 회의의 공식 회의록이 필요할 때</span>
                        <span className="text-gray-500" style={{fontSize: '16px'}}>(재개발·재건축 현장, 법인 주주총회 등)</span>
                      </div>
                    </li>
                    <li className="flex items-start mb-1">
                      <span className="inline-block w-6 h-6 mr-2 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12.0002 19.6386C7.78126 19.6386 4.36133 16.2187 4.36133 11.9997C4.36133 7.78077 7.78126 4.36084 12.0002 4.36084C16.2192 4.36084 19.6391 7.78077 19.6391 11.9997C19.6391 16.2187 16.2192 19.6386 12.0002 19.6386ZM11.2386 15.0553L16.6393 9.65383L15.5592 8.57369L11.2386 12.895L9.07758 10.734L7.99744 11.8141L11.2386 15.0553Z" fill="#272929"/></svg></span>
                      <span className="text-gray-900" style={{fontSize: '16px'}}>국가공인 속기사 날인 포함</span>
                    </li>
                    <li className="flex items-start mb-1">
                      <span className="inline-block w-6 h-6 mr-2 mt-0.5"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12.0002 19.6386C7.78126 19.6386 4.36133 16.2187 4.36133 11.9997C4.36133 7.78077 7.78126 4.36084 12.0002 4.36084C16.2192 4.36084 19.6391 7.78077 19.6391 11.9997C19.6391 16.2187 16.2192 19.6386 12.0002 19.6386ZM11.2386 15.0553L16.6393 9.65383L15.5592 8.57369L11.2386 12.895L9.07758 10.734L7.99744 11.8141L11.2386 15.0553Z" fill="#272929"/></svg></span>
                      <span className="text-gray-900" style={{fontSize: '16px'}}>현장 방문(출장) 속기 가능</span>
                    </li>
                  </ul>
                </div>
                {/* 토글 버튼+내용 박스 (녹취록 탭과 완전히 동일하게, 아이콘 포함, 위치 고정, 하나의 박스) */}
                <div className="flex flex-col gap-3 mb-6">
                  {/* 진행 과정 토글+내용 */}
                  <motion.div
                    animate={{ 
                      opacity: ntab==='process' ? 1 : 0.95, 
                      boxShadow: ntab==='process' ? '0 4px 16px 0 rgba(0,0,0,0.06)' : 'none' 
                    }}
                    transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                    style={{ originY: 0, zIndex: ntab==='process' ? 2 : 1, position: 'relative' }}
                  >
                    <button
                      className={`w-full text-left rounded-xl p-6 flex items-start gap-3 border transition-all duration-200 ${ntab==='process' ? 'bg-[#e2c89d] border-[#e2c89d]' : 'bg-[#ede9d4] border-[#ede9d4]'} group hover:opacity-80`}
                      onClick={()=>setNtab('process')}
                    >
                      <span className={`inline-block w-6 h-6 mt-1 transition-opacity duration-200 ${ntab==='process' ? '' : 'opacity-60'}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#272929" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="8" x="3" y="3" rx="2"></rect><path d="M7 11v4a2 2 0 0 0 2 2h4"></path><rect width="8" height="8" x="13" y="13" rx="2"></rect></svg></span>
                      <div>
                        <div className={`text-lg mb-1 text-gray-900 transition-colors duration-200`}>진행 과정</div>
                      </div>
                    </button>
                  </motion.div>
                  {/* 이용 요금 토글+내용 */}
                  <motion.div
                    animate={{ 
                      opacity: ntab==='price' ? 1 : 0.95, 
                      boxShadow: ntab==='price' ? '0 4px 16px 0 rgba(0,0,0,0.06)' : 'none' 
                    }}
                    transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
                    style={{ originY: 0, zIndex: ntab==='price' ? 2 : 1, position: 'relative' }}
                  >
                    <button
                      className={`w-full text-left rounded-xl p-6 flex items-start gap-3 border transition-all duration-200 ${ntab==='price' ? 'bg-[#e2c89d] border-[#e2c89d]' : 'bg-[#ede9d4] border-[#ede9d4]'} group hover:opacity-80`}
                      onClick={()=>setNtab('price')}
                    >
                      <span className={`inline-block w-6 h-6 mt-1 transition-opacity duration-200 ${ntab==='price' ? '' : 'opacity-60'}`}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#272929" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"></path><path d="m9 12 2 2 4-4"></path></svg></span>
                      <div>
                        <div className={`text-lg mb-1 text-gray-900 transition-colors duration-200`}>이용 요금</div>
                        <AnimatePresence>
                          {ntab==='price' && (
                            <motion.div
                              key="price-content"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              style={{ overflow: 'hidden' }}
                            >
                              <ul className="text-base list-disc pl-5 text-gray-900">
                                <li>화자 추가 시에도 가격 변동 없음</li>
                                <li>부가세 10% 별도</li>
                              </ul>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </button>
                  </motion.div>
                </div>
                {/* 신청 문의 버튼 */}
                <button className="w-full py-3 rounded-lg bg-black text-white text-lg mt-2">신청 문의</button>
              </div>
              {/* 우측: 토글별 내용 */}
              <div className="w-full md:w-1/2 flex flex-col justify-center ml-0 md:ml-8">
                <AnimatePresence mode="wait">
                  {ntab==='process' ? (
                    <motion.div
                      key="meeting-process"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-0 items-start w-full px-2"
                    >
                      {/* 세로 프로세스 */}
                      <div className="relative flex flex-col items-start w-full" style={{minHeight: 380}}>
                        {[
                          {icon: 'document', label: '서비스 신청'},
                          {icon: 'card', label: '계약금 결제'},
                          {icon: 'wave', label: '현장 속기'},
                          {icon: 'text', label: '초안 확인 및 수정 요청'},
                          {icon: 'card', label: '잔금 결제'},
                          {icon: 'box', label: '최종본 수령'},
                        ].map((step, idx, arr) => (
                          <div key={step.label} className="flex items-center w-full mb-4" style={{minHeight: 75, position: 'relative'}}>
                            {/* 세로 점선 */}
                            {idx < arr.length-1 && (
                              <div style={{position:'absolute', left:21, top:49, height:60, width:2, zIndex:0}}>
                                <div style={{height:'100%', borderLeft:'2px dotted #e5dcc3'}}></div>
                              </div>
                            )}
                            {/* 원형 아이콘 */}
                            <span className="flex items-center justify-center" style={{width:50, height:50, borderRadius:999, background:'#e2c89d', zIndex:1, marginRight:20}}>
                              {/* 웹플로우와 동일한 SVG 아이콘들 */}
                              {step.icon==='document' && (
                                <svg width="25" height="25" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                  <path d="M11 11a5 5 0 0 1 0 6"></path>
                                  <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
                                  <path d="M4 6.765V4a2 2 0 0 1 2-2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-.93-.23"></path>
                                  <path d="M7 10.51a.5.5 0 0 0-.826-.38l-1.893 1.628A1 1 0 0 1 3.63 12H2.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h1.129a1 1 0 0 1 .652.242l1.893 1.63a.5.5 0 0 0 .826-.38z"></path>
                                </svg>
                              )}
                              {step.icon==='card' && (
                                <svg width="25" height="25" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                  <rect width="20" height="14" x="2" y="5" rx="2"></rect>
                                  <line x1="2" x2="22" y1="10" y2="10"></line>
                                </svg>
                              )}
                              {step.icon==='wave' && (
                                <svg width="25" height="25" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                  <path d="m6 16 6-12 6 12"></path>
                                  <path d="M8 12h8"></path>
                                  <path d="M4 21c1.1 0 1.1-1 2.3-1s1.1 1 2.3 1c1.1 0 1.1-1 2.3-1 1.1 0 1.1 1 2.3 1 1.1 0 1.1-1 2.3-1 1.1 0 1.1 1 2.3 1 1.1 0 1.1-1 2.3-1"></path>
                                </svg>
                              )}
                              {step.icon==='text' && (
                                <svg width="25" height="25" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                  <path d="m6 16 6-12 6 12"></path>
                                  <path d="M8 12h8"></path>
                                  <path d="m16 20 2 2 4-4"></path>
                                </svg>
                              )}
                              {step.icon==='box' && (
                                <svg width="25" height="25" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                  <path d="m16 16 2 2 4-4"></path>
                                  <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path>
                                  <path d="m7.5 4.27 9 5.15"></path>
                                  <polyline points="3.29 7 12 12 20.71 7"></polyline>
                                  <line x1="12" x2="12" y1="22" y2="12"></line>
                                </svg>
                              )}
                            </span>
                            <span className="text-base text-gray-900 font-normal" style={{letterSpacing:'-0.5px'}}>{step.label}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="meeting-price"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      {/* 요금표 테이블 */}
                      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                        <table className="min-w-full text-center text-base">
                          <thead style={{backgroundColor: '#e2c89d'}}>
                            <tr>
                              <th className="py-2 px-3 font-normal">분량</th>
                              <th className="py-2 px-3 font-normal">녹음 파일<br/>(비대면 회의)</th>
                              <th className="py-2 px-3 font-normal">출장 속기<br/>(대면 회의)</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              ['1시간 이내', '200,000원', '220,000원'],
                              ['1시간 초과', '협의', '협의'],
                            ].map((row, i) => (
                              <tr key={i} className={i%2===0 ? 'bg-[#f6f1e7]' : ''}>
                                {row.map((cell, j) => (
                                  <td key={j} className="py-2 px-3 font-normal">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
          </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
} 