/**
 * PUBG 플레이어 통계 표시 컴포넌트
 */

import { useState, useEffect } from 'react';
import { pubgApiService, PubgPlayerStats as PubgStats } from '../../shared/services/pubgApi';

interface PubgPlayerStatsProps {
  gameNickname: string;
  showTitle?: boolean;
  compact?: boolean;
}

export default function PubgPlayerStats({ 
  gameNickname, 
  showTitle = true, 
  compact = false 
}: PubgPlayerStatsProps) {
  const [playerStats, setPlayerStats] = useState<PubgStats | null>(null);
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
      const response = await pubgApiService.getPlayerInfo(gameNickname);
      
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
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
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
          className="mt-2 text-sm text-orange-600 hover:text-orange-800 underline"
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
    // 컴팩트 버전 - 팀 목록용 (총 게임 수 & 승률만 표시)
    const winRate = playerStats.winRate ?? 0;
    const totalMatches = playerStats.totalMatches ?? 0;
    const wins = playerStats.wins ?? 0;
    
    return (
      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-3 border border-orange-200">
        {showTitle && (
          <h4 className="font-medium text-orange-900 mb-2">PUBG 전적</h4>
        )}
        
        <div className="flex items-center justify-between">
          {/* 닉네임 */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-orange-200 flex items-center justify-center border border-orange-300">
              <svg className="w-5 h-5 text-orange-700" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              </svg>
            </div>
            <div className="font-semibold text-gray-900 text-sm">
              {playerStats.playerName || '알 수 없음'}
            </div>
          </div>
          
          {/* 총 게임 수 & 승률 */}
          <div className="text-right">
            <div className={`text-lg font-bold ${pubgApiService.getWinRateColor(winRate)}`}>
              {winRate.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">
              {totalMatches}게임 ({wins}승)
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 풀 버전 - 상세 보기용
  const winRate = playerStats.winRate ?? 0;
  const totalMatches = playerStats.totalMatches ?? 0;
  const wins = playerStats.wins ?? 0;
  const top10s = playerStats.top10s ?? 0;
  const top10Rate = playerStats.top10Rate ?? 0;
  const kda = playerStats.kda ?? 0;
  const avgKills = playerStats.avgKills ?? 0;
  const headshotRate = playerStats.headshotRate ?? 0;
  const avgDamage = playerStats.avgDamage ?? 0;
  const avgSurvivalTime = playerStats.avgSurvivalTime ?? 0;
  const estimatedTier = playerStats.estimatedTier || 'BRONZE';
  
  return (
    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6 border border-orange-200">
      {showTitle && (
        <h4 className="text-lg font-semibold text-orange-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
          </svg>
          PUBG 전적
        </h4>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 플레이어 정보 */}
        <div className="bg-white rounded-lg p-4 border">
          <h5 className="font-medium text-gray-900 mb-3">플레이어 정보</h5>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">닉네임</span>
              <span className="font-medium text-gray-900">{playerStats.playerName || '알 수 없음'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">예상 티어</span>
              <span className={`font-bold ${pubgApiService.getTierColor(estimatedTier)}`}>
                {pubgApiService.getTierNameKr(estimatedTier)}
              </span>
            </div>
          </div>
        </div>

        {/* 승률 정보 */}
        <div className="bg-white rounded-lg p-4 border">
          <h5 className="font-medium text-gray-900 mb-3">전적 정보</h5>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">총 게임 수</span>
              <span className="font-medium text-gray-900">{totalMatches}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">치킨</span>
              <span className="font-medium text-green-600">{wins}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">승률</span>
              <span className={`font-bold ${pubgApiService.getWinRateColor(winRate)}`}>
                {winRate.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">TOP10 횟수</span>
              <span className="font-medium text-gray-900">
                {top10s} ({top10Rate.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        {/* 전투 통계 */}
        <div className="bg-white rounded-lg p-4 border md:col-span-2">
          <h5 className="font-medium text-gray-900 mb-4">전투 통계</h5>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${pubgApiService.getKdaColor(kda)}`}>
                {kda.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">KDA</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {avgKills.toFixed(2)}
              </div>
              <div className="text-sm text-gray-500">평균 킬</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {headshotRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-500">헤드샷률</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {avgDamage.toFixed(0)}
              </div>
              <div className="text-sm text-gray-500">평균 데미지</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">평균 생존 시간</span>
              <span className="font-medium text-gray-900">
                {Math.floor(avgSurvivalTime / 60)}분 {Math.round(avgSurvivalTime % 60)}초
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

