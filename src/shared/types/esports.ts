/**
 * E-Sports 관련 공통 타입 정의
 */

export type GameType = 'LOL' | 'PUBG' | 'FIFA';

export interface Event {
  eventId: number;
  eventName: string;
  status: string;
  registerStartDate?: string;
  registerEndDate?: string;
  bettingStartDate?: string;
  bettingEndDate?: string;
}

export interface Team {
  teamId: number;
  teamName: string;
  gameType: GameType;
  profileImageUrl?: string;
  description?: string;
  totalBetPoints?: number;
  bettorCount?: number;
  leaderGameNickname?: string;
  members: TeamMember[];
}

export interface TeamMember {
  studentId: string;
  name: string;
  gameNickname: string;
  phoneNumber?: string;
  email?: string;
  gameApiData?: string;
}

export interface BetInfo {
  teamId: number;
  betPoints: number;
}

export interface RankingUser {
  studentId: string;
  name: string;
  totalScore: number;
  gameScores: {
    [key in GameType]?: number;
  };
  rank: number;
  lastUpdated?: string;
}

export interface BettingPointSummary {
  eventId: number;
  studentId: string;
  totalScore: number;
  lolScore: number;
  pubgScore: number;
  fifaScore: number;
  hasResults: boolean;
}

export interface GameResult {
  teamId: number;
  teamName: string;
  rank: number;
}

/**
 * API 응답 타입 (snake_case)
 */
export interface ApiEventResponse {
  event_id: number;
  event_name: string;
  status: string;
  register_start_date?: string;
  register_end_date?: string;
  betting_start_date?: string;
  betting_end_date?: string;
}

export interface ApiTeamResponse {
  team_id: number;
  team_name: string;
  game_type: GameType;
  profile_image_url?: string;
  description?: string;
  total_bet_points?: number;
  bettor_count?: number;
  leader?: {
    student_id: string;
    name: string;
    game_nickname: string;
    game_api_data?: string;
  };
  members?: Array<{
    student_id: string;
    name: string;
    game_nickname: string;
    game_api_data?: string;
  }>;
}

export interface ApiBettingResponse {
  team_id: number;
  team_name: string;
  bet_points: number;
  total_team_bets?: number;
}

export interface ApiRankingResponse {
  rankings: Array<{
    rank: number;
    student_id: string;
    name: string;
    final_score: number;
    lol_score: number;
    pubg_score: number;
    fifa_score: number;
    last_updated?: string;
  }>;
}

export interface ApiBettingStatusResponse {
  eventId: number;
  eventName: string;
  gameType: GameType;
  teams: ApiTeamResponse[];
  userBetSummary?: {
    studentId: string;
    gameType: GameType;
    totalBetPoints: number;
    remainingPoints: number;
    userBets: Array<{
      teamId: number;
      teamName: string;
      betPoints: number;
    }>;
    lastBetTime?: string;
  };
}





