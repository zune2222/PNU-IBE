import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "../../widgets/Header";
import { Footer } from "../../widgets/Footer";

// 더미 이벤트 데이터
const eventsData = [
  {
    id: 1,
    title: "정보의생명공학대학 체육대회",
    category: "체육",
    date: "2025-04-15",
    time: "09:00 - 18:00",
    location: "부산대학교 대운동장",
    image: "/images/events/sports.jpg",
    status: "upcoming",
    description:
      "매년 진행되는 정보의생명공학대학 체육대회입니다. 학과별 축구, 농구, 발야구 등 다양한 종목이 준비되어 있습니다.",
    content: `
      <h3>정보의생명공학대학 체육대회</h3>
      <p>정보의생명공학대학의 모든 학과가 참여하는 연례 체육대회입니다. 다양한 스포츠 경기와 레크리에이션을 통해 학과 간 화합과 단결을 도모합니다.</p>
      
      <h4>행사 개요</h4>
      <ul>
        <li>일시: 2025년 4월 15일 (목) 09:00 - 18:00</li>
        <li>장소: 부산대학교 대운동장</li>
        <li>참가 대상: 정보의생명공학대학 재학생</li>
        <li>준비물: 운동복, 운동화, 개인 물병</li>
      </ul>
      
      <h4>종목 안내</h4>
      <ul>
        <li>축구: 5인제, 조별 리그 후 토너먼트</li>
        <li>농구: 3대3 하프코트, 토너먼트</li>
        <li>발야구: 학과 대항전</li>
        <li>줄다리기: 학과 대항전</li>
        <li>미니게임: 다양한 레크리에이션 게임</li>
      </ul>
      
      <h4>시간표</h4>
      <p>09:00 - 09:30: 개회식 및 준비운동<br>
      09:30 - 12:00: 오전 경기 (축구, 농구 예선)<br>
      12:00 - 13:00: 점심 시간<br>
      13:00 - 16:30: 오후 경기 (발야구, 줄다리기, 결승전)<br>
      16:30 - 17:30: 미니게임 및 레크리에이션<br>
      17:30 - 18:00: 시상식 및 폐회식</p>
      
      <h4>안내사항</h4>
      <ul>
        <li>참가 신청은 각 학과 학생회를 통해 4월 5일까지 접수 바랍니다.</li>
        <li>우천 시 체육관에서 변경된 일정으로 진행됩니다.</li>
        <li>부상 방지를 위해 준비운동을 충분히 해주시기 바랍니다.</li>
        <li>점심 식사는 행사장에서 제공됩니다.</li>
      </ul>
      
      <p>문의사항이 있으신 경우 학생회(051-510-1234)로 연락주시기 바랍니다.</p>
    `,
    organizer: "정보의생명공학대학 학생회",
    contact: "051-510-1234",
    registrationRequired: true,
    registrationDeadline: "2025-04-05",
  },
  {
    id: 2,
    title: "프로그래밍 경진대회",
    category: "학술",
    date: "2025-03-10",
    time: "13:00 - 18:00",
    location: "제2공학관 강당",
    image: "/images/events/programming.jpg",
    status: "upcoming",
    description:
      "알고리즘 문제 해결 능력을 겨루는 프로그래밍 경진대회입니다. 다양한 상품과 상금이 마련되어 있습니다.",
    content: `
      <h3>프로그래밍 경진대회</h3>
      <p>알고리즘 문제 해결 능력을 겨루는 프로그래밍 경진대회입니다. 창의적인 사고와 효율적인 코드 작성 능력을 평가하며, 우수한 성적을 거둔 참가자에게는 다양한 상품과 상금이 준비되어 있습니다.</p>
      
      <h4>대회 개요</h4>
      <ul>
        <li>일시: 2025년 3월 10일 (월) 13:00 - 18:00</li>
        <li>장소: 제2공학관 강당</li>
        <li>참가 대상: 부산대학교 재학생 (전공 무관)</li>
        <li>참가비: 무료</li>
      </ul>
      
      <h4>대회 형식</h4>
      <ul>
        <li>개인전으로 진행</li>
        <li>5시간 동안 8-10개의 알고리즘 문제 해결</li>
        <li>사용 가능 언어: C, C++, Java, Python</li>
        <li>온라인 저지 시스템을 통한 실시간 채점</li>
      </ul>
      
      <h4>시상 내역</h4>
      <ul>
        <li>대상(1명): 상장 및 상금 50만원</li>
        <li>금상(2명): 상장 및 상금 30만원</li>
        <li>은상(3명): 상장 및 상금 20만원</li>
        <li>동상(5명): 상장 및 상금 10만원</li>
        <li>참가상: 기념품</li>
      </ul>
      
      <h4>준비물</h4>
      <ul>
        <li>학생증</li>
        <li>개인 노트북 (전원 어댑터 포함)</li>
      </ul>
      
      <h4>유의사항</h4>
      <ul>
        <li>인터넷 검색 및 외부 자료 참조는 금지됩니다.</li>
        <li>사전에 작성한 코드 사용은 금지됩니다.</li>
        <li>참가자는 대회 시작 30분 전까지 입실해야 합니다.</li>
      </ul>
      
      <p>문의사항이 있으신 경우 정보컴퓨터공학부 학생회(051-510-2345)로 연락주시기 바랍니다.</p>
    `,
    organizer: "정보컴퓨터공학부 알고리즘 학회",
    contact: "051-510-2345",
    registrationRequired: true,
    registrationDeadline: "2025-03-05",
  },
  {
    id: 3,
    title: "새내기 환영회",
    category: "문화",
    date: "2025-03-02",
    time: "17:00 - 21:00",
    location: "학생회관 대강당",
    image: "/images/events/welcome.jpg",
    status: "ongoing",
    description:
      "신입생들을 환영하는 행사로, 학과 소개 및 선배들과의 만남의 시간이 준비되어 있습니다.",
    content: `
      <h3>새내기 환영회</h3>
      <p>정보의생명공학대학에 입학한 새내기 여러분을 환영합니다! 이번 행사는 학과 생활에 필요한 정보를 제공하고 선후배 간의 유대감을 형성하기 위한 자리입니다.</p>
      
      <h4>행사 개요</h4>
      <ul>
        <li>일시: 2025년 3월 2일 (일) 17:00 - 21:00</li>
        <li>장소: 학생회관 대강당</li>
        <li>참가 대상: 2025학년도 정보의생명공학대학 신입생 및 재학생</li>
      </ul>
      
      <h4>행사 일정</h4>
      <p>17:00 - 17:30: 등록 및 입장<br>
      17:30 - 18:00: 학장님 환영사 및 학과 소개<br>
      18:00 - 19:00: 저녁 식사<br>
      19:00 - 20:00: 학과별 소개 및 선배와의 만남<br>
      20:00 - 21:00: 레크리에이션 및 친목 활동</p>
      
      <h4>프로그램</h4>
      <ul>
        <li>학과 생활 가이드: 수강신청, 학점 관리, 장학금 등 꿀팁 공유</li>
        <li>동아리/학회 소개: 다양한 학과 동아리 및 학회 활동 소개</li>
        <li>멘토-멘티 매칭: 1:3 비율로 선배와 후배 매칭</li>
        <li>아이스브레이킹 게임: 즐거운 친목 활동</li>
      </ul>
      
      <h4>참가 신청</h4>
      <p>참가 신청은 각 학과 학생회를 통해서 가능합니다. 신청 마감은 2월 25일까지입니다.</p>
      
      <p>문의사항이 있으신 경우 학생회(051-510-1234)로 연락주시기 바랍니다.</p>
    `,
    organizer: "정보의생명공학대학 학생회",
    contact: "051-510-1234",
    registrationRequired: true,
    registrationDeadline: "2025-02-25",
  },
  {
    id: 4,
    title: "진로 탐색 워크샵",
    category: "취업",
    date: "2025-02-28",
    time: "14:00 - 17:00",
    location: "제1공학관 세미나실",
    image: "/images/events/career.jpg",
    status: "ongoing",
    description:
      "다양한 기업의 현직자들을 초청하여 진로 탐색에 도움을 주는 워크샵입니다.",
    content: `
      <h3>진로 탐색 워크샵</h3>
      <p>정보의생명공학대학 학생들의 진로 탐색을 돕기 위해 다양한 분야의 현직자들을 초청한 워크샵입니다. 실제 업무 환경과 필요한 역량에 대한 이야기를 듣고 질의응답 시간을 통해 궁금증을 해소할 수 있는 기회입니다.</p>
      
      <h4>행사 개요</h4>
      <ul>
        <li>일시: 2025년 2월 28일 (금) 14:00 - 17:00</li>
        <li>장소: 제1공학관 세미나실</li>
        <li>참가 대상: 정보의생명공학대학 재학생 및 졸업생</li>
        <li>참가비: 무료</li>
      </ul>
      
      <h4>초청 연사</h4>
      <ul>
        <li>김민준 (네이버 - 소프트웨어 엔지니어)</li>
        <li>이서연 (삼성전자 - 인공지능 연구원)</li>
        <li>박지훈 (LG생명과학 - 바이오정보학 연구원)</li>
        <li>정수아 (카카오 - 데이터 분석가)</li>
        <li>최우진 (스타트업 창업자 - 인지컴퓨팅 분야)</li>
      </ul>
      
      <h4>프로그램</h4>
      <p>14:00 - 14:10: 개회사<br>
      14:10 - 15:30: 패널 토크 (각 연사별 15-20분 발표)<br>
      15:30 - 15:50: 휴식<br>
      15:50 - 16:40: 질의응답 및 패널 토론<br>
      16:40 - 17:00: 네트워킹</p>
      
      <h4>혜택</h4>
      <ul>
        <li>참가자 전원에게 간식 제공</li>
        <li>참석확인서 발급 가능</li>
        <li>연사와의 1:1 대화 기회</li>
      </ul>
      
      <p>문의사항이 있으신 경우 취업지원센터(051-510-3456)로 연락주시기 바랍니다.</p>
    `,
    organizer: "취업지원센터",
    contact: "051-510-3456",
    registrationRequired: true,
    registrationDeadline: "2025-02-25",
  },
];

