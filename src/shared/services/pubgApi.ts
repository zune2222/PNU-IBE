/**
 * PUBG API 서비스
 */

import { apiClient } from './api';

export interface PubgPlayerStats {
  playerName: string;
  platform: string;
  totalMatches: number;
  wins: number;
  winRate: number;
  top10s: number;
  top10Rate: number;
  kda: number;
  avgKills: number;
  headshotRate: number;
  avgDamage: number;
  avgSurvivalTime: number;
  estimatedTier: string;
}

export interface PubgApiResponse {
  success: boolean;
  data?: PubgPlayerStats;
  error?: string;
}

class PubgApiService {
  /**
   * 플레이어 정보 조회
   */
  async getPlayerInfo(nickname: string): Promise<PubgApiResponse> {
    try {
      console.log('🎮 [PubgApiService] 플레이어 정보 조회 시작:', nickname);
      
      if (!nickname || !nickname.trim()) {
        console.log('❌ [PubgApiService] 닉네임이 비어있음');
        return {
          success: false,
          error: '닉네임을 입력해주세요'
        };
      }

      const url = `/api/game/pubg/player/${encodeURIComponent(nickname.trim())}`;
      console.log('🌐 [PubgApiService] API 호출 URL:', url);
      
      const response = await apiClient.get<PubgPlayerStats>(url);
      
      console.log('📦 [PubgApiService] API 응답 받음:', response);
      console.log('📊 [PubgApiService] response 타입:', typeof response);
      console.log('📊 [PubgApiService] response 내용:', JSON.stringify(response, null, 2));

      // 백엔드에서 PubgPlayerStats 객체를 직접 반환하므로 response 자체가 데이터
      return {
        success: true,
        data: response
      };
    } catch (error: unknown) {
      console.error('💥 [PubgApiService] PUBG 플레이어 조회 실패:', error);
      const errorWithResponse = error as {response?: {data?: {message?: string}}};
      console.error('📛 [PubgApiService] error.response:', errorWithResponse.response);
      console.error('📛 [PubgApiService] error.response?.data:', errorWithResponse.response?.data);
      const errorWithMessage = error as {message?: string};
      console.error('📛 [PubgApiService] error.message:', errorWithMessage.message);
      
      return {
        success: false,
        error: errorWithResponse.response?.data?.message || '플레이어 정보를 불러올 수 없습니다'
      };
    }
  }

  /**
   * 티어 색상 반환
   */
  getTierColor(tier: string): string {
    const tierColors: { [key: string]: string } = {
      'BRONZE': 'text-orange-700',
      'SILVER': 'text-gray-500',
      'GOLD': 'text-yellow-500',
      'PLATINUM': 'text-cyan-500',
      'DIAMOND': 'text-blue-500',
      'MASTER': 'text-purple-600',
      'GRAND_MASTER': 'text-red-600',
      'CHALLENGER': 'text-yellow-400'
    };
    return tierColors[tier] || 'text-gray-700';
  }

  /**
   * 티어 이름 한글 변환
   */
  getTierNameKr(tier: string): string {
    const tierNames: { [key: string]: string } = {
      'BRONZE': '브론즈',
      'SILVER': '실버',
      'GOLD': '골드',
      'PLATINUM': '플래티넘',
      'DIAMOND': '다이아몬드',
      'MASTER': '마스터',
      'GRAND_MASTER': '그랜드마스터',
      'CHALLENGER': '챌린저'
    };
    return tierNames[tier] || tier;
  }

  /**
   * 승률 색상 반환
   */
  getWinRateColor(winRate: number): string {
    if (winRate >= 50) return 'text-green-600';
    if (winRate >= 40) return 'text-blue-600';
    if (winRate >= 30) return 'text-orange-600';
    return 'text-red-600';
  }

  /**
   * KDA 색상 반환
   */
  getKdaColor(kda: number): string {
    if (kda >= 3) return 'text-green-600';
    if (kda >= 2) return 'text-blue-600';
    if (kda >= 1) return 'text-orange-600';
    return 'text-red-600';
  }
}

export const pubgApiService = new PubgApiService();

