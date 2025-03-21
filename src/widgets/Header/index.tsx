import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // 현재 페이지가 about 페이지인지 확인
  const isAboutPage = pathname === "/about/";

  const isNoticeDetailPage = pathname?.startsWith("/notice/");
  const isEventsDetailPage = pathname?.startsWith("/events/");

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

  // 특정 페이지에서는 항상 배경색 적용
  const shouldShowBackground =
    isScrolled || isAboutPage || isNoticeDetailPage || isEventsDetailPage;

  // about 페이지에서는 항상 어두운 텍스트 색상 사용
  const getTextColor = () => {
    if (isAboutPage) return "text-gray-700";
    return shouldShowBackground ? "text-gray-700" : "text-white";
  };

  const getLogoTextColor = () => {
    if (isAboutPage) return "text-dark";
    return shouldShowBackground ? "text-dark" : "text-white";
  };

  const getHoverColor = () => {
    if (isAboutPage) return "hover:text-primary";
    return shouldShowBackground ? "hover:text-primary" : "hover:text-tertiary";
  };

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
              className={`ml-2 font-bold text-lg transition-colors duration-300 ${getLogoTextColor()}`}
            >
              정보의생명공학대학
            </span>
          </Link>

          {/* 데스크톱 메뉴 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/about"
              className={`transition-colors duration-300 ${getTextColor()} ${getHoverColor()}`}
            >
              학생회 소개
            </Link>
            <Link
              href="/notice"
              className={`transition-colors duration-300 ${getTextColor()} ${getHoverColor()}`}
            >
              공지사항
            </Link>
            <Link
              href="/events"
              className={`transition-colors duration-300 ${getTextColor()} ${getHoverColor()}`}
            >
              행사 정보
            </Link>
            <Link
              href="/rental"
              className={`transition-colors duration-300 ${getTextColor()} ${getHoverColor()}`}
            >
              물품 대여
            </Link>
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button
            className={`md:hidden ${
              isAboutPage
                ? "text-dark"
                : shouldShowBackground
                ? "text-dark"
                : "text-white"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container-custom py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/about"
                className="text-dark hover:text-primary transition-colors"
              >
                학생회 소개
              </Link>
              <Link
                href="/notice"
                className="text-dark hover:text-primary transition-colors"
              >
                공지사항
              </Link>
              <Link
                href="/events"
                className="text-dark hover:text-primary transition-colors"
              >
                행사 정보
              </Link>
              <Link
                href="/rental"
                className="text-dark hover:text-primary transition-colors"
              >
                물품 대여
              </Link>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
