/**
 * E-Sports API 서비스 레이어
 * 백엔드 API 호출 및 타입 변환을 담당
 */

import { apiClient } from './api';
import type {
  Event,
  Team,
  BetInfo,
  RankingUser,
  GameResult,
  GameType,
  BettingPointSummary,
  ApiEventResponse,
  ApiTeamResponse,
  ApiBettingResponse,
  ApiRankingResponse,
  ApiBettingStatusResponse,
  BettingStatusResponse,
} from '../types/esports';

class ESportsApiService {
  /**
   * 이벤트 정보 조회
   */
  async getEvent(eventId: string | string[] | undefined): Promise<Event | null> {
    if (!eventId || Array.isArray(eventId)) {
      return null;
    }

    try {
      const response = await apiClient.get<ApiEventResponse>(`/api/admin/events/${eventId}`);
      return this.transformEventResponse(response);
    } catch (error) {
      console.error('이벤트 정보 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 모든 이벤트 목록 조회
   */
  async getAllEvents(): Promise<Event[]> {
    try {
      const response = await apiClient.get<ApiEventResponse[]>('/api/admin/events');
      return response.map(this.transformEventResponse);
    } catch (error) {
      console.error('이벤트 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 팀 목록 조회
   */
  async getTeams(eventId: string | string[] | undefined, gameType: GameType): Promise<Team[]> {
    if (!eventId || Array.isArray(eventId)) {
      return [];
    }

    try {
      const response = await apiClient.get<ApiTeamResponse[]>(
        `/api/teams/events/${eventId}?gameType=${gameType}`
      );
      return response.map(this.transformTeamResponse);
    } catch (error) {
      console.error('팀 목록 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 베팅 현황 조회
   */
  async getBettingStatus(
    eventId: string | string[] | undefined,
    gameType: GameType
  ): Promise<BettingStatusResponse | Team[]> {
    if (!eventId || Array.isArray(eventId)) {
      return [];
    }

    try {
      const url = `/api/betting/status?eventId=${eventId}&gameType=${gameType}`;
      console.log("🌐 API 요청:", url);
      
      const response = await apiClient.get<ApiBettingStatusResponse>(url);
      
      console.log("🔄 원본 API 응답:", response);
      
      // 새로운 API 응답 형식인지 확인
      if (response.teams && Array.isArray(response.teams)) {
        // 백엔드에서 snake_case로 응답하므로 올바르게 변환
        const rawResponse = response as unknown as Record<string, unknown>;
        const transformedResponse: BettingStatusResponse = {
          eventId: (rawResponse.event_id as number) || (rawResponse.eventId as number),
          eventName: (rawResponse.event_name as string) || (rawResponse.eventName as string),
          gameType: (rawResponse.game_type as GameType) || (rawResponse.gameType as GameType),
          teams: response.teams.map(this.transformTeamResponse),
          userBetSummary: (rawResponse.user_bet_summary || rawResponse.userBetSummary) as BettingStatusResponse['userBetSummary']
        };
        console.log("✅ 변환된 응답 (새 형식):", transformedResponse);
        return transformedResponse;
      } else {
        // 이전 형식의 응답이라면 teams 배열로 반환
        const responseData = response as unknown as { teams?: ApiTeamResponse[] } | ApiTeamResponse[];
        const teams = 'teams' in responseData ? responseData.teams : responseData;
        const transformedTeams = Array.isArray(teams) ? teams.map(this.transformTeamResponse) : [];
        console.log("✅ 변환된 응답 (이전 형식):", transformedTeams);
        return transformedTeams;
      }
    } catch (error) {
      console.error('❌ 베팅 현황 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 내 베팅 정보 조회
   */
  async getMyBets(
    eventId: string | string[] | undefined,
    gameType: GameType
  ): Promise<BetInfo[]> {
    if (!eventId || Array.isArray(eventId)) {
      return [];
    }

    try {
      const response = await apiClient.get<{
        success: boolean;
        bets: ApiBettingResponse[];
      }>(`/api/betting/my?eventId=${eventId}&gameType=${gameType}`);

      if (response.success && response.bets) {
        return response.bets.map((bet) => ({
          teamId: bet.team_id,
          betPoints: bet.bet_points,
        }));
      }
      return [];
    } catch (error) {
      console.error('내 베팅 정보 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 베팅 제출
   */
  async submitBets(
    eventId: string | string[] | undefined,
    gameType: GameType,
    bets: BetInfo[]
  ): Promise<void> {
    if (!eventId || Array.isArray(eventId)) {
      throw new Error('이벤트 ID가 필요합니다');
    }

    try {
      await apiClient.post('/api/betting', {
        event_id: Number(eventId),
        game_type: gameType,
        bets: bets.map((bet) => ({
          team_id: bet.teamId,
          bet_points: bet.betPoints,
        })),
      });
    } catch (error) {
      console.error('베팅 제출 실패:', error);
      throw error;
    }
  }

  /**
   * 팀 등록
   */
  async registerTeam(
    eventId: string | string[] | undefined,
    teamData: {
      teamName: string;
      gameType: GameType;
      leaderGameNickname: string;
      profileImageUrl?: string;
      description?: string;
      members?: Array<{ studentId: string; gameNickname: string }>;
    }
  ): Promise<void> {
    if (!eventId || Array.isArray(eventId)) {
      throw new Error('이벤트 ID가 필요합니다');
    }

    try {
      await apiClient.post('/api/teams', {
        event_id: Number(eventId),
        team_name: teamData.teamName,
        game_type: teamData.gameType,
        leader_game_nickname: teamData.leaderGameNickname,
        profile_image_url: teamData.profileImageUrl || null,
        description: teamData.description || null,
        members:
          teamData.gameType === 'PUBG'
            ? teamData.members?.map((m) => ({
                student_id: m.studentId,
                game_nickname: m.gameNickname,
              })) || []
            : [],
      });
    } catch (error) {
      console.error('팀 등록 실패:', error);
      throw error;
    }
  }

  /**
   * 순위표 조회
   */
  async getRanking(eventId: string | string[] | undefined): Promise<RankingUser[]> {
    if (!eventId || Array.isArray(eventId)) {
      return [];
    }

    try {
      const response = await apiClient.get<ApiRankingResponse>(
        `/api/ranking?eventId=${eventId}`
      );
      return response.rankings.map((entry) => ({
        studentId: entry.student_id,
        name: entry.name,
        totalScore: entry.final_score || 0,
        gameScores: {
          LOL: entry.lol_score || 0,
          PUBG: entry.pubg_score || 0,
          FIFA: entry.fifa_score || 0,
        },
        rank: entry.rank,
        lastUpdated: entry.last_updated,
      }));
    } catch (error) {
      console.error('순위표 조회 실패:', error);
      throw error;
    }
  }

  /**
   * 내 베팅 포인트 요약 조회
   */
  async getMyPointSummary(eventId: string | string[] | undefined): Promise<BettingPointSummary | null> {
    if (!eventId || Array.isArray(eventId)) {
      return null;
    }

    try {
      const response = await apiClient.get<{
        eventId: number;
        studentId: string;
        totalScore: number;
        lolScore: number;
        pubgScore: number;
        fifaScore: number;
        hasResults: boolean;
      }>(`/api/betting/my/points?eventId=${eventId}`);
      
      return {
        eventId: response.eventId,
        studentId: response.studentId,
        totalScore: response.totalScore,
        lolScore: response.lolScore,
        pubgScore: response.pubgScore,
        fifaScore: response.fifaScore,
        hasResults: response.hasResults,
      };
    } catch (error) {
      console.error('내 베팅 포인트 조회 실패:', error);
      return null; // 로그인하지 않은 경우 null 반환
    }
  }

  /**
   * 게임 결과 조회
   */
  async getGameResults(
    eventId: string | string[] | undefined,
    gameType: GameType
  ): Promise<GameResult[]> {
    if (!eventId || Array.isArray(eventId)) {
      return [];
    }

    try {
      const response = await apiClient.get<{
        success: boolean;
        results: Array<{ team_id: number; team_name: string; rank: number }>;
      }>(`/api/admin/results?eventId=${eventId}&gameType=${gameType}`);

      if (response.success && response.results) {
        return response.results.map((result) => ({
          teamId: result.team_id,
          teamName: result.team_name,
          rank: result.rank,
        }));
      }
      return [];
    } catch (error) {
      console.error('게임 결과 조회 실패:', error);
      throw error;
    }
  }

  /**
   * API 응답을 Event 타입으로 변환
   */
  private transformEventResponse(response: ApiEventResponse): Event {
    return {
      eventId: response.event_id,
      eventName: response.event_name,
      status: response.status,
      registerStartDate: response.register_start_date,
      registerEndDate: response.register_end_date,
      bettingStartDate: response.betting_start_date,
      bettingEndDate: response.betting_end_date,
    };
  }

  /**
   * API 응답을 Team 타입으로 변환
   */
  private transformTeamResponse(response: ApiTeamResponse): Team {
    const members: Team['members'] = [];

    // 리더 정보 추가
    if (response.leader) {
      members.push({
        studentId: response.leader.student_id,
        name: response.leader.name,
        gameNickname: response.leader.game_nickname,
        gameApiData: response.leader.game_api_data,
      });
    }

    // 팀원 정보 추가
    if (response.members) {
      members.push(
        ...response.members.map((member) => ({
          studentId: member.student_id,
          name: member.name,
          gameNickname: member.game_nickname,
          gameApiData: member.game_api_data,
        }))
      );
    }

    return {
      teamId: response.team_id,
      teamName: response.team_name,
      gameType: response.game_type,
      profileImageUrl: response.profile_image_url,
      description: response.description,
      totalBetPoints: response.total_bet_points,
      bettorCount: response.bettor_count,
      members,
    };
  }
}

export const esportsApiService = new ESportsApiService();





