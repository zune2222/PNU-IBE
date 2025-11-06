import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Header } from '../../widgets/Header';
import { Footer } from '../../widgets/Footer';

interface Event {
  eventId: number;
  eventName: string;
  status: string;
}

type GameType = 'LOL' | 'PUBG' | 'FIFA';

interface Team {
  teamId: number;
  teamName: string;
  gameType: GameType;
  profileImageUrl?: string;
  description?: string;
  totalBetPoints: number;
  bettorCount: number;
  members: {
    studentId: string;
    name: string;
    gameNickname: string;
    gameApiData?: string;
  }[];
}

interface BetInfo {
  teamId: number;
  betPoints: number;
}

export default function ESportsBetting() {
  const router = useRouter();
  const { eventId } = router.query;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameType>('LOL');
  const [teams, setTeams] = useState<Team[]>([]);
  const [bets, setBets] = useState<BetInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // 학생 인증 (임시)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [studentId, setStudentId] = useState('');

  const POINTS_PER_GAME = 100;

  useEffect(() => {
    if (eventId) {
      fetchEvent();
      fetchTeams();
    }
  }, [eventId, selectedGame]);

  const fetchEvent = async () => {
    try {
      // 추후 실제 API 연동
      setEvent({
        eventId: Number(eventId),
        eventName: '제1회 PNU E-Sports 대회',
        status: 'PREDICTION_OPEN'
      });
    } catch (error) {
      console.error('이벤트 정보 조회 실패:', error);
    }
  };

  const fetchTeams = async () => {
    try {
      // Mock 데이터
      const mockTeams: Team[] = [
        {
          teamId: 1,
          teamName: '불타는 망치들',
          gameType: selectedGame,
          profileImageUrl: '',
          description: '우승을 향해 달려갑니다!',
          totalBetPoints: 450,
          bettorCount: 12,
          members: [
            { studentId: '202012345', name: '김철수', gameNickname: 'IronHammer' }
          ]
        },
        {
          teamId: 2,
          teamName: '코딩의 신들',
          gameType: selectedGame,
          profileImageUrl: '',
          description: '버그를 잡듯 적을 잡겠습니다',
          totalBetPoints: 320,
          bettorCount: 8,
          members: [
            { studentId: '202067890', name: '이영희', gameNickname: 'CodeMaster' }
          ]
        },
        {
          teamId: 3,
          teamName: '알고리즘 파이터즈',
          gameType: selectedGame,
          profileImageUrl: '',
          description: 'O(1)로 승리하겠습니다',
          totalBetPoints: 230,
          bettorCount: 5,
          members: [
            { studentId: '202011111', name: '박민수', gameNickname: 'AlgoFighter' }
          ]
        }
      ];
      setTeams(mockTeams);
    } catch (error) {
      console.error('팀 목록 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthenticate = () => {
    // 간단한 인증 (실제로는 proper 인증 필요)
    const inputStudentId = prompt('학번을 입력하세요:');
    if (inputStudentId) {
      setStudentId(inputStudentId);
      setIsAuthenticated(true);
    }
  };

  const updateBet = (teamId: number, points: number) => {
    setBets(prevBets => {
      const existingBetIndex = prevBets.findIndex(bet => bet.teamId === teamId);
      
      if (points === 0) {
        // 포인트가 0이면 승부 예측 제거
        return prevBets.filter(bet => bet.teamId !== teamId);
      }
      
      if (existingBetIndex >= 0) {
        // 기존 승부 예측 업데이트
        const newBets = [...prevBets];
        newBets[existingBetIndex].betPoints = points;
        return newBets;
      } else {
        // 새 승부 예측 추가
        return [...prevBets, { teamId, betPoints: points }];
      }
    });
  };

  const getTotalBetPoints = () => {
    return bets.reduce((total, bet) => total + bet.betPoints, 0);
  };

  const getRemainingPoints = () => {
    return POINTS_PER_GAME - getTotalBetPoints();
  };

  const getBetForTeam = (teamId: number) => {
    const bet = bets.find(b => b.teamId === teamId);
    return bet ? bet.betPoints : 0;
  };

  const handleSubmitBets = async () => {
    if (getTotalBetPoints() !== POINTS_PER_GAME) {
      alert(`총 ${POINTS_PER_GAME}포인트를 모두 사용해야 합니다.`);
      return;
    }

    setSubmitting(true);
    try {
      // 추후 실제 API 연동
      const bettingData = {
        eventId: Number(eventId),
        gameType: selectedGame,
        bets: bets
      };
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('승부 예측이 완료되었습니다!');
      setBets([]);
      fetchTeams(); // 업데이트된 승부 예측 현황 조회
    } catch (error) {
      console.error('승부 예측 실패:', error);
      alert('승부 예측에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const getMultiplier = (rank: number, totalTeams: number) => {
    return 5.0 - (4.0 * (rank - 1) / (totalTeams - 1));
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>승부 예측 참여 | E-Sports | 부산대학교 정보의생명공학대학 학생회</title>
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 섹션 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-4">
              <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
              <span className="text-sm font-semibold text-primary korean-text">
                승부 예측 참여
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold korean-text mb-2">
              <span className="bg-gradient-to-r from-dark to-gray-700 bg-clip-text text-transparent">
                승부{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  예측
                </span>
              </span>
            </h1>
            <h2 className="text-lg text-gray-600 korean-text">{event?.eventName}</h2>
          </div>

          {!isAuthenticated ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 text-center">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-dark korean-text mb-4">학생 인증이 필요합니다</h3>
              <p className="text-gray-600 korean-text mb-6">승부 예측 참여를 위해서는 먼저 학생 인증을 완료해야 합니다.</p>
              <button
                onClick={handleAuthenticate}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 korean-text font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                학생 인증하기
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 게임 선택 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">게임 선택</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { value: 'LOL', name: 'League of Legends' },
                    { value: 'PUBG', name: 'PUBG' },
                    { value: 'FIFA', name: 'FIFA Online 4' }
                  ].map((game) => (
                    <button
                      key={game.value}
                      onClick={() => setSelectedGame(game.value as GameType)}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        selectedGame === game.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="mb-2">
                        {game.value === 'LOL' && (
                          <svg className="w-8 h-8 mx-auto text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 6H3a1 1 0 000 2h.062l1.538 12.31A2 2 0 006.58 22h10.84a2 2 0 001.98-1.69L20.938 8H21a1 1 0 000-2zM19.938 8L18.58 20H5.42L4.062 8h15.876zM9 10a1 1 0 011 1v6a1 1 0 01-2 0v-6a1 1 0 011-1zm6 0a1 1 0 011 1v6a1 1 0 01-2 0v-6a1 1 0 011-1z"/>
                            <path d="M12 2a4 4 0 014 4v2H8V6a4 4 0 014-4z"/>
                          </svg>
                        )}
                        {game.value === 'PUBG' && (
                          <svg className="w-8 h-8 mx-auto text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12H8m8 0a4 4 0 01-4 4H8a4 4 0 01-4-4 4 4 0 014-4h4a4 4 0 014 4z" />
                          </svg>
                        )}
                        {game.value === 'FIFA' && (
                          <svg className="w-8 h-8 mx-auto text-green-600" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                          </svg>
                        )}
                      </div>
                      <div className="font-semibold">{game.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 승부 예측 상태 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">승부 예측 현황</h3>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-blue-600">
                      사용: {getTotalBetPoints()}/{POINTS_PER_GAME}pt
                    </div>
                    <div className="text-sm text-gray-600">
                      남은 포인트: {getRemainingPoints()}pt
                    </div>
                  </div>
                </div>

                {/* 진행률 바 */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${(getTotalBetPoints() / POINTS_PER_GAME) * 100}%` }}
                  ></div>
                </div>

                {bets.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <h4 className="font-medium text-gray-900">내 승부 예측:</h4>
                    {bets.map(bet => {
                      const team = teams.find(t => t.teamId === bet.teamId);
                      return (
                        <div key={bet.teamId} className="flex justify-between text-sm">
                          <span>{team?.teamName}</span>
                          <span>{bet.betPoints}pt</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                <button
                  onClick={handleSubmitBets}
                  disabled={getTotalBetPoints() !== POINTS_PER_GAME || submitting}
                  className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? '승부 예측 중...' : '승부 예측 확정'}
                </button>
              </div>

              {/* 팀 목록 */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  참가팀 목록 (인기순)
                </h3>
                
                <div className="space-y-4">
                  {teams.map((team) => (
                    <div
                      key={team.teamId}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">
                            {team.teamName}
                          </h4>
                          {team.description && (
                            <p className="text-gray-600 text-sm mt-1">
                              {team.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-green-600">
                            {team.totalBetPoints}pt
                          </div>
                          <div className="text-sm text-gray-600">
                            {team.bettorCount}명 승부 예측
                          </div>
                        </div>
                      </div>

                      {/* 팀원 정보 */}
                      <div className="mb-4">
                        <h5 className="font-medium text-gray-900 mb-2">팀원:</h5>
                        <div className="space-y-1">
                          {team.members.map((member, index) => (
                            <div key={index} className="text-sm text-gray-600">
                              {member.name} ({member.gameNickname})
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 승부 예측 입력 */}
                      <div className="flex items-center space-x-4">
                        <label className="text-sm font-medium text-gray-700">
                          승부 예측 포인트:
                        </label>
                        <input
                          type="number"
                          min="0"
                          max={getRemainingPoints() + getBetForTeam(team.teamId)}
                          value={getBetForTeam(team.teamId)}
                          onChange={(e) => updateBet(team.teamId, parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-600">pt</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 배수 시스템 안내 */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                  배수 시스템 ({teams.length}팀 참가)
                </h3>
                <p className="text-sm text-yellow-700 mb-4">
                  팀 수에 따라 1등 5.0배에서 꼴등 1.0배까지 자동 조절됩니다
                </p>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                  {Array.from({ length: teams.length }, (_, i) => (
                    <div key={i} className="text-center">
                      <div className="font-semibold text-yellow-800">
                        {i + 1}등
                      </div>
                      <div className="text-yellow-600">
                        {getMultiplier(i + 1, teams.length).toFixed(1)}배
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}