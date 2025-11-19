/**
 * LoL 플레이어 통계 표시 컴포넌트
 */

import { useState, useEffect } from 'react';
import { riotApiService } from '../../shared/services/riotApi';
import { PlayerStats } from '../../shared/types/riot';

interface LoLPlayerStatsProps {
  gameNickname: string;
  showTitle?: boolean;
  compact?: boolean;
}

export default function LoLPlayerStats({ 
  gameNickname, 
  showTitle = true, 
  compact = false 
}: LoLPlayerStatsProps) {
  const [playerStats, setPlayerStats] = useState<PlayerStats | null>(null);
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
      const response = await riotApiService.getPlayerStatsByRiotId(gameNickname);
      
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
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
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
          className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline"
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
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
        {showTitle && (
          <h4 className="font-medium text-blue-900 mb-3">LoL 전적</h4>
        )}
        
        <div className="flex items-center space-x-4">
          {/* 프로필 아이콘 */}
          <img
            src={riotApiService.getProfileIconUrl(playerStats.summonerInfo.profileIconId)}
            alt="프로필 아이콘"
            className="w-12 h-12 rounded-lg border-2 border-gray-200"
          />
          
          {/* 기본 정보 */}
          <div className="flex-1">
            <div className="font-semibold text-gray-900">
              {playerStats.summonerInfo.name}
            </div>
            <div className="text-sm text-gray-600">
              Lv.{playerStats.summonerInfo.summonerLevel}
            </div>
          </div>
          
          {/* 승률 */}
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {playerStats.recentMatches.winRate}%
            </div>
            <div className="text-xs text-gray-500">
              {playerStats.recentMatches.wins}승 {playerStats.recentMatches.losses}패
            </div>
          </div>
        </div>
        
        {/* 랭크 정보 (간략) */}
        {playerStats.rankInfo.length > 0 && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                {riotApiService.getQueueDisplayName(playerStats.rankInfo[0].queueType)}
              </span>
              <div className="flex items-center space-x-2">
                <img
                  src={riotApiService.getTierIconUrl(playerStats.rankInfo[0].tier)}
                  alt={playerStats.rankInfo[0].tier}
                  className="w-5 h-5"
                />
                <span className="text-gray-700">
                  {riotApiService.formatTier(
                    playerStats.rankInfo[0].tier, 
                    playerStats.rankInfo[0].rank, 
                    playerStats.rankInfo[0].leaguePoints
                  )}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 풀 버전 - 상세 보기용
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
      {showTitle && (
        <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          League of Legends 전적
        </h4>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 소환사 정보 */}
        <div className="bg-white rounded-lg p-4 border">
          <h5 className="font-medium text-gray-900 mb-3">소환사 정보</h5>
          <div className="flex items-center space-x-4">
            <img
              src={riotApiService.getProfileIconUrl(playerStats.summonerInfo.profileIconId)}
              alt="프로필 아이콘"
              className="w-16 h-16 rounded-lg border-2 border-gray-200"
            />
            <div>
              <div className="font-semibold text-gray-900">
                {playerStats.summonerInfo.name}
              </div>
              <div className="text-sm text-gray-600">
                레벨 {playerStats.summonerInfo.summonerLevel}
              </div>
            </div>
          </div>
        </div>

        {/* 랭크 정보 */}
        <div className="bg-white rounded-lg p-4 border">
          <h5 className="font-medium text-gray-900 mb-3">랭크 정보</h5>
          {playerStats.rankInfo.length > 0 ? (
            <div className="space-y-3">
              {playerStats.rankInfo.map((rank, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">
                      {riotApiService.getQueueDisplayName(rank.queueType)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {rank.wins}승 {rank.losses}패 (승률 {Math.round((rank.wins / (rank.wins + rank.losses)) * 100)}%)
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img
                      src={riotApiService.getTierIconUrl(rank.tier)}
                      alt={rank.tier}
                      className="w-8 h-8"
                    />
                    <div className="text-right">
                      <div className="font-medium text-sm">
                        {riotApiService.formatTier(rank.tier, rank.rank, rank.leaguePoints)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4">
              <svg className="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm text-gray-500">랭크 정보 없음</p>
              <p className="text-xs text-gray-400">배치고사를 완료해주세요</p>
            </div>
          )}
        </div>

        {/* 최근 게임 승률 */}
        <div className="bg-white rounded-lg p-4 border md:col-span-2">
          <h5 className="font-medium text-gray-900 mb-4">최근 20게임 승률</h5>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {playerStats.recentMatches.winRate}%
                </div>
                <div className="text-sm text-gray-500">승률</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-green-600">
                  {playerStats.recentMatches.wins}
                </div>
                <div className="text-sm text-gray-500">승</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-semibold text-red-600">
                  {playerStats.recentMatches.losses}
                </div>
                <div className="text-sm text-gray-500">패</div>
              </div>
            </div>
            
            {/* 승률 프로그래스 바 */}
            <div className="flex-1 ml-8">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full transition-all duration-500 ${
                    playerStats.recentMatches.winRate >= 60 ? 'bg-green-500' :
                    playerStats.recentMatches.winRate >= 50 ? 'bg-blue-500' :
                    playerStats.recentMatches.winRate >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${playerStats.recentMatches.winRate}%` }}
                ></div>
              </div>
              <div className="text-sm text-gray-500 mt-2 text-center">
                총 {playerStats.recentMatches.matchCount}게임
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}