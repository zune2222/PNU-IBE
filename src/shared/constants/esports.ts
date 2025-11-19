/**
 * E-Sports 관련 상수
 */

export const ESportsConstants = {
  /** 게임당 지급되는 베팅 포인트 */
  POINTS_PER_GAME: 100,
  
  /** PUBG 스쿼드 최대 팀원 수 (리더 제외) */
  MAX_PUBG_TEAM_MEMBERS: 3,
  
  /** 게임 타입 목록 */
  GAME_TYPES: ['LOL', 'PUBG', 'FIFA'] as const,
  
  /** 게임 타입 한글명 */
  GAME_TYPE_NAMES: {
    LOL: '리그 오브 레전드',
    PUBG: '배틀그라운드',
    FIFA: '피파 온라인 4',
  } as const,
  
  /** 배수 계산 공식의 최대 배수 */
  MAX_MULTIPLIER: 5.0,
  
  /** 배수 계산 공식의 배수 범위 */
  MULTIPLIER_RANGE: 4.0,
} as const;

