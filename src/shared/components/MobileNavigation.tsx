import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Home, Users, Bell, Calendar, Package } from "lucide-react";

interface MobileNavigationProps {
  className?: string;
}

export default function MobileNavigation({
  className = "",
}: MobileNavigationProps) {
  const router = useRouter();

  const navItems = [
    {
      name: "홈",
      href: "/",
      icon: Home,
      active: router.pathname === "/",
    },
    {
      name: "학생회 소개",
      href: "/about",
      icon: Users,
      active: router.pathname === "/about",
    },
    {
      name: "공지사항",
      href: "/notice",
      icon: Bell,
      active: router.pathname === "/notice",
    },
    {
      name: "행사정보",
      href: "/events",
      icon: Calendar,
      active: router.pathname.startsWith("/events"),
    },
    {
      name: "물품대여",
      href: "/rental",
      icon: Package,
      active: router.pathname.startsWith("/rental"),
    },
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 ${className}`}
    >
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-colors ${
                item.active
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
