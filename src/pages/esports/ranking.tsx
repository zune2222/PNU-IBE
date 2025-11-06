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

interface RankingUser {
  studentId: string;
  name: string;
  totalScore: number;
  gameScores: {
    [key in GameType]?: number;
  };
  rank: number;
}

interface GameResult {
  teamId: number;
  teamName: string;
  rank: number;
}

export default function ESportsRanking() {
  const router = useRouter();
  const { eventId } = router.query;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [selectedView, setSelectedView] = useState<'ranking' | 'results'>('ranking');
  const [selectedGame, setSelectedGame] = useState<GameType>('LOL');
  const [ranking, setRanking] = useState<RankingUser[]>([]);
  const [gameResults, setGameResults] = useState<{[key in GameType]?: GameResult[]}>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
      fetchRanking();
      fetchGameResults();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setEvent({
        eventId: Number(eventId),
        eventName: '제1회 PNU E-Sports 대회',
        status: 'COMPLETED'
      });
    } catch (error) {
      console.error('이벤트 정보 조회 실패:', error);
    }
  };

  const fetchRanking = async () => {
    try {
      // Mock 데이터
      const mockRanking: RankingUser[] = [
        {
          studentId: '202012345',
          name: '김철수',
          totalScore: 850,
          gameScores: { LOL: 300, PUBG: 250, FIFA: 300 },
          rank: 1
        },
        {
          studentId: '202067890',
          name: '이영희',
          totalScore: 720,
          gameScores: { LOL: 200, PUBG: 320, FIFA: 200 },
          rank: 2
        },
        {
          studentId: '202011111',
          name: '박민수',
          totalScore: 680,
          gameScores: { LOL: 250, PUBG: 180, FIFA: 250 },
          rank: 3
        },
        {
          studentId: '202099999',
          name: '최지혜',
          totalScore: 620,
          gameScores: { LOL: 180, PUBG: 200, FIFA: 240 },
          rank: 4
        },
        {
          studentId: '202055555',
          name: '정호영',
          totalScore: 580,
          gameScores: { LOL: 150, PUBG: 230, FIFA: 200 },
          rank: 5
        }
      ];
      setRanking(mockRanking);
    } catch (error) {
      console.error('순위 조회 실패:', error);
    }
  };

  const fetchGameResults = async () => {
    try {
      // Mock 데이터
      const mockResults = {
        LOL: [
          { teamId: 1, teamName: '불타는 망치들', rank: 1 },
          { teamId: 2, teamName: '코딩의 신들', rank: 2 },
          { teamId: 3, teamName: '알고리즘 파이터즈', rank: 3 },
          { teamId: 4, teamName: '버그 헌터즈', rank: 4 }
        ],
        PUBG: [
          { teamId: 5, teamName: '배그 마스터즈', rank: 1 },
          { teamId: 6, teamName: '치킨 사냥꾼들', rank: 2 },
          { teamId: 7, teamName: '스쿼드 킹즈', rank: 3 },
          { teamId: 8, teamName: '배그 레전드', rank: 4 }
        ],
        FIFA: [
          { teamId: 9, teamName: '축구천재', rank: 1 },
          { teamId: 10, teamName: 'FIFA 왕', rank: 2 },
          { teamId: 11, teamName: '골잡이들', rank: 3 },
          { teamId: 12, teamName: '축구 머신', rank: 4 }
        ]
      };
      setGameResults(mockResults);
    } catch (error) {
      console.error('게임 결과 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return 'text-yellow-600 bg-yellow-50';
      case 2: return 'text-gray-600 bg-gray-50';
      case 3: return 'text-orange-600 bg-orange-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}위`;
    }
  };

  const getGameIcon = (game: GameType) => {
    switch (game) {
      case 'LOL': return '🎮';
      case 'PUBG': return '🔫';
      case 'FIFA': return '⚽';
    }
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
        <title>순위표 | E-Sports | 부산대학교 정보의생명공학대학 학생회</title>
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 헤더 섹션 */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-4">
              <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
              <span className="text-sm font-semibold text-primary korean-text">
                순위표
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold korean-text mb-2">
              <span className="bg-gradient-to-r from-dark to-gray-700 bg-clip-text text-transparent">
                승부 예측{" "}
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  순위표
                </span>
              </span>
            </h1>
            <h2 className="text-lg text-gray-600 korean-text">{event?.eventName}</h2>
          </div>

          {/* 탭 선택 */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 mb-8">
            <div className="border-b border-gray-100">
              <nav className="flex space-x-8 px-6 sm:px-8">
                <button
                  onClick={() => setSelectedView('ranking')}
                  className={`py-5 px-1 border-b-2 font-medium text-sm korean-text transition-colors ${
                    selectedView === 'ranking'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  승부 예측 순위
                </button>
                <button
                  onClick={() => setSelectedView('results')}
                  className={`py-5 px-1 border-b-2 font-medium text-sm korean-text transition-colors ${
                    selectedView === 'results'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  게임 결과
                </button>
              </nav>
            </div>
          </div>

          {selectedView === 'ranking' ? (
            /* 승부 예측 순위 */
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">승부 예측 순위</h3>
                <p className="text-gray-600 mt-1">예측 정확도에 따른 최종 순위입니다</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        순위
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        학생
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        LoL
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        PUBG
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        FIFA
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        총점
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ranking.map((user, index) => (
                      <tr key={user.studentId} className={index < 3 ? 'bg-yellow-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRankColor(user.rank)}`}>
                            {getRankIcon(user.rank)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.studentId}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          {user.gameScores.LOL || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          {user.gameScores.PUBG || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-900">
                          {user.gameScores.FIFA || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className="text-lg font-semibold text-blue-600">
                            {user.totalScore}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            /* 게임 결과 */
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

              {/* 게임 결과 */}
              <div className="bg-white rounded-lg shadow-md">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center">
                    {getGameIcon(selectedGame)} {selectedGame} 경기 결과
                  </h3>
                </div>
                
                <div className="p-6">
                  {gameResults[selectedGame] ? (
                    <div className="space-y-4">
                      {gameResults[selectedGame]!.map((result, index) => (
                        <div
                          key={result.teamId}
                          className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                            index === 0 ? 'border-yellow-300 bg-yellow-50' :
                            index === 1 ? 'border-gray-300 bg-gray-50' :
                            index === 2 ? 'border-orange-300 bg-orange-50' :
                            'border-gray-200 bg-white'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div className={`text-2xl ${
                              index === 0 ? 'text-yellow-600' :
                              index === 1 ? 'text-gray-600' :
                              index === 2 ? 'text-orange-600' :
                              'text-blue-600'
                            }`}>
                              {getRankIcon(result.rank)}
                            </div>
                            <div>
                              <div className="text-lg font-semibold text-gray-900">
                                {result.teamName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {result.rank}위
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-600">
                      아직 결과가 없습니다.
                    </div>
                  )}
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