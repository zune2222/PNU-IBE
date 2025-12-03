import React, { useState, useEffect, useCallback } from "react";
import { apiClient } from "../../shared/services/api";
import { useToast } from "../../shared/components/Toast";

interface ESportsEvent {
  event_id: number;
  event_name: string;
  status: string;
}

interface TeamInfo {
  team_id: number;
  team_name: string;
  game_type: string;
  profile_image_url?: string | null;
  description?: string | null;
  members: Array<{
    student_id: string;
    name: string;
    game_nickname?: string | null;
  }>;
}

interface TeamRankInfo {
  teamId: number;
  finalRank: number;
  additionalInfo: string;
}

interface TeamResult {
  teamResultId?: number;
  teamId: number;
  teamName: string;
  gameType: string;
  finalRank: number;
  multiplier: number;
  additionalInfo?: string;
}

const GAME_TYPES = ["LOL", "PUBG", "FIFA"];

export default function MatchResultManagement() {
  const { showToast } = useToast();
  const [events, setEvents] = useState<ESportsEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [existingResults, setExistingResults] = useState<TeamResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGameType, setSelectedGameType] = useState<string>("LOL");
  
  // 팀별 순위 입력 상태
  const [teamRanks, setTeamRanks] = useState<Map<number, TeamRankInfo>>(new Map());

  const fetchEvents = useCallback(async () => {
    try {
      const response = await apiClient.get<ESportsEvent[]>("/api/admin/events");
      setEvents(response);
    } catch (error) {
      console.error("이벤트 목록 조회 실패:", error);
      showToast({ type: "error", message: "이벤트 목록을 불러오는데 실패했습니다." });
    }
  }, [showToast]);

  const fetchTeams = useCallback(async (eventId: number) => {
    setLoading(true);
    try {
      const response = await apiClient.get<TeamInfo[]>(
        `/api/teams/events/${eventId}`
      );
      // response가 배열이 아니면 빈 배열로 처리
      setTeams(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("팀 목록 조회 실패:", error);
      showToast({ type: "error", message: "팀 목록을 불러오는데 실패했습니다." });
      setTeams([]);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const fetchExistingResults = useCallback(async (eventId: number) => {
    try {
      const response = await apiClient.get<{
        eventId: number;
        eventName: string;
        teamResults: TeamResult[];
      }>(`/api/admin/team-results?eventId=${eventId}`);
      // teamResults가 없거나 undefined인 경우 빈 배열로 처리
      setExistingResults(response?.teamResults || []);
    } catch (error) {
      console.error("기존 결과 조회 실패:", error);
      // 결과가 없을 수 있으므로 에러를 무시
      setExistingResults([]);
    }
  }, []);

  const initializeRanks = useCallback(() => {
    const gameTeams = teams.filter((team) => team.game_type === selectedGameType);
    const newRanks = new Map<number, TeamRankInfo>();

    gameTeams.forEach((team) => {
      // 기존 결과가 있으면 불러오기
      const existingResult = existingResults.find(
        (r) => r.teamId === team.team_id && r.gameType === selectedGameType
      );

      newRanks.set(team.team_id, {
        teamId: team.team_id,
        finalRank: existingResult?.finalRank || 0,
        additionalInfo: existingResult?.additionalInfo || "",
      });
    });

    setTeamRanks(newRanks);
  }, [teams, selectedGameType, existingResults]);

  // 이벤트 목록 불러오기
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // 선택된 이벤트의 팀 목록 불러오기
  useEffect(() => {
    if (selectedEventId) {
      fetchTeams(selectedEventId);
      fetchExistingResults(selectedEventId);
    }
  }, [selectedEventId, fetchTeams, fetchExistingResults]);

  // 게임 타입 변경 시 순위 초기화
  useEffect(() => {
    initializeRanks();
  }, [initializeRanks]);

  const updateRank = (teamId: number, field: keyof TeamRankInfo, value: number | string) => {
    setTeamRanks((prev) => {
      const newMap = new Map(prev);
      const current = newMap.get(teamId) || {
        teamId,
        finalRank: 0,
        additionalInfo: "",
      };
      newMap.set(teamId, { ...current, [field]: value });
      return newMap;
    });
  };

  const handleSubmit = async () => {
    if (!selectedEventId) {
      showToast({ type: "error", message: "이벤트를 선택해주세요." });
      return;
    }

    // 선택된 게임 타입의 모든 팀 순위가 입력되었는지 확인
    const gameTeams = teams.filter((team) => team.game_type === selectedGameType);
    const hasEmptyRank = gameTeams.some((team) => {
      const rank = teamRanks.get(team.team_id);
      return !rank || rank.finalRank === 0;
    });

    if (hasEmptyRank) {
      showToast({ type: "error", message: "모든 팀의 순위를 입력해주세요." });
      return;
    }

    // 중복 순위 확인
    const ranks = Array.from(teamRanks.values())
      .filter((r) => {
        const team = teams.find((t) => t.team_id === r.teamId);
        return team?.game_type === selectedGameType;
      })
      .map((r) => r.finalRank);
    const uniqueRanks = new Set(ranks);

    if (ranks.length !== uniqueRanks.size) {
      showToast({ type: "error", message: "중복된 순위가 있습니다. 각 팀은 고유한 순위를 가져야 합니다." });
      return;
    }

    setLoading(true);
    try {
      const teamResults = Array.from(teamRanks.values()).filter((rank) => {
        const team = teams.find((t) => t.team_id === rank.teamId);
        return team?.game_type === selectedGameType && rank.finalRank > 0;
      });

      await apiClient.post("/api/admin/team-results", {
        eventId: selectedEventId,
        teamResults,
      });

      showToast({
        type: "success",
        message: `${selectedGameType} 경기 결과가 저장되었습니다! 자동으로 점수가 계산됩니다.`
      });

      // 결과 새로고침
      await fetchExistingResults(selectedEventId);
    } catch (error: unknown) {
      console.error("경기 결과 저장 실패:", error);
      const errorMessage = 
        (error && typeof error === 'object' && 'response' in error && 
         error.response && typeof error.response === 'object' && 'data' in error.response &&
         error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data &&
         typeof (error.response.data as {message: unknown}).message === 'string') 
         ? (error.response.data as {message: string}).message 
         : "경기 결과 저장에 실패했습니다.";
      showToast({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const gameTeams = teams.filter((team) => team.game_type === selectedGameType);
  const sortedTeams = [...gameTeams].sort((a, b) => {
    const rankA = teamRanks.get(a.team_id)?.finalRank || 999;
    const rankB = teamRanks.get(b.team_id)?.finalRank || 999;
    return rankA - rankB;
  });

  const calculateMultiplier = (rank: number, totalTeams: number): number => {
    if (totalTeams <= 1) return 5.0;
    return Number(
      (5.0 - (4.0 * (rank - 1)) / (totalTeams - 1)).toFixed(2)
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🏆 경기 결과 입력
        </h2>
        <p className="text-sm text-gray-600">
          각 게임의 팀 순위를 입력하면 자동으로 배수가 계산되고 베팅 점수가 산출됩니다.
        </p>
      </div>

      {/* 이벤트 선택 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이벤트 선택
        </label>
        <select
          value={selectedEventId ?? ""}
          onChange={(e) =>
            setSelectedEventId(e.target.value ? Number(e.target.value) : null)
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">이벤트를 선택하세요</option>
          {events.map((event) => (
            <option key={event.event_id} value={event.event_id}>
              {event.event_name} ({event.status})
            </option>
          ))}
        </select>
      </div>

      {selectedEventId && (
        <>
          {/* 게임 타입 선택 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              게임 선택
            </label>
            <div className="flex gap-2">
              {GAME_TYPES.map((gameType) => {
                const count = teams.filter((t) => t.game_type === gameType).length;
                return (
                  <button
                    key={gameType}
                    onClick={() => setSelectedGameType(gameType)}
                    disabled={count === 0}
                    className={`px-4 py-2 rounded-md font-medium transition-colors ${
                      selectedGameType === gameType
                        ? "bg-blue-600 text-white"
                        : count === 0
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {gameType} ({count}팀)
                  </button>
                );
              })}
            </div>
          </div>

          {/* 팀 순위 입력 */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              불러오는 중...
            </div>
          ) : gameTeams.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              {selectedGameType} 게임에 참가한 팀이 없습니다.
            </div>
          ) : (
            <>
              <div className="mb-4 p-4 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-800">
                  💡 <strong>배수 계산 공식:</strong> 5.0 - (4.0 × (순위-1) / (총팀수-1))
                </p>
                <p className="text-sm text-blue-800 mt-1">
                  총 {gameTeams.length}팀 기준:{" "}
                  {Array.from({ length: Math.min(gameTeams.length, 5) }, (_, i) => {
                    const rank = i + 1;
                    const multiplier = calculateMultiplier(rank, gameTeams.length);
                    return `${rank}등(${multiplier}배)`;
                  }).join(", ")}
                  {gameTeams.length > 5 && "..."}
                </p>
              </div>

              <div className="space-y-3">
                {sortedTeams.map((team) => {
                  const rank = teamRanks.get(team.team_id);
                  const multiplier =
                    rank && rank.finalRank > 0
                      ? calculateMultiplier(rank.finalRank, gameTeams.length)
                      : 0;

                  return (
                    <div
                      key={team.team_id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {/* 팀 정보 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {team.profile_image_url && (
                              <img
                                src={team.profile_image_url}
                                alt={team.team_name}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            )}
                            <h3 className="font-semibold text-gray-900 truncate">
                              {team.team_name}
                            </h3>
                            {rank && rank.finalRank > 0 && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded">
                                {rank.finalRank}등
                              </span>
                            )}
                            {multiplier > 0 && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">
                                {multiplier}배
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {team.description || "팀 소개 없음"}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            팀원: {team.members.map((m) => m.name).join(", ")}
                          </p>
                        </div>

                        {/* 순위 입력 */}
                        <div className="flex items-center gap-2">
                          <div className="w-24">
                            <select
                              value={rank?.finalRank || 0}
                              onChange={(e) =>
                                updateRank(
                                  team.team_id,
                                  "finalRank",
                                  Number(e.target.value)
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value={0}>순위 선택</option>
                              {Array.from({ length: gameTeams.length }, (_, i) => (
                                <option key={i + 1} value={i + 1}>
                                  {i + 1}등
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="w-40">
                            <input
                              type="text"
                              placeholder="추가 정보"
                              value={rank?.additionalInfo || ""}
                              onChange={(e) =>
                                updateRank(
                                  team.team_id,
                                  "additionalInfo",
                                  e.target.value
                                )
                              }
                              className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 저장 버튼 */}
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => initializeRanks()}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  초기화
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? "저장 중..." : `${selectedGameType} 결과 저장`}
                </button>
              </div>

              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  ⚠️ <strong>중요:</strong> 결과 저장 시 자동으로 모든 사용자의 베팅 점수가 계산되고 순위가 산출됩니다.
                  신중하게 입력해주세요!
                </p>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

