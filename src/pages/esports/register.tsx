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

interface TeamMember {
  studentId: string;
  gameNickname: string;
}

export default function ESportsRegister() {
  const router = useRouter();
  const { eventId } = router.query;
  
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // 학생 인증 정보
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [grade, setGrade] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 팀 정보
  const [selectedGame, setSelectedGame] = useState<GameType>('LOL');
  const [teamName, setTeamName] = useState('');
  const [gameNickname, setGameNickname] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      // 추후 실제 API 연동
      setEvent({
        eventId: Number(eventId),
        eventName: '제1회 PNU E-Sports 대회',
        status: 'REGISTRATION_OPEN'
      });
    } catch (error) {
      console.error('이벤트 정보 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // 추후 실제 API 연동
      const authData = {
        studentId,
        name,
        department,
        grade
      };
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsAuthenticated(true);
      alert('인증이 완료되었습니다!');
    } catch (error) {
      console.error('인증 실패:', error);
      alert('인증에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const teamData = {
        eventId: Number(eventId),
        teamName,
        gameType: selectedGame,
        leaderGameNickname: gameNickname,
        profileImageUrl: profileImage,
        description,
        members: selectedGame === 'PUBG' ? members : []
      };
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('팀 등록이 완료되었습니다!');
      router.push('/esports');
    } catch (error) {
      console.error('팀 등록 실패:', error);
      alert('팀 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const addMember = () => {
    if (members.length < 3) {
      setMembers([...members, { studentId: '', gameNickname: '' }]);
    }
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: keyof TeamMember, value: string) => {
    const updatedMembers = [...members];
    updatedMembers[index][field] = value;
    setMembers(updatedMembers);
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
        <title>참가 신청 | E-Sports | 부산대학교 정보의생명공학대학 학생회</title>
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-6 sm:p-8 md:p-10">
            {/* 헤더 섹션 */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-4">
                <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
                <span className="text-sm font-semibold text-primary korean-text">
                  참가 신청
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold korean-text mb-2">
                <span className="bg-gradient-to-r from-dark to-gray-700 bg-clip-text text-transparent">
                  E-Sports 대회{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    참가 신청
                  </span>
                </span>
              </h1>
              <h2 className="text-lg text-gray-600 korean-text">{event?.eventName}</h2>
            </div>

            {!isAuthenticated ? (
              /* 학생 인증 단계 */
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">1. 학생 인증</h3>
                <form onSubmit={handleAuthenticate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        학번 *
                      </label>
                      <input
                        type="text"
                        value={studentId}
                        onChange={(e) => setStudentId(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        이름 *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        학과
                      </label>
                      <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        학년
                      </label>
                      <select
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">선택</option>
                        <option value="1">1학년</option>
                        <option value="2">2학년</option>
                        <option value="3">3학년</option>
                        <option value="4">4학년</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? '인증 중...' : '학생 인증'}
                  </button>
                </form>
              </div>
            ) : (
              /* 팀 등록 단계 */
              <div>
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-green-800">✓ 학생 인증이 완료되었습니다. ({name}, {studentId})</p>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">2. 팀 등록</h3>
                <form onSubmit={handleTeamSubmit} className="space-y-6">
                  {/* 게임 선택 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      참가 종목 *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: 'LOL', name: 'League of Legends', desc: '문도 피구 (개인전)' },
                        { value: 'PUBG', name: 'PUBG', desc: '스쿼드 (최대 4명)' },
                        { value: 'FIFA', name: 'FIFA Online 4', desc: '개인전' }
                      ].map((game) => (
                        <label
                          key={game.value}
                          className={`cursor-pointer border rounded-lg p-4 ${
                            selectedGame === game.value
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="gameType"
                            value={game.value}
                            checked={selectedGame === game.value}
                            onChange={(e) => setSelectedGame(e.target.value as GameType)}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <div className="font-semibold text-gray-900">{game.name}</div>
                            <div className="text-sm text-gray-600">{game.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 팀 기본 정보 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        팀명 *
                      </label>
                      <input
                        type="text"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        게임 닉네임 *
                      </label>
                      <input
                        type="text"
                        value={gameNickname}
                        onChange={(e) => setGameNickname(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  {/* 프로필 꾸미기 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      프로필 이미지 URL
                    </label>
                    <input
                      type="url"
                      value={profileImage}
                      onChange={(e) => setProfileImage(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      한줄 소개
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      maxLength={200}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="팀의 각오나 소개를 적어주세요 (200자 이내)"
                    />
                    <p className="text-sm text-gray-500 mt-1">{description.length}/200</p>
                  </div>

                  {/* PUBG 팀원 추가 */}
                  {selectedGame === 'PUBG' && (
                    <div>
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="text-lg font-medium text-gray-900">팀원 추가 (최대 3명)</h4>
                        <button
                          type="button"
                          onClick={addMember}
                          disabled={members.length >= 3}
                          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
                        >
                          팀원 추가
                        </button>
                      </div>
                      
                      {members.map((member, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <h5 className="font-medium text-gray-900">팀원 {index + 1}</h5>
                            <button
                              type="button"
                              onClick={() => removeMember(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              삭제
                            </button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                학번 *
                              </label>
                              <input
                                type="text"
                                value={member.studentId}
                                onChange={(e) => updateMember(index, 'studentId', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                게임 닉네임 *
                              </label>
                              <input
                                type="text"
                                value={member.gameNickname}
                                onChange={(e) => updateMember(index, 'gameNickname', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {submitting ? '등록 중...' : '팀 등록'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}