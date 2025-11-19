/**
 * Riot Games API 타입 정의
 */

// 소환사 정보
export interface SummonerInfo {
  id: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate: number;
  summonerLevel: number;
}

// 계정 정보 (Riot ID)
export interface AccountInfo {
  puuid: string;
  gameName: string;
  tagLine: string;
}

// 랭크 정보
export interface RankInfo {
  leagueId: string;
  queueType: string;
  tier: string;
  rank: string;
  summonerId: string;
  leaguePoints: number;
  wins: number;
  losses: number;
  veteran: boolean;
  inactive: boolean;
  freshBlood: boolean;
  hotStreak: boolean;
}

// 매치 정보
export interface MatchInfo {
  metadata: {
    dataVersion: string;
    matchId: string;
    participants: string[];
  };
  info: {
    gameCreation: number;
    gameDuration: number;
    gameId: number;
    gameMode: string;
    gameName: string;
    gameStartTimestamp: number;
    gameType: string;
    gameVersion: string;
    mapId: number;
    participants: ParticipantInfo[];
    queueId: number;
    teams: TeamInfo[];
  };
}

export interface ParticipantInfo {
  puuid: string;
  summonerId: string;
  summonerName: string;
  championId: number;
  championName: string;
  kills: number;
  deaths: number;
  assists: number;
  win: boolean;
  teamId: number;
  item0: number;
  item1: number;
  item2: number;
  item3: number;
  item4: number;
  item5: number;
  item6: number;
}

export interface TeamInfo {
  teamId: number;
  win: boolean;
  bans: Array<{
    championId: number;
    pickTurn: number;
  }>;
  objectives: {
    baron: { first: boolean; kills: number };
    champion: { first: boolean; kills: number };
    dragon: { first: boolean; kills: number };
    inhibitor: { first: boolean; kills: number };
    riftHerald: { first: boolean; kills: number };
    tower: { first: boolean; kills: number };
  };
}

// 통계 요약
export interface PlayerStats {
  summonerInfo: SummonerInfo;
  rankInfo: RankInfo[];
  recentMatches: {
    matchCount: number;
    wins: number;
    losses: number;
    winRate: number;
  };
}

// API 응답 형태
export interface RiotApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}