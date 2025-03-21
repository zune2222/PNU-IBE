import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "../../widgets/Header";
import { Footer } from "../../widgets/Footer";

// 더미 공지사항 데이터
const noticeData = [
  {
    id: 1,
    title: "2025학년도 1학기 학생회비 납부 안내",
    category: "학생회",
    date: "2025-02-15",
    views: 256,
    important: true,
    content: `
      <h3>2025학년도 1학기 학생회비 납부 안내</h3>
      <p>정보의생명공학대학 학우 여러분, 안녕하십니까?</p>
      <p>2025학년도 1학기 학생회비 납부에 관한 안내를 드립니다.</p>
      
      <h4>학생회비 안내</h4>
      <ul>
        <li>금액: 15,000원</li>
        <li>납부 기간: 2025년 2월 20일 ~ 3월 15일</li>
        <li>납부 방법: 계좌이체 또는 현장납부</li>
      </ul>
      
      <h4>계좌 정보</h4>
      <p>부산은행 123-456-789012 (예금주: 정보의생명공학대학 학생회)</p>
      
      <h4>현장 납부 장소 및 시간</h4>
      <ul>
        <li>장소: 정보의생명공학대학 학생회실 (제2공학관 201호)</li>
        <li>시간: 평일 10:00 ~ 17:00</li>
      </ul>
      
      <h4>학생회비 사용 계획</h4>
      <ul>
        <li>학과 행사 (신입생 환영회, 체육대회, 학술제 등)</li>
        <li>복지 사업 (간식 나눔, 휴게공간 관리 등)</li>
        <li>학생 지원 (스터디룸 운영, 학술활동 지원 등)</li>
        <li>동아리 활동 지원</li>
      </ul>
      
      <p>학생회비 납부 여부는 향후 학생회에서 주관하는 각종 행사 참여 및 복지 혜택 제공에 영향을 미칠 수 있습니다. 많은 참여 부탁드립니다.</p>
      
      <p>문의사항이 있으신 경우 학생회(051-510-1234)로 연락주시기 바랍니다.</p>
    `,
  },
  {
    id: 2,
    title: "정보의생명공학대학 동아리 모집 공고",
    category: "동아리",
    date: "2025-02-25",
    views: 183,
    important: false,
    content: `
      <h3>정보의생명공학대학 동아리 모집 공고</h3>
      <p>2025학년도 1학기 정보의생명공학대학 소속 동아리 회원을 모집합니다.</p>
      
      <h4>모집 동아리</h4>
      <ul>
        <li><strong>코딩클럽</strong> - 프로그래밍 및 알고리즘 스터디</li>
        <li><strong>바이오헬스</strong> - 의생명 분야 학술 및 연구 활동</li>
        <li><strong>데이터사이언스</strong> - 데이터 분석 및 머신러닝 학습</li>
        <li><strong>PNUGC</strong> - 게임 개발 동아리</li>
        <li><strong>네트워크 연구회</strong> - 네트워크 및 보안 연구</li>
        <li><strong>디지털아트</strong> - 디지털 그래픽 및 UI/UX 디자인</li>
      </ul>
      
      <h4>지원 자격</h4>
      <ul>
        <li>정보의생명공학대학 재학생</li>
        <li>해당 분야에 관심 있는 타 단과대학 재학생도 지원 가능</li>
      </ul>
      
      <h4>모집 기간</h4>
      <p>2025년 3월 2일 ~ 3월 10일</p>
      
      <h4>지원 방법</h4>
      <ol>
        <li>정보의생명공학대학 홈페이지에서 지원서 양식 다운로드</li>
        <li>작성한 지원서를 각 동아리 이메일로 제출</li>
        <li>면접 일정은 개별 안내 예정</li>
      </ol>
      
      <h4>문의처</h4>
      <ul>
        <li>코딩클럽: coding.club@pnu.ac.kr</li>
        <li>바이오헬스: biohealth@pnu.ac.kr</li>
        <li>데이터사이언스: datasci@pnu.ac.kr</li>
        <li>PNUGC: game.club@pnu.ac.kr</li>
        <li>네트워크 연구회: network.club@pnu.ac.kr</li>
        <li>디지털아트: digital.art@pnu.ac.kr</li>
      </ul>
      
      <p>각 동아리별 상세 활동 내용은 3월 2일 개최되는 동아리 박람회에서 확인하실 수 있습니다.</p>
    `,
  },
  {
    id: 3,
    title: "학과 도서관 운영시간 변경 안내",
    category: "학사",
    date: "2025-03-01",
    views: 142,
    important: false,
    content: `
      <h3>학과 도서관 운영시간 변경 안내</h3>
      <p>정보의생명공학대학 학우 여러분, 안녕하십니까?</p>
      <p>2025학년도 1학기부터 학과 도서관 운영시간이 변경됨을 알려드립니다.</p>
      
      <h4>변경 사항</h4>
      <table class="border-collapse border w-full my-4">
        <thead>
          <tr class="bg-gray-100">
            <th class="border p-2">구분</th>
            <th class="border p-2">기존</th>
            <th class="border p-2">변경</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border p-2">평일</td>
            <td class="border p-2">09:00 ~ 18:00</td>
            <td class="border p-2">08:00 ~ 20:00</td>
          </tr>
          <tr>
            <td class="border p-2">토요일</td>
            <td class="border p-2">09:00 ~ 13:00</td>
            <td class="border p-2">09:00 ~ 17:00</td>
          </tr>
          <tr>
            <td class="border p-2">공휴일</td>
            <td class="border p-2">휴관</td>
            <td class="border p-2">10:00 ~ 17:00</td>
          </tr>
        </tbody>
      </table>
      
      <h4>주요 변경 사유</h4>
      <ul>
        <li>학생들의 도서관 이용 편의성 향상</li>
        <li>시험 기간 자율학습 공간 확대</li>
        <li>이용자 설문조사 결과 반영</li>
      </ul>
      
      <h4>추가 안내 사항</h4>
      <ul>
        <li>시험 기간(중간/기말고사 2주 전부터) 평일 24시간 운영</li>
        <li>도서 대출/반납은 평일 09:00 ~ 18:00에만 가능</li>
        <li>그룹 스터디룸은 홈페이지 예약 시스템을 통해 예약 가능</li>
      </ul>
      
      <p>학과 도서관은 학생 여러분의 학업 공간입니다. 조용한 학습 환경을 위해 협조해 주시기 바랍니다.</p>
      
      <p>문의: 학과 도서관 담당자 051-510-2345</p>
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
