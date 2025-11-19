/**
 * Riot Games API 서비스
 */

import { apiClient } from './api';
import type {
  SummonerInfo,
  AccountInfo,
  RankInfo,
  MatchInfo,
  PlayerStats,
  RiotApiResponse
} from '../types/riot';

class RiotApiService {
  
  /**
   * 라이엇 ID 파싱 (gameName#tagLine 형태에서 분리)
   */
  private parseRiotId(riotId: string): { gameName: string; tagLine: string } {
    const parts = riotId.split('#');
    if (parts.length === 2) {
      return {
        gameName: parts[0].trim(),
        tagLine: parts[1].trim()
      };
    } else {
      // 태그가 없으면 기본값으로 KR1 사용
      return {
        gameName: riotId.trim(),
        tagLine: 'KR1'
      };
    }
  }

  /**
   * 라이엇 ID로 계정 정보 조회 (gameName#tagLine 또는 gameName만)
   */
  async getAccountByRiotIdString(riotId: string): Promise<RiotApiResponse<AccountInfo>> {
    const { gameName, tagLine } = this.parseRiotId(riotId);
    return this.getAccountByRiotId(gameName, tagLine);
  }

  /**
   * 종합 플레이어 통계 조회 (라이엇 ID 문자열로)
   */
  async getPlayerStatsByRiotId(riotId: string): Promise<RiotApiResponse<PlayerStats>> {
    const { gameName, tagLine } = this.parseRiotId(riotId);
    return this.getPlayerStats(gameName, tagLine);
  }

