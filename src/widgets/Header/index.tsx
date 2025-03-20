import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Button from "../../shared/ui/Button";
import LogoIcon from "../../shared/ui/icons/LogoIcon";

const navigation = [
  { name: "학생회 소개", href: "/about" },
  { name: "공지사항", href: "/notice" },
  { name: "행사 정보", href: "/events" },
  { name: "학생회 구성", href: "/council" },
  { name: "문의하기", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <nav className="container-custom flex items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <LogoIcon className="h-10 w-10" />
            <span className="ml-2 text-xl font-bold text-dark">정의</span>
          </Link>
        </div>

        {/* 데스크탑 메뉴 */}
        <div className="hidden md:flex items-center gap-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-gray-600 hover:text-primary transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex">
          <Button variant="primary" size="sm">
            로그인
          </Button>
        </div>

        {/* 모바일 메뉴 버튼 */}
        <div className="md:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      {/* 모바일 메뉴 */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/20 backdrop-blur-sm md:hidden">
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5 flex items-center">
                <LogoIcon className="h-8 w-8" />
                <span className="ml-2 text-lg font-bold text-dark">정의</span>
              </Link>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-200">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <Button variant="primary" fullWidth>
                    로그인
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
