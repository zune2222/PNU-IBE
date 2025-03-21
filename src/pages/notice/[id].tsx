import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "../../widgets/Header";
import { Footer } from "../../widgets/Footer";
import { event as gaEvent } from "../../shared/lib/analytics";

// 더미 공지사항 데이터
const noticeData = [
  {
    id: 1,
    title: "웹사이트 베타 버전 안내",
    category: "공지",
    date: "2024-03-22",
    views: 325,
    important: true,
    content: `
      <h3>웹사이트 베타 버전 안내</h3>
      <p>부산대학교 정보의생명공학대학 학우 여러분, 안녕하십니까?</p>
      <p>현재 학생회 웹사이트는 베타 버전으로 운영 중임을 알려드립니다.</p>
      
      <h4>베타 버전 안내사항</h4>
      <ul>
        <li>현재 사이트에는 일부 기능이 제한적으로 제공되고 있습니다.</li>
        <li>콘텐츠와 정보가 정확하지 않거나 완전하지 않을 수 있습니다.</li>
        <li>사이트 이용 중 오류가 발생할 수 있으며, 지속적으로 개선 중입니다.</li>
        <li>일부 페이지는 아직 개발 중이거나, 준비 중인 상태입니다.</li>
      </ul>
      
      <h4>향후 계획</h4>
      <ul>
        <li>단계적으로 기능을 추가하고 콘텐츠를 업데이트할 예정입니다.</li>
        <li>학우분들의 의견을 수렴하여 지속적으로 개선해 나가겠습니다.</li>
        <li>정식 버전 출시는 추후 공지를 통해 안내드리겠습니다.</li>
      </ul>
      
      <p>사이트 이용 중 불편사항이나 개선 의견이 있으시면 학생회(pnu.ibe@gmail.com)로 연락주시기 바랍니다.</p>
      
      <p>감사합니다.</p>
    `,
  },
  {
    id: 2,
    title: "2024 정의대 바람막이 단체 구매 안내",
    category: "학생회",
    date: "2024-03-22",
    views: 148,
    important: true,
    content: `
      <h3>2024 정의대 바람막이 단체 구매 안내</h3>
      <p>안녕하세요, 부산대학교 정보의생명공학대학 학생회 정의입니다.</p>
      <p>정의대 바람막이를 단체 구매하니, 구매를 원하시는 분들께서는 입금 후 신청 폼 작성부탁드립니다.</p>
      
      <h4>구매 안내</h4>
      <ul>
        <li><strong>신청 기간:</strong> 3월 24일(월) ~ 3월 30일(일)</li>
        <li><strong>상품 가격:</strong> 57,000원</li>
        <li><strong>입금 계좌:</strong> KB국민은행 275601-04-533239 (손정훈)</li>
        <li><strong>입금자명:</strong> 이름 + 전화번호 뒷 4자리 (예: 신태일1234)</li>
      </ul>
      
      <p><strong>(*원활한 확인을 위해, 입금 후 폼 작성 부탁드립니다.)</strong></p>
      <p><a href="https://forms.gle/FBoUCH1Qk42DA6qg8" target="_blank" class="text-primary hover:underline">신청 폼 작성하기</a></p>
      
      <p>날이 따뜻해지고 있어 빠르게 진행하기 위해 신청 기간을 일주일로 한정한 점 양해 부탁드립니다.</p>
      <p>디자인 및 사이즈 표는 첨부된 이미지를 참고해주시고, 바람막이 제작 기간은 최대 4주 소요될 예정입니다.</p>
      
      <h4>문의사항</h4>
      <p>문의사항은 학생회장에게 연락해 주시면 빠르게 답변드리겠습니다.</p>
      <p>많은 관심과 참여 부탁드립니다.</p>
    `,
  },
];

export default function NoticeDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [notice, setNotice] = useState<(typeof noticeData)[0] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // 실제로는 API 호출을 통해 데이터를 가져와야 함
      const foundNotice = noticeData.find((item) => item.id === Number(id));
      setNotice(foundNotice || null);
      setLoading(false);

      // Google Analytics 이벤트 전송
      if (foundNotice) {
        gaEvent({
          action: "view_notice",
          category: "notices",
          label: `${foundNotice.id} - ${foundNotice.title}`,
        });
      }
    }
  }, [id]);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "학생회":
        return "bg-blue-100 text-blue-700";
      case "동아리":
        return "bg-purple-100 text-purple-700";
      case "학사":
        return "bg-green-100 text-green-700";
      case "장학":
        return "bg-amber-100 text-amber-700";
      case "취업":
        return "bg-teal-100 text-teal-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <>
      <Head>
        <title>
          {notice ? `${notice.title} - 공지사항` : "공지사항"} - 부산대학교
          정보의생명공학대학 학생회
        </title>
        <meta
          name="description"
          content={
            notice
              ? `${notice.title} - 공지사항`
              : "부산대학교 정보의생명공학대학 학생회 공지사항"
          }
        />
      </Head>
      <Header />
      <main className="pt-28 pb-16">
        {loading ? (
          <div className="container-custom py-20">
            <div className="flex items-center justify-center">
              <svg
                className="animate-spin h-10 w-10 text-primary"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          </div>
        ) : notice ? (
          <div className="container-custom">
            <div className="mb-6">
              <Link
                href="/notice"
                className="inline-flex items-center text-gray-600 hover:text-primary transition-colors"
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

                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
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
                        {notice.date}
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
                        조회 {notice.views}
                      </div>
                    </div>

                    <div
                      className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-table:text-sm"
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
                    <h3 className="text-xl font-bold mb-4">관련 공지</h3>
                    <div className="space-y-4">
                      {noticeData
                        .filter(
                          (item) =>
                            item.id !== notice.id &&
                            item.category === notice.category
                        )
                        .slice(0, 3)
                        .map((item) => (
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
                              <h4 className="text-base font-medium text-gray-800 group-hover:text-primary transition-colors line-clamp-2">
                                {item.title}
                              </h4>
                              <div className="mt-1 text-sm text-gray-500">
                                {item.date}
                              </div>
                            </div>
                          </Link>
                        ))}

                      {noticeData.filter(
                        (item) =>
                          item.id !== notice.id &&
                          item.category === notice.category
                      ).length === 0 && (
                        <div className="text-center py-4">
                          <p className="text-gray-500">관련 공지가 없습니다.</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-8">
                      <h3 className="text-xl font-bold mb-4">최근 공지</h3>
                      <div className="space-y-4">
                        {noticeData
                          .filter((item) => item.id !== notice.id)
                          .sort(
                            (a, b) =>
                              new Date(b.date).getTime() -
                              new Date(a.date).getTime()
                          )
                          .slice(0, 3)
                          .map((item) => (
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
                                <h4 className="text-base font-medium text-gray-800 group-hover:text-primary transition-colors line-clamp-2">
                                  {item.title}
                                </h4>
                                <div className="mt-1 text-sm text-gray-500">
                                  {item.date}
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
        ) : (
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
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                공지를 찾을 수 없습니다
              </h2>
              <p className="text-gray-500 mb-6">
                요청하신 공지사항이 존재하지 않거나 삭제되었습니다.
              </p>
              <Link
                href="/notice"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                공지사항 목록으로 돌아가기
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