export default function EventDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<(typeof eventsData)[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (id) {
      // 실제로는 API 호출을 통해 데이터를 가져와야 함
      const foundEvent = eventsData.find((item) => item.id === Number(id));
      setEvent(foundEvent || null);
      setLoading(false);
    }
  }, [id]);

  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "진행 예정";
      case "ongoing":
        return "진행 중";
      case "completed":
        return "종료";
      default:
        return status;
    }
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "ongoing":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case "학술":
        return "bg-purple-100 text-purple-700";
      case "체육":
        return "bg-red-100 text-red-700";
      case "문화":
        return "bg-amber-100 text-amber-700";
      case "취업":
        return "bg-teal-100 text-teal-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleRegister = () => {
    setIsRegistering(true);
    // 실제로는 여기서 API 호출을 통해 참가 신청을 진행
    setTimeout(() => {
      alert(
        "참가 신청이 완료되었습니다. 자세한 내용은 이메일로 안내드릴 예정입니다."
      );
      setIsRegistering(false);
    }, 1500);
  };

  return (
    <>
      <Head>
        <title>
          {event ? `${event.title} - 행사 정보` : "행사 정보"} - 부산대학교
          정보의생명공학대학 학생회
        </title>
        <meta
          name="description"
          content={
            event
              ? `${event.title} - ${event.description}`
              : "부산대학교 정보의생명공학대학 학생회 행사 정보"
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
        ) : event ? (
          <div className="container-custom">
            <div className="mb-6">
              <Link
                href="/events"
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
                  <div className="relative h-72 w-full">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeStyle(
                          event.status
                        )}`}
                      >
                        {getStatusText(event.status)}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryBadgeStyle(
                          event.category
                        )}`}
                      >
                        {event.category}
                      </span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                      {event.title}
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                      <div className="flex items-start">
                        <svg
                          className="w-5 h-5 mr-2 text-gray-400 mt-0.5"
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
                        <div>
                          <p className="font-medium text-gray-700">날짜</p>
                          <p className="text-gray-600">{event.date}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <svg
                          className="w-5 h-5 mr-2 text-gray-400 mt-0.5"
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
                        <div>
                          <p className="font-medium text-gray-700">시간</p>
                          <p className="text-gray-600">{event.time}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <svg
                          className="w-5 h-5 mr-2 text-gray-400 mt-0.5"
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
                        <div>
                          <p className="font-medium text-gray-700">장소</p>
                          <p className="text-gray-600">{event.location}</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <svg
                          className="w-5 h-5 mr-2 text-gray-400 mt-0.5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                        </svg>
                        <div>
                          <p className="font-medium text-gray-700">주최</p>
                          <p className="text-gray-600">{event.organizer}</p>
                        </div>
                      </div>
                    </div>

                    <div
                      className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700"
                      dangerouslySetInnerHTML={{ __html: event.content }}
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
                    <h3 className="text-xl font-bold mb-4">행사 정보</h3>

                    <div className="space-y-4 mb-6">
                      <div>
                        <p className="text-sm text-gray-500">상태</p>
                        <p className="font-medium">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeStyle(
                              event.status
                            )}`}
                          >
                            {getStatusText(event.status)}
                          </span>
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">카테고리</p>
                        <p className="font-medium">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryBadgeStyle(
                              event.category
                            )}`}
                          >
                            {event.category}
                          </span>
                        </p>
                      </div>

                      {event.registrationRequired && (
                        <div>
                          <p className="text-sm text-gray-500">
                            참가 신청 마감일
                          </p>
                          <p className="font-medium">
                            {event.registrationDeadline}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-sm text-gray-500">문의처</p>
                        <p className="font-medium">{event.contact}</p>
                      </div>
                    </div>

                    {event.status !== "completed" && (
                      <button
                        onClick={handleRegister}
                        disabled={isRegistering}
                        className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                      >
                        {isRegistering ? (
                          <>
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
                          </>
                        ) : (
                          "참가 신청하기"
                        )}
                      </button>
                    )}

                    {event.status === "completed" && (
                      <div className="text-center p-3 bg-gray-100 rounded-lg">
                        <p className="text-gray-600">이미 종료된 행사입니다</p>
                      </div>
                    )}

                    <div className="mt-4">
                      <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors flex items-center justify-center">
                        <svg
                          className="w-5 h-5 mr-2"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                        공유하기
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="mt-10">
              <h3 className="text-xl font-bold mb-4">관련 행사</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {eventsData
                  .filter(
                    (item) =>
                      item.id !== event.id && item.category === event.category
                  )
                  .slice(0, 3)
                  .map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                    >
                      <Link href={`/events/${item.id}`}>
                        <div className="relative h-48 w-full">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-4 right-4">
                            <span
                              className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusBadgeStyle(
                                item.status
                              )}`}
                            >
                              {getStatusText(item.status)}
                            </span>
                          </div>
                        </div>
                        <div className="p-6">
                          <div className="flex items-center mb-3">
                            <span
                              className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryBadgeStyle(
                                item.category
                              )}`}
                            >
                              {item.category}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold mb-2 line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {item.description}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <svg
                              className="w-4 h-4 mr-1 text-gray-400"
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
                            {item.date}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
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
                행사 정보를 찾을 수 없습니다
              </h2>
              <p className="text-gray-500 mb-6">
                요청하신 행사 정보가 존재하지 않거나 삭제되었습니다.
              </p>
              <Link
                href="/events"
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 transition-colors"
              >
                행사 목록으로 돌아가기
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
