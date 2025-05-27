import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // 현재 페이지가 about 페이지인지 확인
  const isAboutPage = pathname === "/about/";

  const isNoticeDetailPage = pathname?.startsWith("/notice/");
  const isEventsDetailPage = pathname?.startsWith("/events/");
  const isRentalPage = pathname === "/rental" || pathname === "/rental/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    // 페이지 로드 시 즉시 스크롤 상태 확인
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 모바일 메뉴가 열릴 때 스크롤 방지
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // 특정 페이지에서는 항상 배경색 적용
  const shouldShowBackground =
    isScrolled ||
    isAboutPage ||
    isNoticeDetailPage ||
    isEventsDetailPage ||
    isRentalPage;

  // about 페이지 및 rental 페이지에서는 항상 어두운 텍스트 색상 사용
  const getTextColor = () => {
    if (isAboutPage || isRentalPage) return "text-gray-700";
    return shouldShowBackground ? "text-gray-700" : "text-white";
  };

  const getLogoTextColor = () => {
    if (isAboutPage || isRentalPage) return "text-dark";
    return shouldShowBackground ? "text-dark" : "text-white";
  };

  const getHoverColor = () => {
    if (isAboutPage || isRentalPage) return "hover:text-primary";
    return shouldShowBackground ? "hover:text-primary" : "hover:text-tertiary";
  };

  const menuItems = [
    { href: "/about", label: "학생회 소개" },
    { href: "/notice", label: "공지사항" },
    { href: "/events", label: "행사 정보" },
    { href: "/rental", label: "물품 대여" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldShowBackground ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* 로고 */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="부산대학교 정보의생명공학대학 학생회 로고"
              width={30}
              height={30}
              className="h-8 w-8 object-contain"
            />
            <span
              className={`ml-2 font-bold text-lg transition-colors duration-300 korean-text ${getLogoTextColor()}`}
            >
              정보의생명공학대학
            </span>
          </Link>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`transition-colors duration-300 korean-text font-medium ${getTextColor()} ${getHoverColor()}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <motion.button
            className={`md:hidden p-2 rounded-lg transition-all duration-300 ${
              isAboutPage
                ? "text-dark hover:bg-gray-100"
                : shouldShowBackground
                ? "text-dark hover:bg-gray-100"
                : "text-white hover:bg-white/10"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: mobileMenuOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* 모바일 메뉴 오버레이 */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* 백드롭 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              style={{
                willChange: "opacity",
                transform: "translate3d(0, 0, 0)",
              }}
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* 메뉴 패널 */}
            <motion.div
              initial={{ opacity: 0, y: -30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.9 }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute top-full left-0 right-0 z-50 md:hidden"
              style={{
                willChange: "transform, opacity",
                transform: "translate3d(0, 0, 0)",
              }}
            >
              <div className="mx-4 mt-4 relative">
                <div
                  className="relative bg-white/95 rounded-3xl shadow-2xl border border-white/30 overflow-hidden"
                  style={{
                    willChange: "transform",
                    transform: "translate3d(0, 0, 0)",
                  }}
                >
                  {/* 상단 그라디언트 헤더 */}
                  <div className="relative bg-gradient-to-r from-primary/5 via-secondary/5 to-tertiary/5 p-6 pb-4 border-b border-gray-100">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-tertiary"></div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.2 }}
                      className="flex items-center justify-center"
                      style={{
                        willChange: "transform, opacity",
                        transform: "translate3d(0, 0, 0)",
                      }}
                    >
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-gray-800 korean-text mb-1">
                          메뉴
                        </h3>
                        <div className="w-12 h-0.5 bg-gradient-to-r from-primary to-secondary rounded-full mx-auto"></div>
                      </div>
                    </motion.div>
                  </div>

                  {/* 메뉴 아이템들 */}
                  <div className="p-6 pt-4">
                    <nav className="space-y-3">
                      {menuItems.map((item, index) => (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            delay: 0.1 + index * 0.05,
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          style={{
                            willChange: "transform, opacity",
                            transform: "translate3d(0, 0, 0)",
                          }}
                        >
                          <Link
                            href={item.href}
                            className="block relative overflow-hidden rounded-2xl bg-white/80 border border-gray-200 transition-transform duration-150 active:scale-95 shadow-sm"
                            onClick={() => setMobileMenuOpen(false)}
                            style={{
                              willChange: "transform",
                              transform: "translate3d(0, 0, 0)",
                            }}
                          >
                            <div className="px-6 py-4 flex items-center justify-between">
                              <span className="text-lg font-semibold text-gray-800 korean-text">
                                {item.label}
                              </span>

                              <div className="text-gray-500">
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </nav>

                    {/* 하단 브랜딩 */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.3 }}
                      className="mt-8 pt-6 border-t border-gray-100"
                      style={{
                        willChange: "transform, opacity",
                        transform: "translate3d(0, 0, 0)",
                      }}
                    >
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-2 mb-2">
                          <div className="w-2 h-2 bg-gradient-to-r from-primary to-secondary rounded-full"></div>
                          <span className="text-sm text-gray-600 korean-text font-medium">
                            부산대학교 정보의생명공학대학
                          </span>
                          <div className="w-2 h-2 bg-gradient-to-r from-secondary to-tertiary rounded-full"></div>
                        </div>
                        <div className="text-xs text-gray-500 korean-text">
                          학생회{" "}
                          <span className="font-semibold text-primary">
                            &ldquo;정의&rdquo;
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
