import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "../../widgets/Header";
import { Footer } from "../../widgets/Footer";
import { eventService, FirestoreEvent } from "../../shared/services/firestore";
import {
  getCategoryColor,
  getStatusBadgeStyle,
  getStatusText,
} from "../../shared/data/eventsData";

export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [event, setEvent] = useState<FirestoreEvent | null>(null);
  const [relatedEvents, setRelatedEvents] = useState<FirestoreEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);

  // 데이터 로드
  useEffect(() => {
    if (!id || typeof id !== "string") return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 해당 행사 가져오기
        const eventData = await eventService.getById(id);

        if (!eventData) {
          setError("행사 정보를 찾을 수 없습니다.");
          return;
        }

        setEvent(eventData);

        // 모든 행사 가져오기
        const allEvents = await eventService.getAll();

        // 관련 행사 (같은 카테고리, 현재 행사 제외)
        const related = allEvents
          .filter(
            (item) =>
              item.id !== eventData.id && item.category === eventData.category
          )
          .slice(0, 3);
        setRelatedEvents(related);
      } catch (err) {
        console.error("행사 로드 실패:", err);
        setError("행사 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleRegister = () => {
    setIsRegistering(true);
    // 실제로는 여기서 등록 API를 호출하거나 등록 폼을 표시해야 함
    setTimeout(() => {
      alert("행사 참여 신청이 완료되었습니다!");
      setIsRegistering(false);
    }, 1000);
  };

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    return dateString.replace(/-/g, ".");
  };

  // 로딩 상태
  if (loading) {
    return (
      <>
        <Head>
          <title>행사 정보 - 부산대학교 정보의생명공학대학 학생회</title>
        </Head>
        <Header />
        <main className="pt-28 pb-16">
          <div className="container-custom py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600 korean-text">
                행사 정보를 불러오는 중...
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // 에러 상태
  if (error || !event) {
    return (
      <>
        <Head>
          <title>행사 정보 - 부산대학교 정보의생명공학대학 학생회</title>
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
                행사 정보를 찾을 수 없습니다
              </h2>
              <p className="text-gray-500 mb-6 korean-text">
                {error ||
                  "요청하신 행사 정보가 존재하지 않거나 삭제되었습니다."}
              </p>
              <Link
                href="/events"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors korean-text"
              >
                행사 목록으로 돌아가기
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
          {event.title} - 행사 정보 - 부산대학교 정보의생명공학대학 학생회
        </title>
        <meta
          name="description"
          content={`${event.title} - ${event.description}`}
        />
      </Head>
      <Header />
      <main className="pt-28 pb-16">
        <div className="container-custom">
          <div className="mb-6">
            <Link
              href="/events"
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
              행사 목록으로 돌아가기
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
                {/* 이벤트 상단 정보 */}
                <div className="relative h-64 md:h-80">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                          event.category
                        )}`}
                      >
                        {event.category}
                      </span>
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeStyle(
                          event.status
                        )}`}
                      >
                        {getStatusText(event.status)}
                      </span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white korean-text">
                      {event.title}
                    </h1>
                    <p className="text-white/80 korean-text">
                      {event.description}
                    </p>
                  </div>
                </div>

                {/* 이벤트 요약 정보 */}
                <div className="p-6 md:p-8 bg-white border-b">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <svg
                          className="w-5 h-5 mr-2 text-gray-500"
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
                        <span className="font-medium korean-text">날짜</span>
                      </div>
                      <p className="text-gray-800 korean-text">
                        {formatDate(event.date)}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <svg
                          className="w-5 h-5 mr-2 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium korean-text">시간</span>
                      </div>
                      <p className="text-gray-800 korean-text">{event.time}</p>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-600 mb-2">
                        <svg
                          className="w-5 h-5 mr-2 text-gray-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="font-medium korean-text">장소</span>
                      </div>
                      <p className="text-gray-800 korean-text">
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 이벤트 상세 내용 */}
                <div className="p-6 md:p-8">
                  <div
                    className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-table:text-sm korean-text"
                    dangerouslySetInnerHTML={{ __html: event.content || "" }}
                  />

                  {/* 이벤트 주최자 및 연락처 정보 */}
                  {(event.organizer || event.contact) && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-4 korean-text">
                        행사 주최 정보
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {event.organizer && (
                          <div className="flex items-start">
                            <svg
                              className="w-5 h-5 mr-3 text-gray-500 mt-1"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                            </svg>
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1 korean-text">
                                주최
                              </p>
                              <p className="text-gray-800 korean-text">
                                {event.organizer}
                              </p>
                            </div>
                          </div>
                        )}
                        {event.contact && (
                          <div className="flex items-start">
                            <svg
                              className="w-5 h-5 mr-3 text-gray-500 mt-1"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                            </svg>
                            <div>
                              <p className="text-sm font-medium text-gray-500 mb-1 korean-text">
                                연락처
                              </p>
                              <p className="text-gray-800 korean-text">
                                {event.contact}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* 참가 신청 버튼 (이벤트가 진행 예정이고, 참가 신청이 필요한 경우에만 표시) */}
                  {event.status !== "completed" &&
                    event.registrationRequired && (
                      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-1 korean-text">
                              참가 신청
                            </h3>
                            <p className="text-gray-600 korean-text">
                              {event.registrationDeadline
                                ? `신청 마감일: ${formatDate(
                                    event.registrationDeadline
                                  )}`
                                : "자세한 사항은 주최측에 문의해주세요."}
                            </p>
                          </div>
                          <button
                            onClick={handleRegister}
                            disabled={isRegistering}
                            className={`px-6 py-3 rounded-lg font-medium text-white korean-text ${
                              isRegistering
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-primary hover:bg-primary/90"
                            } transition-colors`}
                          >
                            {isRegistering ? (
                              <span className="flex items-center">
                                <svg
                                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                처리 중...
                              </span>
                            ) : (
                              "참가 신청하기"
                            )}
                          </button>
                        </div>
                      </div>
                    )}
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
                    행사 정보
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex">
                      <svg
                        className="w-5 h-5 mr-3 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-500 korean-text">
                          행사 유형
                        </p>
                        <p className="text-gray-800 korean-text">
                          {event.category}
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <svg
                        className="w-5 h-5 mr-3 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-500 korean-text">
                          날짜
                        </p>
                        <p className="text-gray-800 korean-text">
                          {formatDate(event.date)}
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <svg
                        className="w-5 h-5 mr-3 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-500 korean-text">
                          시간
                        </p>
                        <p className="text-gray-800 korean-text">
                          {event.time}
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <svg
                        className="w-5 h-5 mr-3 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-500 korean-text">
                          장소
                        </p>
                        <p className="text-gray-800 korean-text">
                          {event.location}
                        </p>
                      </div>
                    </li>
                    <li className="flex">
                      <svg
                        className="w-5 h-5 mr-3 text-primary"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <p className="text-sm font-medium text-gray-500 korean-text">
                          상태
                        </p>
                        <p className="text-gray-800 korean-text">
                          {getStatusText(event.status)}
                        </p>
                      </div>
                    </li>
                    {event.registrationRequired && (
                      <li className="flex">
                        <svg
                          className="w-5 h-5 mr-3 text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-500 korean-text">
                            참가 신청
                          </p>
                          <p className="text-gray-800 korean-text">필요</p>
                        </div>
                      </li>
                    )}
                    {event.registrationDeadline && (
                      <li className="flex">
                        <svg
                          className="w-5 h-5 mr-3 text-primary"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-500 korean-text">
                            신청 마감일
                          </p>
                          <p className="text-gray-800 korean-text">
                            {formatDate(event.registrationDeadline)}
                          </p>
                        </div>
                      </li>
                    )}
                  </ul>

                  {/* 관련 행사 */}
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4 korean-text">
                      관련 행사
                    </h3>
                    <div className="space-y-4">
                      {relatedEvents.length > 0 ? (
                        relatedEvents.map((item) => (
                          <Link
                            key={item.id}
                            href={`/events/${item.id}`}
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
                                <span
                                  className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full ml-2 ${getStatusBadgeStyle(
                                    item.status
                                  )}`}
                                >
                                  {getStatusText(item.status)}
                                </span>
                              </div>
                              <h4 className="text-base font-medium text-gray-800 group-hover:text-primary transition-colors line-clamp-2 korean-text">
                                {item.title}
                              </h4>
                              <div className="mt-1 text-sm text-gray-500 korean-text">
                                {formatDate(item.date)}
                              </div>
                            </div>
                          </Link>
                        ))
                      ) : (
                        <div className="text-center py-4">
                          <p className="text-gray-500 korean-text">
                            관련 행사가 없습니다.
                          </p>
                        </div>
                      )}
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
