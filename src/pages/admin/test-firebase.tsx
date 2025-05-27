import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "../../shared/contexts/AuthContext";
import {
  noticeService,
  eventService,
  rentalItemService,
} from "../../shared/services/firestore";
import { noticeData } from "../../shared/data/noticeData";
import { eventsData } from "../../shared/data/eventsData";
import { rentalData } from "../../shared/data/rentalData";

export default function TestFirebase() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 권한 확인 및 리다이렉트
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/admin/login");
    }
  }, [user, loading, isAdmin, router]);

  const addStatus = (message: string) => {
    setStatus((prev) => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] ${message}`,
    ]);
  };

  const clearStatus = () => {
    setStatus([]);
  };

  // Firebase 연결 테스트
  const testFirebaseConnection = async () => {
    setIsLoading(true);
    clearStatus();

    try {
      addStatus("🔍 Firebase 연결 테스트 시작...");

      // Firestore 읽기 테스트
      const notices = await noticeService.getAll();
      addStatus(`✅ Firestore 연결 성공 (공지사항 ${notices.length}개)`);

      const events = await eventService.getAll();
      addStatus(`✅ Firestore 연결 성공 (행사 ${events.length}개)`);

      const rentals = await rentalItemService.getAll();
      addStatus(`✅ Firestore 연결 성공 (대여물품 ${rentals.length}개)`);
    } catch (error: unknown) {
      console.error("Firebase 연결 테스트 실패:", error);
      addStatus(`❌ Firebase 연결 실패: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // 공지사항 마이그레이션
  const migrateNotices = async () => {
    setIsLoading(true);
    addStatus("📝 공지사항 마이그레이션 시작...");

    try {
      for (const notice of noticeData) {
        const firestoreNotice = {
          title: notice.title,
          category: notice.category,
          content: notice.content,
          preview: notice.preview,
          important: notice.important,
          views: notice.views,
        };

        const id = await noticeService.add(firestoreNotice);
        addStatus(
          `✅ 공지사항 "${notice.title}" 마이그레이션 완료 (ID: ${id})`
        );
      }

      addStatus("🎉 공지사항 마이그레이션 완료!");
    } catch (error) {
      addStatus(`❌ 공지사항 마이그레이션 실패: ${error}`);
      console.error("공지사항 마이그레이션 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 행사 마이그레이션
  const migrateEvents = async () => {
    setIsLoading(true);
    addStatus("🎭 행사 마이그레이션 시작...");

    try {
      for (const event of eventsData) {
        const firestoreEvent = {
          title: event.title,
          category: event.category,
          description: event.description,
          content: event.content || "",
          date: event.date,
          time: event.time,
          location: event.location,
          image: event.image,
          status: event.status,
          organizer: event.organizer || "",
          contact: event.contact || "",
          registrationRequired: event.registrationRequired || false,
          registrationDeadline: event.registrationDeadline || "",
          featured: event.featured || false,
          gradient: event.gradient || "",
        };

        const id = await eventService.add(firestoreEvent);
        addStatus(`✅ 행사 "${event.title}" 마이그레이션 완료 (ID: ${id})`);
      }

      addStatus("🎉 행사 마이그레이션 완료!");
    } catch (error) {
      addStatus(`❌ 행사 마이그레이션 실패: ${error}`);
      console.error("행사 마이그레이션 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 대여물품 마이그레이션
  const migrateRentals = async () => {
    setIsLoading(true);
    addStatus("📦 대여물품 마이그레이션 시작...");

    try {
      for (let i = 0; i < rentalData.length; i++) {
        const rental = rentalData[i];
        const firestoreRental = {
          name: rental.name,
          category: rental.category,
          description: rental.description,
          image: rental.image,
          condition: rental.condition,
          status: rental.available
            ? ("available" as const)
            : ("maintenance" as const),
          location: rental.location,
          contact: rental.contact,
          campus: "yangsan" as const,
          uniqueId: `RENTAL_${String(i + 1).padStart(3, "0")}`,
          totalRentCount: 0,
        };

        const id = await rentalItemService.add(firestoreRental);
        addStatus(`✅ 대여물품 "${rental.name}" 마이그레이션 완료 (ID: ${id})`);
      }

      addStatus("🎉 대여물품 마이그레이션 완료!");
    } catch (error) {
      addStatus(`❌ 대여물품 마이그레이션 실패: ${error}`);
      console.error("대여물품 마이그레이션 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 전체 마이그레이션
  const migrateAllData = async () => {
    setIsLoading(true);
    clearStatus();
    addStatus("🚀 전체 데이터 마이그레이션 시작...");

    try {
      await migrateNotices();
      await migrateEvents();
      await migrateRentals();
      addStatus("🎉 모든 데이터 마이그레이션 완료!");
    } catch (error) {
      addStatus(`💥 데이터 마이그레이션 중 오류 발생: ${error}`);
      console.error("데이터 마이그레이션 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 글로벌 함수로 등록 (콘솔에서 사용 가능)
  useEffect(() => {
    if (typeof window !== "undefined") {
      (
        window as unknown as {
          migrateData: {
            notices: () => Promise<void>;
            events: () => Promise<void>;
            rentals: () => Promise<void>;
            all: () => Promise<void>;
            test: () => Promise<void>;
          };
        }
      ).migrateData = {
        notices: migrateNotices,
        events: migrateEvents,
        rentals: migrateRentals,
        all: migrateAllData,
        test: testFirebaseConnection,
      };
    }
  }, [
    migrateAllData,
    migrateEvents,
    migrateNotices,
    migrateRentals,
    testFirebaseConnection,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Firebase 테스트 - PNU IBE</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Firebase 연결 테스트 & 데이터 마이그레이션
            </h1>

            {/* 컨트롤 버튼들 */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <button
                onClick={testFirebaseConnection}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                🔍 연결 테스트
              </button>

              <button
                onClick={migrateNotices}
                disabled={isLoading}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                📝 공지사항 마이그레이션
              </button>

              <button
                onClick={migrateEvents}
                disabled={isLoading}
                className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 disabled:opacity-50"
              >
                🎭 행사 마이그레이션
              </button>

              <button
                onClick={migrateRentals}
                disabled={isLoading}
                className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 disabled:opacity-50"
              >
                📦 대여물품 마이그레이션
              </button>

              <button
                onClick={migrateAllData}
                disabled={isLoading}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                🚀 전체 마이그레이션
              </button>

              <button
                onClick={clearStatus}
                disabled={isLoading}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 disabled:opacity-50"
              >
                🗑️ 로그 지우기
              </button>
            </div>

            {/* 상태 표시 */}
            <div className="bg-gray-100 rounded-lg p-4 h-96 overflow-y-auto">
              <h3 className="font-medium text-gray-900 mb-2">실행 로그:</h3>

              {status.length === 0 ? (
                <p className="text-gray-500">
                  로그가 없습니다. 버튼을 클릭하여 작업을 시작하세요.
                </p>
              ) : (
                <div className="space-y-1">
                  {status.map((msg, index) => (
                    <div
                      key={index}
                      className={`text-sm font-mono ${
                        msg.includes("❌") || msg.includes("💥")
                          ? "text-red-600"
                          : msg.includes("✅") || msg.includes("🎉")
                          ? "text-green-600"
                          : "text-gray-700"
                      }`}
                    >
                      {msg}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 브라우저 콘솔 사용법 */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">
                브라우저 콘솔에서 사용하기:
              </h3>
              <div className="text-sm text-blue-800 font-mono space-y-1">
                <div>
                  • <code>migrateData.test()</code> - Firebase 연결 테스트
                </div>
                <div>
                  • <code>migrateData.notices()</code> - 공지사항 마이그레이션
                </div>
                <div>
                  • <code>migrateData.events()</code> - 행사 마이그레이션
                </div>
                <div>
                  • <code>migrateData.rentals()</code> - 대여물품 마이그레이션
                </div>
                <div>
                  • <code>migrateData.all()</code> - 전체 마이그레이션
                </div>
              </div>
            </div>

            {/* 뒤로가기 버튼 */}
            <div className="mt-6">
              <button
                onClick={() => router.push("/admin/dashboard")}
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                ← 대시보드로 돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
