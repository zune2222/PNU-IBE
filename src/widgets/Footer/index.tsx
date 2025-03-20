import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const footerLinks = [
  {
    title: "학생회 소개",
    links: [
      { text: "학생회 연혁", href: "/about/history" },
      { text: "학생회 구성", href: "/about/members" },
      { text: "학생회 활동", href: "/about/activities" },
      { text: "학생회 규정", href: "/about/rules" },
    ],
  },
  {
    title: "학생 지원",
    links: [
      { text: "장학금 안내", href: "/support/scholarship" },
      { text: "학사 일정", href: "/support/academic-calendar" },
      { text: "동아리 활동", href: "/support/clubs" },
      { text: "취업 지원", href: "/support/career" },
    ],
  },
  {
    title: "커뮤니티",
    links: [
      { text: "공지사항", href: "/community/notices" },
      { text: "학과 소식", href: "/community/news" },
      { text: "자주 묻는 질문", href: "/community/faq" },
      { text: "연락처", href: "/community/contact" },
    ],
  },
];

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    icon: (
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://facebook.com",
    icon: (
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com",
    icon: (
      <svg
        className="w-5 h-5"
        fill="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    name: "KakaoTalk",
    href: "https://kakaotalk.com",
    icon: (
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 3C7.0374 3 3 6.28937 3 10.3187C3 13.0254 4.85376 15.3988 7.60701 16.5712C7.40614 17.2351 6.75355 19.0872 6.64673 19.4416C6.51288 19.8807 6.73015 19.8742 6.91549 19.7505C7.05751 19.6567 9.36481 18.0974 10.4396 17.3556C10.9453 17.4137 11.4656 17.4443 12 17.4443C16.9626 17.4443 21 14.1543 21 10.1244C21 6.09454 16.9626 3 12 3Z" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="relative bg-slate-950 text-white overflow-hidden">
      {/* 배경 요소 */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/80 via-blue-400 to-purple-400"></div>
      <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-500/5 blur-3xl"></div>
      <div className="absolute -left-20 bottom-0 w-72 h-72 rounded-full bg-primary/5 blur-3xl"></div>

      <div className="container-custom relative pt-16 pb-8 z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-gray-800">
          <div className="md:col-span-4 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center"
            >
              <Image
                src="/logo.png"
                alt="부산대학교 정보의생명공학대학 학생회 로고"
                width={48}
                height={48}
                className="h-auto w-auto"
              />
              <span className="ml-3 text-xl font-bold text-white">
                정보의생명공학대학 학생회
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-gray-400 mt-4 max-w-sm"
            >
              부산대학교 정보의생명공학대학 학생회는 학우들의 권익 보호와 더
              나은 학교 생활을 위해 노력하고 있습니다.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="pt-2"
            >
              <h4 className="text-gray-300 font-medium mb-3">연락처</h4>
              <div className="space-y-2 text-gray-400">
                <p className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  051-510-1234
                </p>
                <p className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  ibe.council@pusan.ac.kr
                </p>
                <p className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-2 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  부산광역시 금정구 부산대학로63번길 2 (장전동)
                </p>
              </div>
            </motion.div>
          </div>

          <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {footerLinks.map((column, idx) => (
              <motion.div
                key={column.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 * (idx + 2) }}
              >
                <h4 className="text-lg font-medium text-white mb-4">
                  {column.title}
                </h4>
                <ul className="space-y-3">
                  {column.links.map((link) => (
                    <li key={link.text}>
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-primary transition-colors"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="md:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h4 className="text-lg font-medium text-white mb-4">소셜 미디어</h4>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-800 transition-all"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-medium text-white mb-4">
                뉴스레터 구독
              </h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="이메일 주소"
                  className="bg-gray-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary/90 transition-colors"
                >
                  구독
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-gray-500 text-sm"
          >
            © {new Date().getFullYear()} 부산대학교 정보의생명공학대학 학생회.
            All rights reserved.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex space-x-6 mt-4 md:mt-0"
          >
            <Link
              href="/privacy"
              className="text-gray-500 hover:text-gray-300 text-sm"
            >
              개인정보처리방침
            </Link>
            <Link
              href="/terms"
              className="text-gray-500 hover:text-gray-300 text-sm"
            >
              이용약관
            </Link>
            <Link
              href="/sitemap"
              className="text-gray-500 hover:text-gray-300 text-sm"
            >
              사이트맵
            </Link>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
