/**
 * FIFA Online 플레이어 통계 표시 컴포넌트
 */

import { useState, useEffect } from 'react';
import { fifaApiService, FifaPlayerStats as FifaStats } from '../../shared/services/fifaApi';

interface FifaPlayerStatsProps {
  gameNickname: string;
  showTitle?: boolean;
  compact?: boolean;
}

export default function FifaPlayerStats({ 
  gameNickname, 
  showTitle = true, 
  compact = false 
}: FifaPlayerStatsProps) {
  const [playerStats, setPlayerStats] = useState<FifaStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (gameNickname) {
      fetchPlayerStats();
    }
  }, [gameNickname]);

  const fetchPlayerStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fifaApiService.getPlayerInfo(gameNickname);
      
      if (response.success && response.data) {
        setPlayerStats(response.data);
      } else {
        setError(response.error || '플레이어 정보를 불러올 수 없습니다.');
      }
    } catch (err) {
      console.error('플레이어 통계 조회 실패:', err);
      setError('플레이어 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`${compact ? 'p-3' : 'p-4'} bg-gray-50 rounded-lg border`}>
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
          <span className="ml-2 text-sm text-gray-600">플레이어 정보 로딩 중...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${compact ? 'p-3' : 'p-4'} bg-red-50 rounded-lg border border-red-200`}>
        <div className="flex items-center text-red-600">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.996-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <span className="text-sm">{error}</span>
        </div>
        <button
          onClick={fetchPlayerStats}
          className="mt-2 text-sm text-green-600 hover:text-green-800 underline"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (!playerStats) {
    return null;
  }

  if (compact) {
    // 컴팩트 버전 - 팀 목록용
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
        {showTitle && (
          <h4 className="font-medium text-green-900 mb-3">FIFA Online 전적</h4>
        )}
        
        <div className="flex items-center space-x-4">
          {/* 플레이어 아이콘 */}
          <div className="w-12 h-12 rounded-lg bg-green-200 flex items-center justify-center border-2 border-green-300">
            <svg className="w-8 h-8 text-green-700" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          
          {/* 기본 정보 */}
          <div className="flex-1">
            <div className="font-semibold text-gray-900">
              {playerStats.nickname}
            </div>
            <div className={`text-sm font-medium ${fifaApiService.getTierColor(playerStats.estimatedTier)}`}>
              {fifaApiService.getTierNameKr(playerStats.estimatedTier)} · Lv.{playerStats.level}
            </div>
          </div>
          
          {/* 승률 */}
          <div className="text-center">
            <div className={`text-lg font-bold ${fifaApiService.getWinRateColor(playerStats.winRate)}`}>
              {playerStats.winRate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">
              {playerStats.wins}승 {playerStats.draws}무 {playerStats.losses}패
            </div>
          </div>
        </div>
        
        {/* 주요 통계 (간략) */}
        <div className="mt-3 pt-3 border-t border-green-200">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="font-bold text-gray-700">
                {playerStats.divisionName}
              </div>
              <div className="text-gray-500">최고 등급</div>
            </div>
            <div>
              <div className="font-bold text-gray-700">
                {playerStats.avgGoals.toFixed(1)}
              </div>
              <div className="text-gray-500">평균 득점</div>
            </div>
            <div>
              <div className={`font-bold ${fifaApiService.getShotAccuracyColor(playerStats.shotAccuracy)}`}>
                {playerStats.shotAccuracy.toFixed(1)}%
              </div>
              <div className="text-gray-500">슛 정확도</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 풀 버전 - 상세 보기용
  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 border border-green-200">
      {showTitle && (
        <h4 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
          FIFA Online 4 전적
        </h4>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 플레이어 정보 */}
        <div className="bg-white rounded-lg p-4 border">
          <h5 className="font-medium text-gray-900 mb-3">플레이어 정보</h5>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">닉네임</span>
              <span className="font-medium text-gray-900">{playerStats.nickname}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">레벨</span>
              <span className="font-medium text-gray-900">{playerStats.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">예상 티어</span>
              <span className={`font-bold ${fifaApiService.getTierColor(playerStats.estimatedTier)}`}>
                {fifaApiService.getTierNameKr(playerStats.estimatedTier)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">최고 등급</span>
              <span className="font-medium text-gray-900">{playerStats.divisionName}</span>
            </div>
          </div>
        </div>

        {/* 전적 정보 */}
        <div className="bg-white rounded-lg p-4 border">
          <h5 className="font-medium text-gray-900 mb-3">전적 정보</h5>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">총 경기 수</span>
              <span className="font-medium text-gray-900">{playerStats.totalMatches}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">승</span>
              <span className="font-medium text-green-600">{playerStats.wins}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">무</span>
              <span className="font-medium text-gray-600">{playerStats.draws}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">패</span>
              <span className="font-medium text-red-600">{playerStats.losses}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm text-gray-600 font-medium">승률</span>
              <span className={`font-bold ${fifaApiService.getWinRateColor(playerStats.winRate)}`}>
                {playerStats.winRate.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* 경기 통계 */}
        <div className="bg-white rounded-lg p-4 border md:col-span-2">
          <h5 className="font-medium text-gray-900 mb-4">경기 통계</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {playerStats.avgGoals.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">평균 득점</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {playerStats.avgShots.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">평균 슈팅</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${fifaApiService.getShotAccuracyColor(playerStats.shotAccuracy)}`}>
                {playerStats.shotAccuracy.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">슛 정확도</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {playerStats.avgPassAccuracy.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">패스 성공률</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