  /**
   * 라이엇 ID로 계정 정보 조회 (gameName#tagLine)
   */
  async getAccountByRiotId(gameName: string, tagLine?: string): Promise<RiotApiResponse<AccountInfo>> {
    try {
      const finalTagLine = tagLine || 'KR1';
      // 백엔드 프록시 API 사용 (CORS 문제 해결)
      const response = await apiClient.get<AccountInfo>(
        `/api/riot/account/${encodeURIComponent(gameName)}/${encodeURIComponent(finalTagLine)}`
      );
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('계정 정보 조회 실패:', error);
      
      // HTTP 오류 메시지를 더 자세히 처리
      let errorMessage = '계정 정보를 찾을 수 없습니다.';
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = '해당 라이엇 ID를 찾을 수 없습니다. ID와 태그를 확인해주세요.';
        } else if (error.message.includes('403') || error.message.includes('401')) {
          errorMessage = 'API 키가 유효하지 않습니다. 관리자에게 문의해주세요.';
        } else if (error.message.includes('429')) {
          errorMessage = 'API 요청 한도를 초과했습니다. 잠시 후 다시 시도해주세요.';
        } else if (error.message.includes('400')) {
          errorMessage = '잘못된 요청입니다. 라이엇 ID 형식을 확인해주세요.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  /**
   * PUUID로 소환사 정보 조회
   */
  async getSummonerByPuuid(puuid: string): Promise<RiotApiResponse<SummonerInfo>> {
    try {
      const response = await apiClient.get<SummonerInfo>(
        `/api/riot/summoner/by-puuid/${puuid}`
      );
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('소환사 정보 조회 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '소환사 정보를 찾을 수 없습니다.'
      };
    }
  }

  /**
   * 소환사 ID로 랭크 정보 조회
   */
  async getRankBySummonerId(summonerId: string): Promise<RiotApiResponse<RankInfo[]>> {
    try {
      const response = await apiClient.get<RankInfo[]>(
        `/api/riot/rank/${summonerId}`
      );
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('랭크 정보 조회 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '랭크 정보를 찾을 수 없습니다.'
      };
    }
  }

  /**
   * PUUID로 랭크 정보 조회
   */
  async getRankByPuuid(puuid: string): Promise<RiotApiResponse<RankInfo[]>> {
    try {
      const response = await apiClient.get<RankInfo[]>(
        `/api/riot/rank/by-puuid/${puuid}`
      );
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('랭크 정보 조회 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '랭크 정보를 찾을 수 없습니다.'
      };
    }
  }

  /**
   * PUUID로 최근 매치 목록 조회
   */
  async getRecentMatchIds(puuid: string, count: number = 20): Promise<RiotApiResponse<string[]>> {
    try {
      const response = await apiClient.get<string[]>(
        `/api/riot/matches/by-puuid/${puuid}?count=${count}`
      );
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('최근 매치 조회 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '최근 매치를 찾을 수 없습니다.'
      };
    }
  }

  /**
   * 매치 ID로 매치 상세 정보 조회
   */
  async getMatchById(matchId: string): Promise<RiotApiResponse<MatchInfo>> {
    try {
      const response = await apiClient.get<MatchInfo>(
        `/api/riot/match/${matchId}`
      );
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      console.error('매치 정보 조회 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '매치 정보를 찾을 수 없습니다.'
      };
    }
  }

  /**
   * 종합 플레이어 통계 조회
   */
  async getPlayerStats(gameName: string, tagLine?: string): Promise<RiotApiResponse<PlayerStats>> {
    try {
      const finalTagLine = tagLine || 'KR1';
      // 1. 계정 정보 조회
      const accountResponse = await this.getAccountByRiotId(gameName, finalTagLine);
      if (!accountResponse.success || !accountResponse.data) {
        return {
          success: false,
          error: '계정을 찾을 수 없습니다.'
        };
      }

      const account = accountResponse.data;

      // 2. 소환사 정보 조회
      const summonerResponse = await this.getSummonerByPuuid(account.puuid);
      if (!summonerResponse.success || !summonerResponse.data) {
        return {
          success: false,
          error: '소환사 정보를 찾을 수 없습니다.'
        };
      }

      const summoner = summonerResponse.data;

      // 3. 랭크 정보 조회 (PUUID 사용)
      const rankResponse = await this.getRankByPuuid(account.puuid);
      const rankInfo = rankResponse.data || [];

      // 4. 최근 매치 조회
      const matchIdsResponse = await this.getRecentMatchIds(account.puuid, 20);
      let recentMatches = {
        matchCount: 0,
        wins: 0,
        losses: 0,
        winRate: 0
      };

      if (matchIdsResponse.success && matchIdsResponse.data) {
        const matchIds = matchIdsResponse.data;
        let wins = 0;
        const totalMatches = matchIds.length;

        // 각 매치에서 승패 확인
        for (const matchId of matchIds) {
          const matchResponse = await this.getMatchById(matchId);
          if (matchResponse.success && matchResponse.data) {
            const participant = matchResponse.data.info.participants.find(
              p => p.puuid === account.puuid
            );
            if (participant && participant.win) {
              wins++;
            }
          }
        }

        recentMatches = {
          matchCount: totalMatches,
          wins,
          losses: totalMatches - wins,
          winRate: totalMatches > 0 ? Math.round((wins / totalMatches) * 100) : 0
        };
      }

      return {
        success: true,
        data: {
          summonerInfo: summoner,
          rankInfo,
          recentMatches
        }
      };
    } catch (error) {
      console.error('플레이어 통계 조회 실패:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '플레이어 정보를 가져오는데 실패했습니다.'
      };
    }
  }

  /**
   * 프로필 아이콘 URL 생성
   */
  getProfileIconUrl(profileIconId: number): string {
    return `https://opgg-static.akamaized.net/meta/images/profile_icons/profileIcon${profileIconId}.jpg?image=q_auto:good,f_webp,w_200&v=1763447055`;
  }

  /**
   * 티어 아이콘 URL 생성
   */
  getTierIconUrl(tier: string): string {
    const tierLower = tier.toLowerCase();
    return `https://opgg-static.akamaized.net/images/medals_new/${tierLower}.png?image=q_auto:good,f_webp,w_144&v=1763447055`;
  }

  /**
   * 티어 정보 포맷팅
   */
  formatTier(tier: string, rank: string, leaguePoints: number): string {
    if (tier === 'MASTER' || tier === 'GRANDMASTER' || tier === 'CHALLENGER') {
      return `${this.getTierDisplayName(tier)} ${leaguePoints} LP`;
    }
    return `${this.getTierDisplayName(tier)} ${rank} ${leaguePoints} LP`;
  }

  /**
   * 티어 표시명 변환
   */
  private getTierDisplayName(tier: string): string {
    const tierNames: { [key: string]: string } = {
      'IRON': '아이언',
      'BRONZE': '브론즈',
      'SILVER': '실버',
      'GOLD': '골드',
      'PLATINUM': '플래티넘',
      'EMERALD': '에메랄드',
      'DIAMOND': '다이아몬드',
      'MASTER': '마스터',
      'GRANDMASTER': '그랜드마스터',
      'CHALLENGER': '챌린저'
    };
    return tierNames[tier] || tier;
  }

  /**
   * 큐 타입 표시명 변환
   */
  getQueueDisplayName(queueType: string): string {
    const queueNames: { [key: string]: string } = {
      'RANKED_SOLO_5x5': '솔로 랭크',
      'RANKED_FLEX_SR': '자유 랭크',
      'RANKED_FLEX_TT': '3:3 랭크'
    };
    return queueNames[queueType] || queueType;
  }
}

export const riotApiService = new RiotApiService();