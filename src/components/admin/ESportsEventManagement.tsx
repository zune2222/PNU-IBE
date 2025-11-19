import React, { useState, useEffect, useCallback } from "react";
import { apiClient } from "../../shared/services/api";
import { useToast } from "../../shared/components/Toast";
import { useESSportsAuth } from "../../shared/contexts/ESSportsAuthContext";
import MatchResultManagement from "./MatchResultManagement";

interface ESportsEvent {
  event_id: number;
  event_name: string;
  status: string;
  register_start_date: string;
  register_end_date: string;
  betting_start_date?: string;
  betting_end_date?: string;
}

interface EventForm {
  eventName: string;
  registerStartDate: string;
  registerEndDate: string;
  bettingStartDate: string;
  bettingEndDate: string;
}

interface TeamMemberInfo {
  student_id: string;
  name: string;
  game_nickname: string;
  game_api_data?: string | null;
}

interface TeamInfo {
  team_id: number;
  team_name: string;
  game_type: string;
  profile_image_url?: string | null;
  description?: string | null;
  leader_phone?: string | null;
  leader_email?: string | null;
  leader: {
    student_id: string;
    name: string;
    game_nickname?: string | null;
    game_api_data?: string | null;
  };
  members: TeamMemberInfo[];
  created_at: string;
}

interface TeamEditForm {
  teamName: string;
  gameType: string;
  profileImageUrl: string;
  description: string;
  leaderPhone: string;
  leaderEmail: string;
  leaderGameNickname: string;
}

