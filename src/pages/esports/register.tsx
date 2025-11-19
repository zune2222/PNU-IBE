import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Header } from "../../widgets/Header";
import { Footer } from "../../widgets/Footer";
import { useESSportsAuth } from "../../shared/contexts/ESSportsAuthContext";
import { apiClient } from "../../shared/services/api";
import { storageService } from "../../shared/services/storage";
import { useToast } from "../../shared/components/Toast";
import { riotApiService } from "../../shared/services/riotApi";
import { pubgApiService } from "../../shared/services/pubgApi";
import { fifaApiService } from "../../shared/services/fifaApi";
import { PlayerStats } from "../../shared/types/riot";
import LoLPlayerStats from "../../components/esports/LoLPlayerStats";
import PubgPlayerStats from "../../components/esports/PubgPlayerStats";
import FifaPlayerStats from "../../components/esports/FifaPlayerStats";
import Link from "next/link";

interface Event {
  eventId: number;
  eventName: string;
  status: string;
}

type GameType = "LOL" | "PUBG" | "FIFA";

interface TeamMember {
  studentId: string;
  name: string;
  gameNickname: string;
  phoneNumber: string;
  email: string;
  verified?: boolean;
}

export default function ESportsRegister() {
  const router = useRouter();
  const { eventId } = router.query;

  const { isAuthenticated, user, loading: authLoading } = useESSportsAuth();
  const { showToast } = useToast();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 팀 정보
  const [selectedGame, setSelectedGame] = useState<GameType>("LOL");
  const [teamName, setTeamName] = useState("");
  const [gameNickname, setGameNickname] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileImageUploading, setProfileImageUploading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [members, setMembers] = useState<TeamMember[]>([]);

  // 게임 계정 확인 관련 state
  const [lolAccountVerified, setLolAccountVerified] = useState(false);
  const [lolPlayerStats, setLolPlayerStats] = useState<PlayerStats | null>(
    null
  );
  const [pubgAccountVerified, setPubgAccountVerified] = useState(false);
  // const [pubgPlayerStats, setPubgPlayerStats] = useState<PubgStats | null>(null); // Unused
  const [fifaAccountVerified, setFifaAccountVerified] = useState(false);
  // const [fifaPlayerStats, setFifaPlayerStats] = useState<FifaStats | null>(null); // Unused
  const [verifyingAccount, setVerifyingAccount] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  // 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!authLoading && !isAuthenticated && eventId) {
      router.push(
        `/esports/login?returnUrl=${encodeURIComponent(router.asPath)}`
      );
    }
  }, [authLoading, isAuthenticated, eventId, router]);

  const fetchEvent = async () => {
    try {
      const response = await apiClient.get<{event_id: number; event_name: string; status: string}>(`/api/admin/events/${eventId}`);
      setEvent({
        eventId: response.event_id,
        eventName: response.event_name,
        status: response.status,
      });
    } catch (error: unknown) {
      console.error("이벤트 정보 조회 실패:", error);
      if (
        error && typeof error === 'object' && 'message' in error && 
        typeof (error as {message: unknown}).message === 'string' &&
        ((error as {message: string}).message.includes("404") ||
         (error as {message: string}).message.includes("찾을 수 없습니다"))
      ) {
        showToast({
          type: "error",
          message: "이벤트를 찾을 수 없습니다. 이벤트 목록으로 돌아갑니다.",
        });
        router.push("/esports");
      } else {
        showToast({
          type: "error",
          message: "이벤트 정보를 불러올 수 없습니다.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (profileImageUploading) {
      showToast({
        type: "error",
        message: "프로필 이미지 업로드가 완료될 때까지 기다려주세요.",
      });
      return;
    }

    setSubmitting(true);

    try {
      const teamData = {
        event_id: Number(eventId),
        team_name: teamName,
        game_type: selectedGame,
        leader_game_nickname: gameNickname,
        leader_phone: phoneNumber,
        leader_email: email,
        profile_image_url: profileImage || null,
        description: description || null,
        members:
          selectedGame === "PUBG"
            ? members.map((m) => ({
                student_id: m.studentId,
                name: m.name,
                game_nickname: m.gameNickname,
                phone_number: m.phoneNumber,
                email: m.email,
              }))
            : [],
      };

      const response = await apiClient.post<{message?: string}>("/api/teams", teamData);

      if (response) {
        showToast({
          type: "success",
          message: "팀 등록이 완료되었습니다!",
        });
        router.push("/esports");
      }
    } catch (error: unknown) {
      console.error("팀 등록 실패:", error);
      showToast({
        type: "error",
        message: (error && typeof error === 'object' && 'message' in error && typeof (error as {message: unknown}).message === 'string') ? (error as {message: string}).message : "팀 등록에 실패했습니다. 다시 시도해주세요.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleProfileImageUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const inputEl = event.target;
    const file = inputEl.files?.[0];
    if (!file) {
      return;
    }

    try {
      setProfileImageUploading(true);
      const pathSegments = [
        "esports",
        "events",
        eventId ?? "common",
        "teams",
        user?.studentId ?? "anonymous",
      ];
      const path = pathSegments.join("/");
      const result = await storageService.uploadImage(file, path, 1200, 0.85);
      setProfileImage(result.url);
      showToast({
        type: "success",
        message: "프로필 이미지가 업로드되었습니다.",
      });
    } catch (error) {
      console.error("프로필 이미지 업로드 실패:", error);
      showToast({
        type: "error",
        message: "이미지 업로드에 실패했습니다. 다시 시도해주세요.",
      });
    } finally {
      setProfileImageUploading(false);
      inputEl.value = "";
    }
  };

  const addMember = () => {
    if (members.length < 3) {
      setMembers([
        ...members,
        {
          studentId: "",
          name: "",
          gameNickname: "",
          phoneNumber: "",
          email: "",
          verified: false,
        },
      ]);
    }
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (
    index: number,
    field: keyof TeamMember,
    value: string | boolean
  ) => {
    const updatedMembers = [...members];
    (updatedMembers[index] as unknown as Record<string, unknown>)[field] = value;
    setMembers(updatedMembers);
  };

  const verifyMemberPubgAccount = async (index: number, nickname: string) => {
    if (!nickname.trim()) {
      showToast({
        type: "warning",
        message: "게임 닉네임을 입력해주세요.",
      });
      return;
    }

    try {
      const response = await pubgApiService.getPlayerInfo(nickname);

      if (response.success && response.data) {
        updateMember(index, "verified", true);
        showToast({
          type: "success",
          message: `${nickname} 계정 확인이 완료되었습니다!`,
        });
      } else {
        updateMember(index, "verified", false);
        showToast({
          type: "error",
          message: response.error || "계정을 찾을 수 없습니다.",
        });
      }
    } catch (error) {
      console.error("계정 확인 실패:", error);
      updateMember(index, "verified", false);
      showToast({
        type: "error",
        message: "계정 확인 중 오류가 발생했습니다.",
      });
    }
  };

  const verifyLolAccount = async () => {
    if (!gameNickname.trim()) {
      showToast({
        type: "warning",
        message: "게임 닉네임을 입력해주세요.",
      });
      return;
    }

    setVerifyingAccount(true);
    try {
      const response = await riotApiService.getPlayerStatsByRiotId(
        gameNickname
      );

      if (response.success && response.data) {
        setLolPlayerStats(response.data);
        setLolAccountVerified(true);
        showToast({
          type: "success",
          message: "계정 확인이 완료되었습니다!",
        });
      } else {
        setLolAccountVerified(false);
        setLolPlayerStats(null);
        showToast({
          type: "error",
          message: response.error || "계정을 찾을 수 없습니다.",
        });
      }
    } catch (error) {
      console.error("계정 확인 실패:", error);
      setLolAccountVerified(false);
      setLolPlayerStats(null);
      showToast({
        type: "error",
        message: "계정 확인 중 오류가 발생했습니다.",
      });
    } finally {
      setVerifyingAccount(false);
    }
  };

  const verifyPubgAccount = async () => {
    if (!gameNickname.trim()) {
      showToast({
        type: "warning",
        message: "게임 닉네임을 입력해주세요.",
      });
      return;
    }

    setVerifyingAccount(true);
    try {
      console.log("🔍 PUBG 계정 확인 시작:", gameNickname);
      const response = await pubgApiService.getPlayerInfo(gameNickname);
      console.log("📦 PUBG API 응답:", response);
      console.log("✅ response.success:", response.success);
      console.log("📊 response.data:", response.data);
      console.log("❌ response.error:", response.error);

      if (response.success && response.data) {
        console.log("✅ 계정 확인 성공!", response.data);
        // setPubgPlayerStats(response.data); // Removed unused state
        setPubgAccountVerified(true);
        showToast({
          type: "success",
          message: "계정 확인이 완료되었습니다!",
        });
      } else {
        console.log("❌ 계정 확인 실패:", response.error || "알 수 없는 오류");
        setPubgAccountVerified(false);
        // setPubgPlayerStats(null); // Removed unused state
        showToast({
          type: "error",
          message: response.error || "계정을 찾을 수 없습니다.",
        });
      }
    } catch (error) {
      console.error("💥 계정 확인 예외 발생:", error);
      setPubgAccountVerified(false);
      // setPubgPlayerStats(null); // Removed unused state
      showToast({
        type: "error",
        message: "계정 확인 중 오류가 발생했습니다.",
      });
    } finally {
      setVerifyingAccount(false);
    }
  };

  const verifyFifaAccount = async () => {
    if (!gameNickname.trim()) {
      showToast({
        type: "warning",
        message: "게임 닉네임을 입력해주세요.",
      });
      return;
    }

    setVerifyingAccount(true);
    try {
      const response = await fifaApiService.getPlayerInfo(gameNickname);

      if (response.success && response.data) {
        // setFifaPlayerStats(response.data); // Removed unused state
        setFifaAccountVerified(true);
        showToast({
          type: "success",
          message: "계정 확인이 완료되었습니다!",
        });
      } else {
        setFifaAccountVerified(false);
        // setFifaPlayerStats(null); // Removed unused state
        showToast({
          type: "error",
          message: response.error || "계정을 찾을 수 없습니다.",
        });
      }
    } catch (error) {
      console.error("계정 확인 실패:", error);
      setFifaAccountVerified(false);
      // setFifaPlayerStats(null); // Removed unused state
      showToast({
        type: "error",
        message: "계정 확인 중 오류가 발생했습니다.",
      });
    } finally {
      setVerifyingAccount(false);
    }
  };

  // 게임 닉네임이 변경되면 계정 확인 상태 초기화
  useEffect(() => {
    setLolAccountVerified(false);
    setLolPlayerStats(null);
    setPubgAccountVerified(false);
    // setPubgPlayerStats(null); // Removed unused state
    setFifaAccountVerified(false);
    // setFifaPlayerStats(null); // Removed unused state
  }, [gameNickname, selectedGame]);

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
          참가 신청 | E-Sports | 부산대학교 정보의생명공학대학 학생회
        </title>
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8 md:p-10">
            {/* 헤더 섹션 */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-4">
                <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
                <span className="text-sm font-semibold text-primary korean-text">
                  참가 신청
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold korean-text mb-2">
                <span className="bg-gradient-to-r from-dark to-gray-700 bg-clip-text text-transparent">
                  E-Sports 대회{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    참가 신청
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
                  팀 등록을 위해서는 먼저 로그인을 완료해야 합니다.
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
              /* 팀 등록 단계 */
              <div>
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800 korean-text">
                    ✓ 로그인 완료: {user?.name} ({user?.studentId})
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  2. 팀 등록
                </h3>
                <form onSubmit={handleTeamSubmit} className="space-y-6">
                  {/* 게임 선택 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      참가 종목 *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        {
                          value: "LOL",
                          name: "League of Legends",
                          desc: "문도 피구 (개인전)",
                        },
                        {
                          value: "PUBG",
                          name: "PUBG",
                          desc: "스쿼드 (최대 4명)",
                        },
                        {
                          value: "FIFA",
                          name: "FIFA Online 4",
                          desc: "개인전",
                        },
                      ].map((game) => (
                        <label
                          key={game.value}
                          className={`cursor-pointer border rounded-lg p-4 ${
                            selectedGame === game.value
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <input
                            type="radio"
                            name="gameType"
                            value={game.value}
                            checked={selectedGame === game.value}
                            onChange={(e) =>
                              setSelectedGame(e.target.value as GameType)
                            }
                            className="sr-only"
                          />
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">
                              {game.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {game.desc}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 팀 기본 정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        팀명 *
                      </label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        게임 닉네임 *{" "}
                        {selectedGame === "LOL" && "(라이엇 ID#태그)"}
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={gameNickname}
                          onChange={(e) => setGameNickname(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder={
                            selectedGame === "LOL"
                              ? "예: Hide on bush#KR1"
                              : "게임 닉네임"
                          }
                          required
                        />
                        {selectedGame === "LOL" && (
                          <button
                            type="button"
                            onClick={verifyLolAccount}
                            disabled={verifyingAccount || !gameNickname.trim()}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                              lolAccountVerified
                                ? "bg-green-100 text-green-800 border border-green-300"
                                : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                            }`}
                          >
                            {verifyingAccount ? (
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>확인 중...</span>
                              </div>
                            ) : lolAccountVerified ? (
                              <div className="flex items-center space-x-1">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span>확인됨</span>
                              </div>
                            ) : (
                              "정보 확인"
                            )}
                          </button>
                        )}
                        {selectedGame === "PUBG" && (
                          <button
                            type="button"
                            onClick={verifyPubgAccount}
                            disabled={verifyingAccount || !gameNickname.trim()}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                              pubgAccountVerified
                                ? "bg-green-100 text-green-800 border border-green-300"
                                : "bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50"
                            }`}
                          >
                            {verifyingAccount ? (
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>확인 중...</span>
                              </div>
                            ) : pubgAccountVerified ? (
                              <div className="flex items-center space-x-1">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span>확인됨</span>
                              </div>
                            ) : (
                              "정보 확인"
                            )}
                          </button>
                        )}
                        {selectedGame === "FIFA" && (
                          <button
                            type="button"
                            onClick={verifyFifaAccount}
                            disabled={verifyingAccount || !gameNickname.trim()}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                              fifaAccountVerified
                                ? "bg-green-100 text-green-800 border border-green-300"
                                : "bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
                            }`}
                          >
                            {verifyingAccount ? (
                              <div className="flex items-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                <span>확인 중...</span>
                              </div>
                            ) : fifaAccountVerified ? (
                              <div className="flex items-center space-x-1">
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                <span>확인됨</span>
                              </div>
                            ) : (
                              "정보 확인"
                            )}
                          </button>
                        )}
                      </div>

                      {/* 전적 미리보기 */}
                      {selectedGame === "LOL" && lolAccountVerified && (
                        <div className="mt-3">
                          <LoLPlayerStats
                            gameNickname={gameNickname}
                            showTitle={false}
                            compact={true}
                          />
                        </div>
                      )}
                      {selectedGame === "PUBG" && pubgAccountVerified && (
                        <div className="mt-3">
                          <PubgPlayerStats
                            gameNickname={gameNickname}
                            showTitle={false}
                            compact={true}
                          />
                        </div>
                      )}
                      {selectedGame === "FIFA" && fifaAccountVerified && (
                        <div className="mt-3">
                          <FifaPlayerStats
                            gameNickname={gameNickname}
                            showTitle={false}
                            compact={true}
                          />
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        연락처(전화번호) *
                      </label>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="010-1234-5678"
                        pattern="^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$"
                        title="연락처 형식: 010-1234-5678"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        이메일 *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="example@pnu.ac.kr"
                        required
                      />
                    </div>
                  </div>

                  {/* LoL 계정 정보 표시 */}
                  {selectedGame === "LOL" &&
                    lolAccountVerified &&
                    lolPlayerStats && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                        <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
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
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          계정 확인 완료
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* 소환사 정보 */}
                          <div className="bg-white rounded-lg p-4 border">
                            <div className="flex items-center space-x-4">
                              <img
                                src={riotApiService.getProfileIconUrl(
                                  lolPlayerStats.summonerInfo.profileIconId
                                )}
                                alt="프로필 아이콘"
                                className="w-16 h-16 rounded-lg border-2 border-gray-200"
                              />
                              <div>
                                <h5 className="font-semibold text-gray-900">
                                  {lolPlayerStats.summonerInfo.name}
                                </h5>
                                <p className="text-sm text-gray-600">
                                  레벨{" "}
                                  {lolPlayerStats.summonerInfo.summonerLevel}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* 랭크 정보 */}
                          <div className="bg-white rounded-lg p-4 border">
                            <h6 className="font-medium text-gray-900 mb-3">
                              랭크 정보
                            </h6>
                            {lolPlayerStats.rankInfo.length > 0 ? (
                              <div className="space-y-2">
                                {lolPlayerStats.rankInfo.map((rank, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between text-sm"
                                  >
                                    <span className="font-medium">
                                      {riotApiService.getQueueDisplayName(
                                        rank.queueType
                                      )}
                                    </span>
                                    <div className="flex items-center space-x-2">
                                      <img
                                        src={riotApiService.getTierIconUrl(
                                          rank.tier
                                        )}
                                        alt={rank.tier}
                                        className="w-6 h-6"
                                      />
                                      <span className="text-gray-700">
                                        {riotApiService.formatTier(
                                          rank.tier,
                                          rank.rank,
                                          rank.leaguePoints
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-500">
                                랭크 정보 없음
                              </p>
                            )}
                          </div>

                          {/* 최근 게임 승률 */}
                          <div className="bg-white rounded-lg p-4 border md:col-span-2">
                            <h6 className="font-medium text-gray-900 mb-3">
                              최근 20게임 승률
                            </h6>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-blue-600">
                                    {lolPlayerStats.recentMatches.winRate}%
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    승률
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-semibold text-green-600">
                                    {lolPlayerStats.recentMatches.wins}승
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    승
                                  </div>
                                </div>
                                <div className="text-center">
                                  <div className="text-lg font-semibold text-red-600">
                                    {lolPlayerStats.recentMatches.losses}패
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    패
                                  </div>
                                </div>
                              </div>

                              {/* 승률 프로그래스 바 */}
                              <div className="flex-1 ml-6">
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                  <div
                                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${lolPlayerStats.recentMatches.winRate}%`,
                                    }}
                                  ></div>
                                </div>
                                <div className="text-xs text-gray-500 mt-1 text-center">
                                  총 {lolPlayerStats.recentMatches.matchCount}
                                  게임
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* 프로필 이미지 업로드 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      프로필 이미지 (선택)
                    </label>
                    <div className="flex items-center gap-4 flex-col sm:flex-row">
                      <div className="w-28 h-28 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 overflow-hidden">
                        {profileImage ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={profileImage}
                            alt="프로필 미리보기"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm text-gray-500 text-center px-2">
                            업로드 시<br />
                            미리보기 표시
                          </span>
                        )}
                      </div>
                      <div className="flex-1 w-full">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleProfileImageUpload}
                          disabled={profileImageUploading || submitting}
                          className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        <p className="text-sm text-gray-500 mt-2">
                          JPG, PNG 이미지 파일 (최대 5MB 권장)
                        </p>
                        {profileImageUploading && (
                          <p className="text-sm text-blue-600 mt-1">
                            이미지 업로드 중입니다...
                          </p>
                        )}
                        {profileImage && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            <a
                              href={profileImage}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline"
                            >
                              업로드된 이미지 확인
                            </a>
                            <button
                              type="button"
                              onClick={() => setProfileImage("")}
                              className="text-sm text-red-600 hover:underline"
                              disabled={submitting}
                            >
                              이미지 삭제
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      한줄 소개
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      maxLength={200}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="팀의 각오나 소개를 적어주세요 (200자 이내)"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {description.length}/200
                    </p>
                  </div>

                  {/* PUBG 팀원 추가 */}
                  {selectedGame === "PUBG" && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium text-gray-900">
                          팀원 추가 (최대 3명)
                        </h4>
                        <button
                          type="button"
                          onClick={addMember}
                          disabled={members.length >= 3}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          팀원 추가
                        </button>
                      </div>

                      {members.map((member, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4 mb-4"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium text-gray-900">
                              팀원 {index + 1}
                            </h5>
                            <button
                              type="button"
                              onClick={() => removeMember(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              삭제
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                학번 *
                              </label>
                              <input
                                type="text"
                                value={member.studentId}
                                onChange={(e) =>
                                  updateMember(index, "studentId", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="예: 202012345"
                                pattern="^[0-9]{8,10}$"
                                title="8-10자리 숫자로 입력해주세요"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                이름 *
                              </label>
                              <input
                                type="text"
                                value={member.name}
                                onChange={(e) =>
                                  updateMember(index, "name", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="홍길동"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                게임 닉네임 *
                              </label>
                              <div className="flex space-x-2">
                                <input
                                  type="text"
                                  value={member.gameNickname}
                                  onChange={(e) => {
                                    updateMember(
                                      index,
                                      "gameNickname",
                                      e.target.value
                                    );
                                    updateMember(index, "verified", false);
                                  }}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="PUBG 게임 닉네임"
                                  required
                                />
                                <button
                                  type="button"
                                  onClick={() =>
                                    verifyMemberPubgAccount(
                                      index,
                                      member.gameNickname
                                    )
                                  }
                                  disabled={!member.gameNickname.trim()}
                                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    member.verified
                                      ? "bg-green-100 text-green-800 border border-green-300"
                                      : "bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-50"
                                  }`}
                                >
                                  {member.verified ? (
                                    <div className="flex items-center space-x-1">
                                      <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth={2}
                                          d="M5 13l4 4L19 7"
                                        />
                                      </svg>
                                      <span>확인됨</span>
                                    </div>
                                  ) : (
                                    "확인"
                                  )}
                                </button>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                연락처 *
                              </label>
                              <input
                                type="tel"
                                value={member.phoneNumber}
                                onChange={(e) =>
                                  updateMember(
                                    index,
                                    "phoneNumber",
                                    e.target.value
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="010-1234-5678"
                                pattern="^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$"
                                title="연락처 형식: 010-1234-5678"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                이메일 *
                              </label>
                              <input
                                type="email"
                                value={member.email}
                                onChange={(e) =>
                                  updateMember(index, "email", e.target.value)
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="example@pusan.ac.kr"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? "등록 중..." : "팀 등록"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
