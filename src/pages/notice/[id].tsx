import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "../../widgets/Header";
import { Footer } from "../../widgets/Footer";
import { event as gaEvent } from "../../shared/lib/analytics";
import {
  noticeService,
  FirestoreNotice,
} from "../../shared/services/firestore";
import { getCategoryColor } from "../../shared/data/noticeData";

export default function NoticeDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [notice, setNotice] = useState<FirestoreNotice | null>(null);
  const [relatedNotices, setRelatedNotices] = useState<FirestoreNotice[]>([]);
  const [recentNotices, setRecentNotices] = useState<FirestoreNotice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 데이터 로드
  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 해당 공지사항 가져오기
        const noticeData = await noticeService.getById(id);

        if (!noticeData) {
          setError("공지사항을 찾을 수 없습니다.");
          return;
        }

        setNotice(noticeData);

        // 모든 공지사항 가져오기
        const allNotices = await noticeService.getAll();

        // 관련 공지 (같은 카테고리, 현재 공지 제외)
        const related = allNotices
          .filter(
            (item) =>
              item.id !== noticeData.id && item.category === noticeData.category
          )
          .slice(0, 3);
        setRelatedNotices(related);

        // 최근 공지 (현재 공지 제외, 날짜순 정렬)
        const recent = allNotices
          .filter((item) => item.id !== noticeData.id)
          .sort((a, b) => {
            const dateA =
              a.createdAt &&
              typeof a.createdAt === "object" &&
              "toDate" in a.createdAt
                ? (a.createdAt as { toDate: () => Date }).toDate()
                : new Date(a.createdAt as string | number | Date);
            const dateB =
              b.createdAt &&
              typeof b.createdAt === "object" &&
              "toDate" in b.createdAt
                ? (b.createdAt as { toDate: () => Date }).toDate()
                : new Date(b.createdAt as string | number | Date);
            return dateB.getTime() - dateA.getTime();
          })
          .slice(0, 3);
        setRecentNotices(recent);
      } catch (err) {
        console.error("공지사항 로드 실패:", err);
        setError("공지사항을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  // GA 이벤트 트래킹
  useEffect(() => {
    if (notice) {
      gaEvent({
        action: "view_notice",
        category: "notices",
        label: `${notice.id} - ${notice.title}`,
      });
    }
  }, [notice]);

  // 날짜 포맷팅 함수
  const formatDate = (timestamp: unknown) => {
    if (!timestamp) return "";

    // 문자열인 경우 (서버에서 직렬화된 ISO 문자열)
    if (typeof timestamp === "string") {
      const date = new Date(timestamp);
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }

    // Firestore Timestamp 처리 (클라이언트에서 사용될 수 있음)
    if (
      typeof timestamp === "object" &&
      timestamp !== null &&
      "toDate" in timestamp
    ) {
      const firestoreTimestamp = timestamp as { toDate: () => Date };
      return firestoreTimestamp.toDate().toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }

    // 일반 Date 객체나 문자열 처리
    const date = new Date(timestamp as string | number | Date);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // 로딩 상태
  if (loading) {
    return (
      <>
        <Head>
          <title>공지사항 - 부산대학교 정보의생명공학대학 학생회</title>
        </Head>
        <Header />
        <main className="pt-28 pb-16">
          <div className="container-custom py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 korean-text">
                공지사항을 불러오는 중...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // 에러 상태
  if (error || !notice) {
    return (
      <>
        <Head>
          <title>공지사항 - 부산대학교 정보의생명공학대학 학생회</title>
        </Head>
        <Header />
        <main className="pt-28 pb-16">
          <div className="container-custom py-20">
            <div className="text-center">
              <svg
                className="w-16 h-16 mx-auto text-gray-300 mb-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="text-2xl font-bold text-gray-700 mb-2 korean-text">
                공지를 찾을 수 없습니다
              </h2>
              <p className="text-gray-500 mb-6 korean-text">
                {error || "요청하신 공지사항이 존재하지 않거나 삭제되었습니다."}
              </p>
              <Link
                href="/notice"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors korean-text"
              >
                공지사항 목록으로 돌아가기
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>
          {notice.title} - 공지사항 - 부산대학교 정보의생명공학대학 학생회
        </title>
        <meta name="description" content={`${notice.title} - 공지사항`} />
      </Head>
      <Header />
      <main className="pt-28 pb-16">
        <div className="container-custom">
          <div className="mb-6">
            <Link
              href="/notice"
              className="inline-flex items-center text-gray-600 hover:text-primary transition-colors korean-text"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              공지사항 목록으로 돌아가기
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                        notice.category
                      )}`}
                    >
                      {notice.category}
                    </span>
                    {notice.important && (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
                        중요
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 korean-text">
                    {notice.title}
                  </h1>

                  <div className="flex flex-wrap items-center text-sm text-gray-500 mb-8 gap-y-2 gap-x-6">
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1.5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="korean-text">
                        {formatDate(notice.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="w-4 h-4 mr-1.5 text-gray-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path
                          fillRule="evenodd"
                          d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span className="korean-text">조회 {notice.views}</span>
                    </div>
                  </div>

                  <div
                    className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-table:text-sm korean-text"
                    dangerouslySetInnerHTML={{ __html: notice.content }}
                  />
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-xl shadow-md overflow-hidden sticky top-28"
              >
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4 korean-text">
                    관련 공지
                  </h3>
                  <div className="space-y-4">
                    {relatedNotices.length > 0 ? (
                      relatedNotices.map((item) => (
                        <Link
                          key={item.id}
                          href={`/notice/${item.id}`}
                          className="block"
                        >
                          <div className="group">
                            <div className="flex mb-1">
                              <span
                                className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(
                                  item.category
                                )}`}
                              >
                                {item.category}
                              </span>
                              {item.important && (
                                <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700 ml-2">
                                  중요
                                </span>
                              )}
                            </div>
                            <h4 className="text-base font-medium text-gray-800 group-hover:text-primary transition-colors line-clamp-2 korean-text">
                              {item.title}
                            </h4>
                            <div className="mt-1 text-sm text-gray-500 korean-text">
                              {formatDate(item.createdAt)}
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 korean-text">
                          관련 공지가 없습니다.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4 korean-text">
                      최근 공지
                    </h3>
                    <div className="space-y-4">
                      {recentNotices.map((item) => (
                        <Link
                          key={item.id}
                          href={`/notice/${item.id}`}
                          className="block"
                        >
                          <div className="group">
                            <div className="flex mb-1">
                              <span
                                className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(
                                  item.category
                                )}`}
                              >
                                {item.category}
                              </span>
                              {item.important && (
                                <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700 ml-2">
                                  중요
                                </span>
                              )}
                            </div>
                            <h4 className="text-base font-medium text-gray-800 group-hover:text-primary transition-colors line-clamp-2 korean-text">
                              {item.title}
                            </h4>
                            <div className="mt-1 text-sm text-gray-500 korean-text">
                              {formatDate(item.createdAt)}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