export default function ESportsEventManagement() {
  const { showToast } = useToast();
  const {
    isAuthenticated: isEsportsAuthenticated,
    loading: esportsAuthLoading,
  } = useESSportsAuth();
  const [events, setEvents] = useState<ESportsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState<EventForm>({
    eventName: "",
    registerStartDate: "",
    registerEndDate: "",
    bettingStartDate: "",
    bettingEndDate: "",
  });
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [teamGameFilter, setTeamGameFilter] = useState<string>("ALL");
  const [teams, setTeams] = useState<TeamInfo[]>([]);
  const [teamLoading, setTeamLoading] = useState(false);
  const [teamError, setTeamError] = useState<string | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<TeamInfo | null>(null);
  const [teamEditForm, setTeamEditForm] = useState<TeamEditForm | null>(null);
  const [teamUpdating, setTeamUpdating] = useState(false);
  const [teamDeleting, setTeamDeleting] = useState(false);
  const gameTypeOptions = ["LOL", "PUBG", "FIFA"];

  const buildTeamEditForm = (team: TeamInfo): TeamEditForm => ({
    teamName: team.team_name || "",
    gameType: team.game_type,
    profileImageUrl: team.profile_image_url || "",
    description: team.description || "",
    leaderPhone: team.leader_phone || "",
    leaderEmail: team.leader_email || "",
    leaderGameNickname: team.leader?.game_nickname || "",
  });

  const handleSelectTeam = (team: TeamInfo) => {
    setSelectedTeam(team);
    setTeamEditForm(buildTeamEditForm(team));
  };

  const updateEditForm = <K extends keyof TeamEditForm>(
    field: K,
    value: TeamEditForm[K]
  ) => {
    setTeamEditForm((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const fetchEventTeams = async (eventId: number, gameFilter: string) => {
    setTeamLoading(true);
    setTeamError(null);
    try {
      const query =
        gameFilter && gameFilter !== "ALL" ? `?gameType=${gameFilter}` : "";
      const response = await apiClient.get<TeamInfo[]>(
        `/api/admin/events/${eventId}/teams${query}`
      );
      setTeams(response);

      if (response.length === 0) {
        setSelectedTeam(null);
        setTeamEditForm(null);
        return;
      }

      const existingSelection = selectedTeam
        ? response.find((team) => team.team_id === selectedTeam.team_id)
        : null;

      if (existingSelection) {
        setSelectedTeam(existingSelection);
        setTeamEditForm(buildTeamEditForm(existingSelection));
      } else {
        setSelectedTeam(response[0]);
        setTeamEditForm(buildTeamEditForm(response[0]));
      }
    } catch (err) {
      console.error("팀 목록 조회 실패:", err);
      setTeamError(
        err instanceof Error ? err.message : "참가 팀 정보를 불러오지 못했습니다."
      );
      setTeams([]);
      setSelectedTeam(null);
      setTeamEditForm(null);
    } finally {
      setTeamLoading(false);
    }
  };

  const handleTeamUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !teamEditForm) return;
    setTeamUpdating(true);
    try {
      const payload = {
        team_name: teamEditForm.teamName,
        game_type: teamEditForm.gameType,
        profile_image_url: teamEditForm.profileImageUrl || null,
        description: teamEditForm.description || null,
        leader_phone: teamEditForm.leaderPhone || null,
        leader_email: teamEditForm.leaderEmail || null,
        leader_game_nickname: teamEditForm.leaderGameNickname || null,
      };
      await apiClient.put(`/api/admin/teams/${selectedTeam.team_id}`, payload);
      showToast({
        type: "success",
        message: "팀 정보가 업데이트되었습니다.",
      });
      if (selectedEventId) {
        fetchEventTeams(selectedEventId, teamGameFilter);
      }
    } catch (err) {
      console.error("팀 정보 수정 실패:", err);
      showToast({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "팀 정보를 수정하는 데 실패했습니다.",
      });
    } finally {
      setTeamUpdating(false);
    }
  };

  const handleTeamDelete = async () => {
    if (!selectedTeam || !selectedEventId) return;
    if (
      !confirm(
        `"${selectedTeam.team_name}" 팀을 삭제하면 해당 승부 예측 데이터도 무효화됩니다. 계속하시겠습니까?`
      )
    ) {
      return;
    }
    setTeamDeleting(true);
    try {
      await apiClient.delete(`/api/admin/teams/${selectedTeam.team_id}`);
      showToast({
        type: "success",
        message: "팀 신청이 삭제되었습니다.",
      });
      fetchEventTeams(selectedEventId, teamGameFilter);
    } catch (err) {
      console.error("팀 삭제 실패:", err);
      showToast({
        type: "error",
        message:
          err instanceof Error ? err.message : "팀을 삭제하는 데 실패했습니다.",
      });
    } finally {
      setTeamDeleting(false);
    }
  };

  const fetchEvents = useCallback(async () => {
    try {
      const response = await apiClient.get<ESportsEvent[]>("/api/admin/events");
      setEvents(response);
      if (!selectedEventId && response.length > 0) {
        setSelectedEventId(response[0].event_id);
      } else if (
        selectedEventId &&
        response.length > 0 &&
        !response.find((event) => event.event_id === selectedEventId)
      ) {
        setSelectedEventId(response[0].event_id);
      }
    } catch (err) {
      console.error("이벤트 목록 조회 실패:", err);
      setEvents([]);
      setError(err instanceof Error ? err.message : "이벤트 목록을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  }, [selectedEventId]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    if (!isEsportsAuthenticated || !selectedEventId) {
      if (!isEsportsAuthenticated) {
        setTeams([]);
        setSelectedTeam(null);
        setTeamEditForm(null);
      }
      return;
    }
    fetchEventTeams(selectedEventId, teamGameFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEventId, teamGameFilter, isEsportsAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 날짜 형식 변환 (datetime-local -> ISO string)
      const formatDateTime = (dateTimeStr: string) => {
        if (!dateTimeStr) return null;
        // datetime-local 형식: "2024-11-01T00:00" -> ISO 형식으로 변환
        return new Date(dateTimeStr).toISOString();
      };

      const eventData = {
        event_name: eventForm.eventName,
        register_start_date: formatDateTime(eventForm.registerStartDate),
        register_end_date: formatDateTime(eventForm.registerEndDate),
        betting_start_date: eventForm.bettingStartDate ? formatDateTime(eventForm.bettingStartDate) : null,
        betting_end_date: eventForm.bettingEndDate ? formatDateTime(eventForm.bettingEndDate) : null,
      };

      await apiClient.post<unknown>("/api/admin/events", eventData);
      alert("E-Sports 이벤트가 생성되었습니다!");
      resetForm();
      fetchEvents();
    } catch (error: unknown) {
      console.error("이벤트 생성 실패:", error);
      const errorMessage = error instanceof Error ? error.message : "이벤트 생성에 실패했습니다.";
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (eventId: number, status: string) => {
    if (!confirm(`이벤트 상태를 "${status}"로 변경하시겠습니까?`)) return;

    try {
      await apiClient.put<unknown>(`/api/admin/events/${eventId}/status?status=${status}`);
      showToast({
        type: "success",
        message: "이벤트 상태가 변경되었습니다!",
      });
      fetchEvents();
    } catch (error: unknown) {
      console.error("상태 변경 실패:", error);
      const errorMessage = error instanceof Error ? error.message : "상태 변경에 실패했습니다.";
      showToast({
        type: "error",
        message: errorMessage,
      });
    }
  };

  const resetForm = () => {
    setEventForm({
      eventName: "",
      registerStartDate: "",
      registerEndDate: "",
      bettingStartDate: "",
      bettingEndDate: "",
    });
  };

  const getStatusText = (status: string) => {
    const statusMap: { [key: string]: string } = {
      PREPARING: "준비중",
      REGISTRATION_OPEN: "참가신청중",
      PREDICTION_OPEN: "승부예측진행중",
      IN_PROGRESS: "경기진행중",
      COMPLETED: "종료",
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !loading) {
    return (
      <div className="mt-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-800 mb-2">에러가 발생했습니다</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchEvents();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* 이벤트 생성 폼 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">E-Sports 이벤트 생성</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이벤트명 *
              </label>
              <input
                type="text"
                value={eventForm.eventName}
                onChange={(e) =>
                  setEventForm({ ...eventForm, eventName: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="예: 제1회 PNU E-Sports 대회"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                참가 신청 시작일 *
              </label>
              <input
                type="datetime-local"
                value={eventForm.registerStartDate}
                onChange={(e) =>
                  setEventForm({ ...eventForm, registerStartDate: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                참가 신청 마감일 *
              </label>
              <input
                type="datetime-local"
                value={eventForm.registerEndDate}
                onChange={(e) =>
                  setEventForm({ ...eventForm, registerEndDate: e.target.value })
                }
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                베팅 시작일 (선택)
              </label>
              <input
                type="datetime-local"
                value={eventForm.bettingStartDate}
                onChange={(e) =>
                  setEventForm({ ...eventForm, bettingStartDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                베팅 마감일 (선택)
              </label>
              <input
                type="datetime-local"
                value={eventForm.bettingEndDate}
                onChange={(e) =>
                  setEventForm({ ...eventForm, bettingEndDate: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? "생성 중..." : "이벤트 생성"}
            </button>
          </form>
        </div>

        {/* 이벤트 목록 */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">E-Sports 이벤트 목록</h2>
          {events.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>생성된 이벤트가 없습니다.</p>
              <p className="text-sm mt-2">왼쪽 폼에서 이벤트를 생성하세요.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.event_id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">{event.event_name}</h3>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm">
                      {getStatusText(event.status)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1 mb-3">
                    <p>참가 신청: {formatDate(event.register_start_date)} ~ {formatDate(event.register_end_date)}</p>
                    {event.betting_start_date && (
                      <p>베팅 기간: {formatDate(event.betting_start_date)} ~ {formatDate(event.betting_end_date || "")}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={event.status}
                      onChange={(e) => handleStatusUpdate(event.event_id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="PREPARING">준비중</option>
                      <option value="REGISTRATION_OPEN">참가신청중</option>
                      <option value="PREDICTION_OPEN">승부예측진행중</option>
                      <option value="IN_PROGRESS">경기진행중</option>
                      <option value="COMPLETED">종료</option>
                    </select>
                    <a
                      href={`/esports/betting/${event.event_id}`}
                      target="_blank"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      베팅 페이지
                    </a>
                    <a
                      href={`/esports/ranking/${event.event_id}`}
                      target="_blank"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      순위표
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    <div className="mt-10">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full lg:w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              관리할 이벤트 선택
            </label>
            <select
              value={selectedEventId ?? ""}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : null;
                setSelectedEventId(value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">이벤트를 선택하세요</option>
              {events.map((event) => (
                <option key={event.event_id} value={event.event_id}>
                  {event.event_name}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full lg:w-1/3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              게임 필터
            </label>
            <select
              value={teamGameFilter}
              onChange={(e) => setTeamGameFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">전체</option>
              {gameTypeOptions.map((game) => (
                <option key={game} value={game}>
                  {game}
                </option>
              ))}
            </select>
          </div>
        </div>

        {esportsAuthLoading ? (
          <div className="text-center text-gray-500 py-12">
            E-Sports 인증 정보를 확인하고 있습니다...
          </div>
        ) : !isEsportsAuthenticated ? (
          <div className="text-center text-gray-500 py-12 space-y-3">
            <p>참가 신청 정보를 보기 전에 E-Sports 학번 로그인(JWT)이 필요합니다.</p>
            <p className="text-sm">
              <a
                href="/esports/login"
                target="_blank"
                className="text-blue-600 underline"
              >
                /esports/login
              </a>{" "}
              페이지에서 학번으로 로그인한 뒤 다시 열어주세요.
            </p>
          </div>
        ) : !selectedEventId ? (
          <div className="text-center text-gray-500 py-12">
            관리할 이벤트를 선택하면 참가 신청 팀 목록을 확인할 수 있습니다.
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-6 mt-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  참가 팀 목록 ({teams.length})
                </h3>
                {teamLoading && (
                  <span className="text-sm text-gray-500">불러오는 중...</span>
                )}
              </div>
              {teamError ? (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 text-sm text-red-700">
                  {teamError}
                </div>
              ) : teams.length === 0 && !teamLoading ? (
                <div className="text-center text-gray-500 py-10 text-sm">
                  등록된 팀이 없습니다.
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {teams.map((team) => (
                    <button
                      key={team.team_id}
                      onClick={() => handleSelectTeam(team)}
                      className={`w-full text-left p-3 hover:bg-blue-50 rounded transition ${
                        selectedTeam?.team_id === team.team_id
                          ? "bg-blue-50 border border-blue-200"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {team.team_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {team.game_type} · 팀원 {team.members.length}명
                          </p>
                        </div>
                        <span className="text-xs text-gray-500">
                          신청일{" "}
                          {new Date(team.created_at).toLocaleDateString("ko-KR")}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        <p>리더: {team.leader?.name}</p>
                        <p>
                          연락처: {team.leader_phone || "-"} /{" "}
                          {team.leader_email || "-"}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              {selectedTeam && teamEditForm ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      팀 상세 정보
                    </h3>
                    <p className="text-sm text-gray-500">
                      팀 신청 정보를 확인하고 수정할 수 있습니다.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-700 space-y-1">
                    <p>
                      <span className="font-semibold">리더:</span>{" "}
                      {selectedTeam.leader?.name} (
                      {selectedTeam.leader?.student_id})
                    </p>
                    <p>
                      <span className="font-semibold">게임 닉네임:</span>{" "}
                      {selectedTeam.leader?.game_nickname || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">연락처:</span>{" "}
                      {selectedTeam.leader_phone || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">이메일:</span>{" "}
                      {selectedTeam.leader_email || "-"}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">
                      팀원 정보
                    </h4>
                    <div className="border rounded-md max-h-48 overflow-y-auto">
                      {selectedTeam.members.length === 0 ? (
                        <p className="text-sm text-gray-500 p-3">
                          등록된 팀원이 없습니다.
                        </p>
                      ) : (
                        selectedTeam.members.map((member) => (
                          <div
                            key={member.student_id}
                            className="px-3 py-2 border-b last:border-b-0 text-sm"
                          >
                            <p className="font-medium text-gray-900">
                              {member.name} ({member.student_id})
                            </p>
                            <p className="text-gray-600">
                              닉네임: {member.game_nickname}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleTeamUpdate} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          팀명
                        </label>
                        <input
                          type="text"
                          value={teamEditForm.teamName}
                          onChange={(e) =>
                            updateEditForm("teamName", e.target.value)
                          }
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          게임 종목
                        </label>
                        <select
                          value={teamEditForm.gameType}
                          onChange={(e) =>
                            updateEditForm("gameType", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {gameTypeOptions.map((game) => (
                            <option key={game} value={game}>
                              {game}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          리더 연락처
                        </label>
                        <input
                          type="tel"
                          value={teamEditForm.leaderPhone}
                          onChange={(e) =>
                            updateEditForm("leaderPhone", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="010-0000-0000"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          리더 이메일
                        </label>
                        <input
                          type="email"
                          value={teamEditForm.leaderEmail}
                          onChange={(e) =>
                            updateEditForm("leaderEmail", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="example@pnu.ac.kr"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        리더 게임 닉네임
                      </label>
                      <input
                        type="text"
                        value={teamEditForm.leaderGameNickname}
                        onChange={(e) =>
                          updateEditForm("leaderGameNickname", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        프로필 이미지 URL
                      </label>
                      <input
                        type="url"
                        value={teamEditForm.profileImageUrl}
                        onChange={(e) =>
                          updateEditForm("profileImageUrl", e.target.value)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        한줄 소개
                      </label>
                      <textarea
                        value={teamEditForm.description}
                        onChange={(e) =>
                          updateEditForm("description", e.target.value)
                        }
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="팀의 각오나 소개를 입력하세요"
                      />
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <button
                        type="submit"
                        disabled={teamUpdating}
                        className="inline-flex justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {teamUpdating ? "저장 중..." : "팀 정보 저장"}
                      </button>
                      <button
                        type="button"
                        onClick={handleTeamDelete}
                        disabled={teamDeleting}
                        className="inline-flex justify-center px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-md hover:bg-red-100 disabled:opacity-50"
                      >
                        {teamDeleting ? "삭제 중..." : "팀 신청 삭제"}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                  확인할 팀을 목록에서 선택하세요.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>

      {/* 경기 결과 입력 섹션 */}
      <div className="mt-10">
        <MatchResultManagement />
    </div>
    </div>
  );
}

