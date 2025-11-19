import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Header } from "../../widgets/Header";
import { Footer } from "../../widgets/Footer";
import { useESSportsAuth } from "../../shared/contexts/ESSportsAuthContext";

export default function ESportsLogin() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated, loading } = useESSportsAuth();
  const router = useRouter();

  // 이미 로그인되어 있으면 이전 페이지로 또는 esports 페이지로
  useEffect(() => {
    if (!loading && isAuthenticated) {
      const returnUrl = (router.query.returnUrl as string) || "/esports";
      router.push(returnUrl);
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(studentId, password);
      // 로그인 성공 시 이전 페이지로 또는 esports 페이지로
      const returnUrl = (router.query.returnUrl as string) || "/esports";
      router.push(returnUrl);
    } catch (error: unknown) {
      console.error("로그인 오류:", error);
      setError(
        error instanceof Error
          ? error.message
          : "로그인에 실패했습니다. 학번과 비밀번호를 확인해주세요."
      );
    } finally {
      setIsLoading(false);
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
        <title>로그인 | E-Sports | 부산대학교 정보의생명공학대학 학생회</title>
        <meta name="description" content="부산대학교 정보의생명공학대학 학생회 E-Sports 로그인" />
      </Head>

      <Header />

      <main className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/50 pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-10">
            {/* 헤더 */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-4">
                <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
                <span className="text-sm font-semibold text-primary korean-text">
                  학생 로그인
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold korean-text mb-2">
                <span className="bg-gradient-to-r from-dark to-gray-700 bg-clip-text text-transparent">
                  E-Sports{" "}
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    로그인
                  </span>
                </span>
              </h1>
              <p className="text-gray-600 korean-text text-sm">
                정보의생명공학대학 소속 학생만 이용 가능합니다
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg korean-text text-sm">
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="studentId"
                  className="block text-sm font-medium text-gray-700 mb-2 korean-text"
                >
                  학번
                </label>
                <input
                  id="studentId"
                  type="text"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all korean-text"
                  placeholder="학번을 입력하세요 (예: 202012345)"
                  pattern="^[0-9]{8,10}$"
                  title="8-10자리 숫자로 입력해주세요"
                  autoComplete="username"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2 korean-text"
                >
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all korean-text"
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                  minLength={4}
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:translate-y-0 korean-text"
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 korean-text">
                부산대학교 포털 시스템을 통해 인증됩니다
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
