import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Header } from "../../widgets/Header";
import { Footer } from "../../widgets/Footer";
import { apiClient } from "../../shared/services/api";
import { esportsApiService } from "../../shared/services/esportsApi";
import { useToast } from "../../shared/components/Toast";

interface Event {
  eventId: number;
  eventName: string;
  status: string;
}

type GameType = "LOL" | "PUBG" | "FIFA";

interface RankingUser {
  studentId: string;
  name: string;
  totalScore: number;
  gameScores: {
    [key in GameType]?: number;
  };
  rank: number;
}

interface GameResult {
  teamId: number;
  teamName: string;
  rank: number;
}

interface BettingPointSummary {
  eventId: number;
  studentId: string;
  totalScore: number;
  lolScore: number;
  pubgScore: number;
  fifaScore: number;
  hasResults: boolean;
}

export default function ESportsRanking() {
  const router = useRouter();
  const { eventId } = router.query;
  const { showToast } = useToast();

  const [event, setEvent] = useState<Event | null>(null);
  const [selectedView, setSelectedView] = useState<"ranking" | "results">(
    "ranking"
  );
  const [selectedGame, setSelectedGame] = useState<GameType>("LOL");
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [gameResults, setGameResults] = useState<{
    [key in GameType]?: GameResult[];
  }>({});
  const [myBettingPoints, setMyBettingPoints] =
    useState<BettingPointSummary | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = useCallback(async () => {
    try {
      const response = await apiClient.get<{
        event_id: number;
        event_name: string;
        status: string;
      }>(`/api/admin/events/${eventId}`);
      setEvent({
        eventId: response.event_id,
        eventName: response.event_name,
        status: response.status,
      });
    } catch (error: unknown) {
      console.error("이벤트 정보 조회 실패:", error);
      if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof (error as { message: unknown }).message === "string" &&
        ((error as { message: string }).message.includes("404") ||
          (error as { message: string }).message.includes("찾을 수 없습니다"))
      ) {
        showToast({
          type: "error",
          message: "이벤트를 찾을 수 없습니다. 이벤트 목록으로 돌아갑니다.",
        });
        router.push("/esports");
      }
    }
  }, [eventId, showToast, router]);

  const fetchRanking = useCallback(async () => {
    try {
      const response = await apiClient.get<{
        rankings: {
          student_id: string;
          name: string;
          final_score?: number;
          lol_score?: number;
          pubg_score?: number;
          fifa_score?: number;
          rank: number;
        }[];
      }>(`/api/ranking?eventId=${eventId}`);
      const rankingData: RankingUser[] = response.rankings.map((entry) => ({
        studentId: entry.student_id,
        name: entry.name,
        totalScore: entry.final_score || 0,
        gameScores: {
          LOL: entry.lol_score || 0,
          PUBG: entry.pubg_score || 0,
          FIFA: entry.fifa_score || 0,
        },
        rank: entry.rank,
      }));
      setRanking(rankingData);
    } catch (error) {
      console.error("순위 조회 실패:", error);
    }
  }, [eventId]);

  const fetchGameResults = useCallback(async () => {
    try {
      const results: { [key in GameType]?: GameResult[] } = {};

      for (const gameType of ["LOL", "PUBG", "FIFA"] as GameType[]) {
        try {
          const response = await apiClient.get<{
            success: boolean;
            results?: {
              team_id: number;
              team_name: string;
              rank: number;
            }[];
          }>(`/api/admin/results?eventId=${eventId}&gameType=${gameType}`);
          if (response.success && response.results) {
            results[gameType] = response.results.map((result) => ({
              teamId: result.team_id,
              teamName: result.team_name,
              rank: result.rank,
            }));
          }
        } catch (error) {
          console.error(`${gameType} 결과 조회 실패:`, error);
        }
      }

      setGameResults(results);
    } catch (error) {
      console.error("게임 결과 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  const fetchMyBettingPoints = useCallback(async () => {
    try {
      const pointSummary = await esportsApiService.getMyPointSummary(eventId);
      setMyBettingPoints(pointSummary);
    } catch (error) {
      console.error("내 베팅 포인트 조회 실패:", error);
      // 로그인하지 않은 경우에는 null 상태 유지
    }
  }, [eventId]);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
      fetchRanking();
      fetchGameResults();
      fetchMyBettingPoints();
    }
  }, [
    eventId,
    fetchEvent,
    fetchRanking,
    fetchGameResults,
    fetchMyBettingPoints,
  ]);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-600 bg-yellow-50";
      case 2:
        return "text-gray-600 bg-gray-50";
      case 3:
        return "text-orange-600 bg-orange-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `${rank}위`;
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>순위표 | E-Sports | 부산대학교 정보의생명공학대학 학생회</title>
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 섹션 */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-4">
              <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
              <span className="text-sm font-semibold text-primary korean-text whitespace-nowrap">
                순위표
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold korean-text mb-2 px-4">
              <span className="bg-gradient-to-r from-dark to-gray-700 bg-clip-text text-transparent">
                승부 예측{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  순위표
                </span>
              </span>
            </h1>
            <h2 className="text-base sm:text-lg text-gray-600 korean-text px-4 break-words">
              {event?.eventName}
            </h2>
          </div>

          {/* 탭 선택 */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 mb-6 sm:mb-8">
            <div className="border-b border-gray-100">
              <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 md:px-8">
                <button
                  onClick={() => setSelectedView("ranking")}
                  className={`py-4 sm:py-5 px-1 border-b-2 font-medium text-xs sm:text-sm korean-text transition-colors whitespace-nowrap ${
                    selectedView === "ranking"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1 sm:mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="hidden xs:inline">승부 예측 </span>순위
                </button>
                <button
                  onClick={() => setSelectedView("results")}
                  className={`py-4 sm:py-5 px-1 border-b-2 font-medium text-xs sm:text-sm korean-text transition-colors whitespace-nowrap ${
                    selectedView === "results"
                      ? "border-primary text-primary"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4 inline mr-1 sm:mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  게임 결과
                </button>
              </nav>
            </div>
          </div>

          {selectedView === "ranking" ? (
            <div className="space-y-6">
              {/* 내 베팅 포인트 요약 */}
              {myBettingPoints && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-md border border-blue-200">
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-blue-900 mb-3 sm:mb-4 flex items-center korean-text">
                      <svg
                        className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                      <span className="break-words">내 베팅 포인트 현황</span>
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                      <div className="text-center p-3 sm:p-4 bg-white rounded-lg border">
                        <div className="text-lg sm:text-2xl font-bold text-blue-600">
                          {myBettingPoints.lolScore}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1 mt-1">
                          <img
                            src="/lol2.png"
                            alt="League of Legends"
                            className="w-auto h-3 sm:h-4"
                          />
                          <span className="korean-text">LoL</span>
                        </div>
                      </div>
                      <div className="text-center p-3 sm:p-4 bg-white rounded-lg border">
                        <div className="text-lg sm:text-2xl font-bold text-orange-600">
                          {myBettingPoints.pubgScore}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1 mt-1">
                          <img
                            src="https://pngimg.com/d/pubg_PNG55.png"
                            alt="PUBG"
                            className="w-3 h-3 sm:w-4 sm:h-4"
                          />
                          <span className="korean-text">PUBG</span>
                        </div>
                      </div>
                      <div className="text-center p-3 sm:p-4 bg-white rounded-lg border">
                        <div className="text-lg sm:text-2xl font-bold text-green-600">
                          {myBettingPoints.fifaScore}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1 mt-1">
                          <img
                            src="/fconline.svg"
                            alt="FC Online"
                            className="w-3 h-3 sm:w-4 sm:h-4"
                          />
                          <span className="korean-text">FC</span>
                        </div>
                      </div>
                      <div className="text-center p-3 sm:p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg col-span-2 md:col-span-1">
                        <div className="text-lg sm:text-2xl font-bold">
                          {myBettingPoints.totalScore}
                        </div>
                        <div className="text-xs sm:text-sm mt-1 korean-text">총 획득 점수</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 승부 예측 순위 */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 korean-text">
                    승부 예측 순위
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 korean-text">
                    예측 정확도에 따른 최종 순위입니다
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider korean-text">
                          순위
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider korean-text">
                          학생
                        </th>
                        <th className="px-2 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          LoL
                        </th>
                        <th className="px-2 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          PUBG
                        </th>
                        <th className="px-2 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          FIFA
                        </th>
                        <th className="px-3 sm:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider korean-text">
                          총점
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {ranking.map((user, index) => (
                        <tr
                          key={user.studentId}
                          className={index < 3 ? "bg-yellow-50" : ""}
                        >
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getRankColor(
                                user.rank
                              )}`}
                            >
                              {getRankIcon(user.rank)}
                            </div>
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap">
                            <div>
                              <div className="text-xs sm:text-sm font-medium text-gray-900 korean-text">
                                {user.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {user.studentId}
                              </div>
                            </div>
                          </td>
                          <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center text-xs sm:text-sm text-gray-900">
                            {user.gameScores.LOL || "-"}
                          </td>
                          <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center text-xs sm:text-sm text-gray-900">
                            {user.gameScores.PUBG || "-"}
                          </td>
                          <td className="px-2 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center text-xs sm:text-sm text-gray-900">
                            {user.gameScores.FIFA || "-"}
                          </td>
                          <td className="px-3 sm:px-6 py-3 sm:py-4 whitespace-nowrap text-center">
                            <span className="text-base sm:text-lg font-semibold text-blue-600">
                              {user.totalScore}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            /* 게임 결과 */
            <div className="space-y-4 sm:space-y-6">
              {/* 게임 선택 */}
              <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 korean-text">
                  게임 선택
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    { value: "LOL", name: "League of Legends" },
                    { value: "PUBG", name: "PUBG" },
                    { value: "FIFA", name: "FC Online" },
                  ].map((game) => (
                    <button
                      key={game.value}
                      onClick={() => setSelectedGame(game.value as GameType)}
                      className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedGame === game.value
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="mb-2 flex justify-center">
                        {game.value === "LOL" && (
                          <img
                            src="/lol2.png"
                            alt="League of Legends"
                            className="w-auto h-3 sm:h-4"
                          />
                        )}
                        {game.value === "PUBG" && (
                          <img
                            src="https://pngimg.com/d/pubg_PNG55.png"
                            alt="PUBG"
                            className="w-6 h-6 sm:w-8 sm:h-8"
                          />
                        )}
                        {game.value === "FIFA" && (
                          <img
                            src="/fconline.svg"
                            alt="FC Online"
                            className="w-6 h-6 sm:w-8 sm:h-8"
                          />
                        )}
                      </div>
                      <div className="font-semibold text-sm sm:text-base korean-text">{game.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 게임 결과 */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-4 sm:p-6 border-b border-gray-200">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center korean-text">
                    {selectedGame} 경기 결과
                  </h3>
                </div>

                <div className="p-4 sm:p-6">
                  {gameResults[selectedGame] ? (
                    <div className="space-y-3 sm:space-y-4">
                      {gameResults[selectedGame]!.map((result, index) => (
                        <div
                          key={result.teamId}
                          className={`flex items-center justify-between p-3 sm:p-4 rounded-lg border-2 ${
                            index === 0
                              ? "border-yellow-300 bg-yellow-50"
                              : index === 1
                              ? "border-gray-300 bg-gray-50"
                              : index === 2
                              ? "border-orange-300 bg-orange-50"
                              : "border-gray-200 bg-white"
                          }`}
                        >
                          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                            <div
                              className={`text-xl sm:text-2xl flex-shrink-0 ${
                                index === 0
                                  ? "text-yellow-600"
                                  : index === 1
                                  ? "text-gray-600"
                                  : index === 2
                                  ? "text-orange-600"
                                  : "text-blue-600"
                              }`}
                            >
                              {getRankIcon(result.rank)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-base sm:text-lg font-semibold text-gray-900 korean-text break-words">
                                {result.teamName}
                              </div>
                              <div className="text-xs sm:text-sm text-gray-600 korean-text">
                                {result.rank}위
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-sm sm:text-base text-gray-600 korean-text">
                      아직 결과가 없습니다.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
