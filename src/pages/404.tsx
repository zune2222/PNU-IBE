import React, { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Header } from "../widgets/Header";
import { Footer } from "../widgets/Footer";

// 새로운 링크 컴포넌트를 만들어 motion 효과와 Next.js Link를 결합합니다
const MotionLink = motion(Link);

export default function Custom404() {
  // 클라이언트 사이드 렌더링을 위한 상태 추가
  const [isClient, setIsClient] = useState(false);

  // 마운트 시 클라이언트 사이드임을 확인
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <>
      <Head>
        <title>
          페이지를 찾을 수 없습니다 | 부산대학교 정보의생명공학대학 학생회
        </title>
        <meta
          name="description"
          content="요청하신 페이지를 찾을 수 없습니다."
        />
      </Head>

      <Header />

      <main>
        <section className="relative min-h-screen flex items-center pt-20 pb-20 overflow-hidden bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50">
          {/* 배경 요소들 */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>
            <div className="absolute top-20 right-10 w-96 h-96 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 left-10 w-80 h-80 rounded-full bg-gradient-to-tr from-secondary/20 to-tertiary/20 blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 blur-3xl"></div>
          </div>

          <div className="container-custom relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              {isClient ? (
                // 클라이언트 사이드에서만 모션 애니메이션 적용
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12"
                  >
                    <div className="flex justify-center mb-8">
                      <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                        <Image
                          src="/images/ibe-mascort.png"
                          alt="IBE 마스코트 부엉이"
                          layout="fill"
                          objectFit="contain"
                          priority
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold mb-6 text-primary">
                      404
                    </h1>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 korean-text bg-gradient-to-r from-dark to-gray-700 bg-clip-text text-transparent">
                      페이지를 찾을 수 없습니다
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto korean-text mb-10">
                      요청하신 페이지가 삭제되었거나, 이름이 변경되었거나,
                      일시적으로 사용이 중단되었습니다.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                      <MotionLink
                        href="/"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl transition-all duration-300 text-base korean-text w-full sm:w-auto"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        홈으로 돌아가기
                      </MotionLink>
                      <MotionLink
                        href="/notice"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-700 font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-base korean-text w-full sm:w-auto"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                          />
                        </svg>
                        공지사항 보기
                      </MotionLink>
                    </div>
                  </motion.div>
                </>
              ) : (
                // 서버 사이드 렌더링 시 모션 없이 정적 버전 렌더링
                <>
                  <div className="mb-12">
                    <div className="flex justify-center mb-8">
                      <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                        <Image
                          src="/images/ibe-mascort.png"
                          alt="IBE 마스코트 부엉이"
                          layout="fill"
                          objectFit="contain"
                          priority
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold mb-6 text-primary">
                      404
                    </h1>
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 korean-text bg-gradient-to-r from-dark to-gray-700 bg-clip-text text-transparent">
                      페이지를 찾을 수 없습니다
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto korean-text mb-10">
                      요청하신 페이지가 삭제되었거나, 이름이 변경되었거나,
                      일시적으로 사용이 중단되었습니다.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                      <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-medium rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl transition-all duration-300 text-base korean-text w-full sm:w-auto"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                          />
                        </svg>
                        홈으로 돌아가기
                      </Link>
                      <Link
                        href="/notice"
                        className="inline-flex items-center justify-center px-6 py-3 border border-gray-200 bg-white/80 backdrop-blur-sm text-gray-700 font-medium rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-base korean-text w-full sm:w-auto"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                          />
                        </svg>
                        공지사항 보기
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
