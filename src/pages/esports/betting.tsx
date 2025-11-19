import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Header } from "../../widgets/Header";
import { Footer } from "../../widgets/Footer";
import { useESSportsAuth } from "../../shared/contexts/ESSportsAuthContext";
import { useToast } from "../../shared/components/Toast";
import { useEvent } from "../../shared/hooks/useEvent";
import { esportsApiService } from "../../shared/services/esportsApi";
import { ESportsConstants } from "../../shared/constants/esports";
import LoLPlayerStats from "../../components/esports/LoLPlayerStats";
import PubgPlayerStats from "../../components/esports/PubgPlayerStats";
import FifaPlayerStats from "../../components/esports/FifaPlayerStats";
import type { Team, BetInfo, GameType } from "../../shared/types/esports";
import Link from "next/link";

export default function ESportsBetting() {
  const router = useRouter();
  const { eventId } = router.query;

  const { isAuthenticated, loading: authLoading } = useESSportsAuth();
  const { showToast } = useToast();
  const { event } = useEvent();

  const [selectedGame, setSelectedGame] = useState<GameType>("LOL");
  const [teams, setTeams] = useState<Team[]>([]);
  const [bets, setBets] = useState<BetInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchTeams();
      if (isAuthenticated) {
        fetchMyBets();
      }
    }
  }, [eventId, selectedGame, isAuthenticated]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const teamsData = await esportsApiService.getBettingStatus(
        eventId,
        selectedGame
      );
      setTeams(teamsData);
    } catch (error) {
      console.error("팀 목록 조회 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyBets = async () => {
    if (!isAuthenticated) return;

    try {
      const myBets = await esportsApiService.getMyBets(eventId, selectedGame);
      setBets(myBets);
    } catch (error) {
      console.error("내 베팅 정보 조회 실패:", error);
    }
  };

  // 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && !isAuthenticated && eventId) {
      router.push(
        `/esports/login?returnUrl=${encodeURIComponent(router.asPath)}`
      );
    }
  }, [authLoading, isAuthenticated, eventId, router]);

  const updateBet = (teamId: number, points: number) => {
    setBets((prevBets) => {
      const existingBetIndex = prevBets.findIndex(
        (bet) => bet.teamId === teamId
      );

      if (points === 0) {
        // 포인트가 0이면 승부 예측 제거
        return prevBets.filter((bet) => bet.teamId !== teamId);
      }

      if (existingBetIndex >= 0) {
        // 기존 승부 예측 업데이트
        const newBets = [...prevBets];
        newBets[existingBetIndex].betPoints = points;
        return newBets;
      } else {
        // 새 승부 예측 추가
        return [...prevBets, { teamId, betPoints: points }];
      }
    });
  };

  const getTotalBetPoints = () => {
    return bets.reduce((total, bet) => total + bet.betPoints, 0);
  };

  const getRemainingPoints = () => {
    return ESportsConstants.POINTS_PER_GAME - getTotalBetPoints();
  };

  const getBetForTeam = (teamId: number) => {
    const bet = bets.find((b) => b.teamId === teamId);
    return bet ? bet.betPoints : 0;
  };

  const handleSubmitBets = async () => {
    if (getTotalBetPoints() !== ESportsConstants.POINTS_PER_GAME) {
      showToast({
        type: "warning",
        message: `총 ${ESportsConstants.POINTS_PER_GAME}포인트를 모두 사용해야 합니다.`,
      });
      return;
    }

    setSubmitting(true);
    try {
      await esportsApiService.submitBets(eventId, selectedGame, bets);

      showToast({
        type: "success",
        message: "승부 예측이 완료되었습니다!",
      });
      fetchTeams(); // 업데이트된 승부 예측 현황 조회
      fetchMyBets(); // 내 베팅 정보 갱신
    } catch (error: unknown) {
      console.error("승부 예측 실패:", error);
      showToast({
        type: "error",
        message:
          error &&
          typeof error === "object" &&
          "message" in error &&
          typeof (error as { message: unknown }).message === "string"
            ? (error as { message: string }).message
            : "승부 예측에 실패했습니다. 다시 시도해주세요.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getMultiplier = (rank: number, totalTeams: number) => {
    if (totalTeams <= 1) {
      return ESportsConstants.MAX_MULTIPLIER;
    }
    return (
      ESportsConstants.MAX_MULTIPLIER -
      (ESportsConstants.MULTIPLIER_RANGE * (rank - 1)) / (totalTeams - 1)
    );
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
        <title>
          승부 예측 참여 | E-Sports | 부산대학교 정보의생명공학대학 학생회
        </title>
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 섹션 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-4">
              <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
              <span className="text-sm font-semibold text-primary korean-text">
                승부 예측 참여
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold korean-text mb-2">
              <span className="bg-gradient-to-r from-dark to-gray-700 bg-clip-text text-transparent">
                승부{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  예측
                </span>
              </span>
            </h1>
            <h2 className="text-lg text-gray-600 korean-text">
              {event?.eventName}
            </h2>
          </div>

          {authLoading ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            </div>
          ) : !isAuthenticated ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 text-center">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-dark korean-text mb-4">
                로그인이 필요합니다
              </h3>
              <p className="text-gray-600 korean-text mb-6">
                승부 예측 참여를 위해서는 먼저 로그인을 완료해야 합니다.
              </p>
              <Link
                href={`/esports/login?returnUrl=${encodeURIComponent(
                  router.asPath
                )}`}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 korean-text font-medium"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                  />
                </svg>
                로그인하기
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 게임 선택 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  게임 선택
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: "LOL", name: "League of Legends" },
                    { value: "PUBG", name: "PUBG" },
                    { value: "FIFA", name: "FIFA Online 4" },
                  ].map((game) => (
                    <button
                      key={game.value}
                      onClick={() => setSelectedGame(game.value as GameType)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        selectedGame === game.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <div className="mb-2">
                        {game.value === "LOL" && (
                          <img
                            src="/lol2.png"
                            alt="League of Legends"
                            className="w-auth h-8 mx-auto"
                          />
                        )}
                        {game.value === "PUBG" && (
                          <img
                            src="https://pngimg.com/d/pubg_PNG55.png"
                            alt="PUBG"
                            className="w-8 h-8 mx-auto"
                          />
                        )}
                        {game.value === "FIFA" && (
                          <img
                            src="/fconline.svg"
                            alt="FC Online"
                            className="w-8 h-8 mx-auto"
                          />
                        )}
                      </div>
                      <div className="font-semibold">{game.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 승부 예측 상태 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    승부 예측 현황
                  </h3>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-blue-600">
                      사용: {getTotalBetPoints()}/
                      {ESportsConstants.POINTS_PER_GAME}pt
                    </div>
                    <div className="text-sm text-gray-600">
                      남은 포인트: {getRemainingPoints()}pt
                    </div>
                  </div>
                </div>

                {/* 진행률 바 */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        (getTotalBetPoints() /
                          ESportsConstants.POINTS_PER_GAME) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>

                {bets.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium text-gray-900">내 승부 예측:</h4>
                    {bets.map((bet) => {
                      const team = teams.find((t) => t.teamId === bet.teamId);
                      return (
                        <div
                          key={bet.teamId}
                          className="flex justify-between text-sm"
                        >
                          <span>{team?.teamName}</span>
                          <span>{bet.betPoints}pt</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  onClick={handleSubmitBets}
                  disabled={
                    getTotalBetPoints() !== ESportsConstants.POINTS_PER_GAME ||
                    submitting
                  }
                  className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "승부 예측 중..." : "승부 예측 확정"}
                </button>
              </div>

              {/* 팀 목록 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900">
                    참가팀 목록
                  </h3>
                  <div className="text-sm text-gray-500">
                    총{" "}
                    {teams.reduce(
                      (sum, team) => sum + (team.totalBetPoints || 0),
                      0
                    )}
                    pt 베팅됨
                  </div>
                </div>

                {/* 베팅 인기 순위 표시 */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                    베팅 인기도
                  </h4>
                  <div className="space-y-2">
                    {teams
                      .sort(
                        (a, b) =>
                          (b.totalBetPoints || 0) - (a.totalBetPoints || 0)
                      )
                      .slice(0, 3)
                      .map((team, index) => (
                        <div
                          key={team.teamId}
                          className="flex items-center space-x-3"
                        >
                          <div
                            className={`text-lg ${
                              index === 0
                                ? "text-yellow-600"
                                : index === 1
                                ? "text-gray-600"
                                : "text-orange-600"
                            }`}
                          >
                            {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                          </div>
                          <div className="flex-1 flex items-center justify-between">
                            <span className="font-medium text-gray-900">
                              {team.teamName}
                            </span>
                            <span className="text-sm font-semibold text-blue-600">
                              {team.totalBetPoints}pt ({team.bettorCount}명)
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {teams
                    .sort(
                      (a, b) =>
                        (b.totalBetPoints || 0) - (a.totalBetPoints || 0)
                    )
                    .map((team, index) => {
                      const maxBetPoints = Math.max(
                        ...teams.map((t) => t.totalBetPoints || 0)
                      );
                      const popularityPercent =
                        maxBetPoints > 0
                          ? ((team.totalBetPoints || 0) / maxBetPoints) * 100
                          : 0;

                      return (
                        <div
                          key={team.teamId}
                          className={`border-2 rounded-lg p-5 transition-all duration-300 hover:shadow-lg ${
                            index === 0
                              ? "border-yellow-300 bg-gradient-to-r from-yellow-50 to-orange-50"
                              : index === 1
                              ? "border-gray-300 bg-gradient-to-r from-gray-50 to-slate-50"
                              : index === 2
                              ? "border-orange-300 bg-gradient-to-r from-orange-50 to-red-50"
                              : "border-gray-200 bg-white hover:border-blue-300"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                {index < 3 && (
                                  <span
                                    className={`text-lg ${
                                      index === 0
                                        ? "text-yellow-600"
                                        : index === 1
                                        ? "text-gray-600"
                                        : "text-orange-600"
                                    }`}
                                  >
                                    {index === 0
                                      ? "🥇"
                                      : index === 1
                                      ? "🥈"
                                      : "🥉"}
                                  </span>
                                )}
                                <h4 className="text-lg font-semibold text-gray-900">
                                  {team.teamName}
                                </h4>
                                {index === 0 && (
                                  <span className="px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                                    최고 인기
                                  </span>
                                )}
                              </div>
                              {team.description && (
                                <p className="text-gray-600 text-sm mt-1">
                                  {team.description}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-xl font-bold text-blue-600">
                                {team.totalBetPoints || 0}pt
                              </div>
                              <div className="text-sm text-gray-600">
                                {team.bettorCount || 0}명이 베팅
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                인기도 {popularityPercent.toFixed(1)}%
                              </div>
                            </div>
                          </div>

                          {/* 인기도 프로그래스 바 */}
                          <div className="mb-4">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>베팅 인기도</span>
                              <span>{popularityPercent.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${
                                  index === 0
                                    ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                                    : index === 1
                                    ? "bg-gradient-to-r from-gray-400 to-gray-500"
                                    : index === 2
                                    ? "bg-gradient-to-r from-orange-400 to-red-500"
                                    : "bg-gradient-to-r from-blue-400 to-blue-500"
                                }`}
                                style={{ width: `${popularityPercent}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* 팀원 정보 */}
                          <div className="mb-4">
                            <h5 className="font-medium text-gray-900 mb-3">
                              팀원:
                            </h5>
                            <div className="space-y-3">
                              {team.members.map((member, memberIndex) => (
                                <div key={memberIndex}>
                                  {selectedGame === "LOL" ? (
                                    <LoLPlayerStats
                                      gameNickname={member.gameNickname}
                                      showTitle={false}
                                      compact={true}
                                    />
                                  ) : selectedGame === "PUBG" ? (
                                    <PubgPlayerStats
                                      gameNickname={member.gameNickname}
                                      showTitle={false}
                                      compact={true}
                                    />
                                  ) : selectedGame === "FIFA" ? (
                                    <FifaPlayerStats
                                      gameNickname={member.gameNickname}
                                      showTitle={false}
                                      compact={true}
                                    />
                                  ) : (
                                    <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                      <span className="font-medium">
                                        {member.name}
                                      </span>
                                      <span className="text-gray-500">
                                        {" "}
                                        ({member.gameNickname})
                                      </span>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 승부 예측 입력 */}
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <label className="text-sm font-medium text-gray-700">
                                승부 예측 포인트
                              </label>
                              <div className="text-xs text-gray-500">
                                최대{" "}
                                {getRemainingPoints() +
                                  getBetForTeam(team.teamId)}
                                pt
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <input
                                type="number"
                                min="0"
                                max={
                                  getRemainingPoints() +
                                  getBetForTeam(team.teamId)
                                }
                                value={getBetForTeam(team.teamId)}
                                onChange={(e) =>
                                  updateBet(
                                    team.teamId,
                                    parseInt(e.target.value) || 0
                                  )
                                }
                                className="border border-gray-300 rounded-lg px-4 py-2 w-24 text-center font-semibold"
                                placeholder="0"
                              />
                              <span className="text-sm text-gray-600">
                                포인트
                              </span>
                              {getBetForTeam(team.teamId) > 0 && (
                                <div className="flex-1 text-right">
                                  <span className="text-sm font-medium text-green-600">
                                    ✓ 베팅 중
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* 배수 시스템 안내 */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  배수 시스템 ({teams.length}팀 참가)
                </h3>
                <p className="text-sm text-yellow-700 mb-4">
                  팀 수에 따라 1등 5.0배에서 꼴등 1.0배까지 자동 조절됩니다
                </p>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                  {Array.from({ length: teams.length }, (_, i) => (
                    <div key={i} className="text-center">
                      <div className="font-semibold text-yellow-800">
                        {i + 1}등
                      </div>
                      <div className="text-yellow-600">
                        {getMultiplier(i + 1, teams.length).toFixed(1)}배
                      </div>
                    </div>
                  ))}
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
