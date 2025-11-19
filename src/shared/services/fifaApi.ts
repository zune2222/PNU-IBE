/**
 * FIFA Online API 서비스
 */

import { apiClient } from './api';

export interface FifaPlayerStats {
  nickname: string;
  level: number;
  maxDivision: number;
  divisionName: string;
  totalMatches: number;
  wins: number;
  draws: number;
  losses: number;
  winRate: number;
  avgGoals: number;
  avgShots: number;
  shotAccuracy: number;
  avgPassAccuracy: number;
  estimatedTier: string;
}

export interface FifaApiResponse {
  success: boolean;
  data?: FifaPlayerStats;
  error?: string;
}

class FifaApiService {
  /**
   * 플레이어 정보 조회
   */
  async getPlayerInfo(nickname: string): Promise<FifaApiResponse> {
    try {
      console.log('⚽ [FifaApiService] 플레이어 정보 조회 시작:', nickname);
      
      if (!nickname || !nickname.trim()) {
        console.log('❌ [FifaApiService] 닉네임이 비어있음');
        return {
          success: false,
          error: '닉네임을 입력해주세요'
        };
      }

      const url = `/api/game/fifa/player/${encodeURIComponent(nickname.trim())}`;
      console.log('🌐 [FifaApiService] API 호출 URL:', url);
      
      const response = await apiClient.get<FifaPlayerStats>(url);
      
      console.log('📦 [FifaApiService] API 응답 받음:', response);
      console.log('📊 [FifaApiService] response 타입:', typeof response);

      // 백엔드에서 FifaPlayerStats 객체를 직접 반환하므로 response 자체가 데이터
      return {
        success: true,
        data: response
      };
    } catch (error: unknown) {
      console.error('💥 [FifaApiService] FIFA 플레이어 조회 실패:', error);
      const errorWithResponse = error as {response?: {data?: {message?: string}}};
      console.error('📛 [FifaApiService] error.response:', errorWithResponse.response);
      const errorWithMessage = error as {message?: string};
      console.error('📛 [FifaApiService] error.message:', errorWithMessage.message);
      
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
      'SUPER_STAR': 'text-red-600',
      'LEGEND': 'text-yellow-400'
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
      'SUPER_STAR': '슈퍼스타',
      'LEGEND': '레전드'
    };
    return tierNames[tier] || tier;
  }

  /**
   * 디비전 이름 변환
   */
  getDivisionName(division: number): string {
    const divisions: { [key: number]: string } = {
      800: 'DIV.8',
      900: 'DIV.9',
      1000: 'DIV.10',
      1100: '슈퍼챔피언스',
      1200: '챔피언스',
      1300: '슈퍼챔피언스',
      2000: '챔피언스',
      2100: '슈퍼챔피언스',
      2200: '챔피언스',
      2300: '슈퍼챔피언스',
      2400: '챔피언스',
      2500: '슈퍼챔피언스',
      2600: '챔피언스',
      2700: '슈퍼챔피언스',
      2800: '챔피언스',
      2900: '슈퍼챔피언스',
      3000: '챔피언스'
    };
    return divisions[division] || `DIV.${Math.floor(division / 100)}`;
  }

  /**
   * 승률 색상 반환
   */
  getWinRateColor(winRate: number): string {
    if (winRate >= 60) return 'text-green-600';
    if (winRate >= 50) return 'text-blue-600';
    if (winRate >= 40) return 'text-orange-600';
    return 'text-red-600';
  }

  /**
   * 슛 정확도 색상 반환
   */
  getShotAccuracyColor(accuracy: number): string {
    if (accuracy >= 60) return 'text-green-600';
    if (accuracy >= 50) return 'text-blue-600';
    if (accuracy >= 40) return 'text-orange-600';
    return 'text-red-600';
  }
}

export const fifaApiService = new FifaApiService();

