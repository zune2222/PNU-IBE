import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Header } from "../../widgets/Header";
import { Footer } from "../../widgets/Footer";
import { apiClient } from "../../shared/services/api";
import { useToast } from "../../shared/components/Toast";
import LoLPlayerStats from "../../components/esports/LoLPlayerStats";
import PubgPlayerStats from "../../components/esports/PubgPlayerStats";
// import FifaPlayerStats from '../../components/esports/FifaPlayerStats'; // FIFA 전적 비활성화

interface Event {
  eventId: number;
  eventName: string;
  status: string;
}

type GameType = "LOL" | "PUBG" | "FIFA";

interface Team {
  teamId: number;
  teamName: string;
  gameType: GameType;
  profileImageUrl?: string;
  description?: string;
  leaderGameNickname: string;
  members: {
    studentId: string;
    name: string;
    gameNickname: string;
    gameApiData?: string;
  }[];
}

export default function ESportsTeams() {
  const router = useRouter();
  const { eventId } = router.query;
  const { showToast } = useToast();

  const [event, setEvent] = useState<Event | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameType>("LOL");
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
      fetchTeams();
    }
  }, [eventId, selectedGame]);

  const fetchEvent = async () => {
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
  };

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<
        {
          team_id: number;
          team_name: string;
          game_type: string;
          profile_image_url?: string;
          description?: string;
          leader?: {
            student_id: string;
            name: string;
            game_nickname: string;
            game_api_data?: string;
          };
          members?: {
            student_id: string;
            name: string;
            game_nickname: string;
            game_api_data?: string;
          }[];
        }[]
      >(`/api/teams/events/${eventId}?gameType=${selectedGame}`);
      const teamsData: Team[] = response.map((team) => {
        // 리더 정보를 members 배열의 첫 번째로 포함
        const allMembers = [];
        if (team.leader) {
          allMembers.push({
            studentId: team.leader.student_id,
            name: team.leader.name,
            gameNickname: team.leader.game_nickname,
            gameApiData: team.leader.game_api_data,
          });
        }
        // 팀원 정보 추가
        if (team.members) {
          team.members.forEach((member) => {
            allMembers.push({
              studentId: member.student_id,
              name: member.name,
              gameNickname: member.game_nickname,
              gameApiData: member.game_api_data,
            });
          });
        }

        return {
          teamId: team.team_id,
          teamName: team.team_name,
          gameType: team.game_type as GameType,
          profileImageUrl: team.profile_image_url,
          description: team.description,
          leaderGameNickname: team.leader?.game_nickname || "",
          members: allMembers,
        };
      });
      setTeams(teamsData);
    } catch (error) {
      console.error("팀 목록 조회 실패:", error);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  const getGameName = (gameType: GameType) => {
    const gameNames: { [key in GameType]: string } = {
      LOL: "League of Legends",
      PUBG: "PUBG",
      FIFA: "FIFA Online 4",
    };
    return gameNames[gameType];
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
          참가팀 목록 | E-Sports | 부산대학교 정보의생명공학대학 학생회
        </title>
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 섹션 */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-4">
              <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
              <span className="text-sm font-semibold text-primary korean-text whitespace-nowrap">
                참가팀 목록
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold korean-text mb-2 px-4">
              <span className="bg-gradient-to-r from-dark to-gray-700 bg-clip-text text-transparent">
                참가{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  팀
                </span>
              </span>
            </h1>
            <h2 className="text-base sm:text-lg text-gray-600 korean-text px-4 break-words">
              {event?.eventName}
            </h2>
          </div>

          {/* 게임 선택 */}
          <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-6">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 korean-text">
              게임 선택
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {(["LOL", "PUBG", "FIFA"] as GameType[]).map((game) => (
                <button
                  key={game}
                  onClick={() => setSelectedGame(game)}
                  className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedGame === game
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="font-semibold text-sm sm:text-base text-gray-800 korean-text">
                    {getGameName(game)}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1 korean-text">
                    {game === "LOL" && "문도 피구 (개인전)"}
                    {game === "PUBG" && "스쿼드 (최대 4명)"}
                    {game === "FIFA" && "개인전"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 팀 목록 */}
          {teams.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 sm:p-12 text-center">
              <div className="bg-gray-100 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-gray-600 korean-text text-sm sm:text-base md:text-lg">
                {getGameName(selectedGame)} 종목에 등록된 팀이 없습니다.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {teams.map((team) => (
                <div
                  key={team.teamId}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* 프로필 이미지 */}
                  {team.profileImageUrl ? (
                    <div className="h-40 sm:h-48 bg-gray-200 relative">
                      <img
                        src={team.profileImageUrl}
                        alt={team.teamName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-40 sm:h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 sm:w-16 sm:h-16 text-primary/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                  )}

                  <div className="p-4 sm:p-6">
                    {/* 팀명 */}
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 korean-text break-words">
                      {team.teamName}
                    </h3>

                    {/* 한줄 소개 */}
                    {team.description && (
                      <p className="text-gray-600 text-xs sm:text-sm mb-4 korean-text break-words">
                        {team.description}
                      </p>
                    )}

                    {/* 리더 정보 */}
                    <div className="mb-4">
                      <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2 korean-text">
                        리더
                      </div>
                      <div className="bg-gray-50 rounded-md p-3">
                        <div className="font-semibold text-sm sm:text-base text-gray-900 break-words">
                          {team.leaderGameNickname}
                        </div>
                        {team.members.length > 0 && team.members[0]?.name && (
                          <div className="text-xs sm:text-sm text-gray-600 mt-1 korean-text">
                            {team.members[0].name}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 팀원 목록 (PUBG만) */}
                    {selectedGame === "PUBG" && team.members.length > 1 && (
                      <div className="mb-4">
                        <div className="text-xs sm:text-sm font-medium text-gray-700 mb-2 korean-text">
                          팀원
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          {team.members.slice(1).map((member, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 rounded-md p-2.5 sm:p-3"
                            >
                              <div className="font-semibold text-sm sm:text-base text-gray-900 mb-1 sm:mb-2 break-words">
                                {member.gameNickname}
                              </div>
                              {member.name && (
                                <div className="text-xs sm:text-sm text-gray-600 mb-2 korean-text">
                                  {member.name}
                                </div>
                              )}
                              {/* 팀원 PUBG 전적 */}
                              <div className="mt-2">
                                <PubgPlayerStats
                                  gameNickname={member.gameNickname}
                                  showTitle={false}
                                  compact={true}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 전력 정보 (LOL만) */}
                    {team.leaderGameNickname && selectedGame === "LOL" && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <LoLPlayerStats
                          gameNickname={team.leaderGameNickname}
                          showTitle={true}
                          compact={true}
                        />
                      </div>
                    )}

                    {/* 다른 게임의 API 데이터 (fallback - 표시하지 않음) */}
                    {false && team.members[0]?.gameApiData && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          전력 정보
                        </div>
                        <div className="text-xs text-gray-600 bg-blue-50 rounded-md p-2">
                          {team.members[0].gameApiData}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
