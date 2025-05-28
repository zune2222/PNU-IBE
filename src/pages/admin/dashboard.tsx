import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "../../shared/contexts/AuthContext";
import {
  noticeService,
  eventService,
  rentalApplicationService,
  userService,
  rentalItemService,
  lockboxPasswordService,
  FirestoreNotice,
  FirestoreEvent,
  FirestoreRentalApplication,
  FirestoreUser,
  FirestoreRentalItem,
  FirestoreLockboxPassword,
} from "../../shared/services/firestore";

// 컴포넌트 imports
import DashboardOverview from "./components/DashboardOverview";
import RentalManagement from "./components/RentalManagement";
import NoticeManagement from "./components/NoticeManagement";
import EventManagement from "./components/EventManagement";
import LockboxManagement from "./components/LockboxManagement";
import ItemManagement from "./components/ItemManagement";

// 타입 imports
import { DashboardStats, ActiveTab, PhotoModal } from "./types/dashboard";

export default function AdminDashboard() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [notices, setNotices] = useState<FirestoreNotice[]>([]);
  const [events, setEvents] = useState<FirestoreEvent[]>([]);
  const [rentalApplications, setRentalApplications] = useState<
    FirestoreRentalApplication[]
  >([]);
  const [rentalItems, setRentalItems] = useState<{
    [id: string]: FirestoreRentalItem;
  }>({});
  const [lockboxPasswords, setLockboxPasswords] = useState<
    FirestoreLockboxPassword[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // 실시간 통계 상태
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalApplications: 0,
    pendingApplications: 0,
    activeRentals: 0,
    overdueRentals: 0,
    totalItems: 0,
    availableItems: 0,
    popularItems: [],
    recentActivities: [],
  });

  // 사진 모달 상태
  const [photoModal, setPhotoModal] = useState<PhotoModal>({
    isOpen: false,
    imageUrl: "",
    title: "",
  });

  // 사진 모달 열기 함수
  const openPhotoModal = (imageUrl: string, title: string) => {
    setPhotoModal({
      isOpen: true,
      imageUrl,
      title,
    });
  };

  // 사진 모달 닫기 함수
  const closePhotoModal = () => {
    setPhotoModal({
      isOpen: false,
      imageUrl: "",
      title: "",
    });
  };

  // 권한 확인 및 리다이렉트
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push("/admin/login");
    }
  }, [user, loading, isAdmin, router]);

  // 데이터 로드
  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  // 실시간 데이터 업데이트 (30초마다)
  useEffect(() => {
    if (isAdmin && activeTab === "overview") {
      const interval = setInterval(loadData, 30000);
      return () => clearInterval(interval);
    }
  }, [isAdmin, activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [
        noticesData,
        eventsData,
        rentalApplicationsData,
        usersData,
        rentalItemsData,
        lockboxPasswordsData,
      ] = await Promise.all([
        noticeService.getAll(),
        eventService.getAll(),
        rentalApplicationService.getAllApplications(),
        userService.getAllUsers(),
        rentalItemService.getAll(),
        lockboxPasswordService.getAllPasswords(),
      ]);
      setNotices(noticesData);
      setEvents(eventsData);
      setRentalApplications(rentalApplicationsData);

      // 대여 물품 데이터를 객체로 변환
      const itemsMap: { [id: string]: FirestoreRentalItem } = {};
      rentalItemsData.forEach((item: FirestoreRentalItem) => {
        if (item.id) {
          itemsMap[item.id] = item;
        }
      });
      setRentalItems(itemsMap);

      // 대시보드 통계 계산
      calculateDashboardStats(
        rentalApplicationsData,
        rentalItemsData,
        usersData
      );

      setLockboxPasswords(lockboxPasswordsData);
    } catch (error) {
      console.error("데이터 로드 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDashboardStats = (
    applications: FirestoreRentalApplication[],
    items: FirestoreRentalItem[],
    usersData: FirestoreUser[]
  ) => {
    const now = new Date();

    // 기본 통계
    const totalUsers = usersData.length;
    const totalApplications = applications.length;

    // 셀프 서비스 시스템에서는 승인 대기가 없으므로 현재 대여 중인 물품 수로 변경
    const activeRentals = applications.filter(
      (app) => app.status === "rented"
    ).length;

    // 오늘 대여된 물품 수 (새로운 통계)
    const todayRentals = applications.filter((app) => {
      if (!app.createdAt) return false;
      const rentDate = app.createdAt.toDate();
      const today = new Date();
      return (
        rentDate.getDate() === today.getDate() &&
        rentDate.getMonth() === today.getMonth() &&
        rentDate.getFullYear() === today.getFullYear()
      );
    }).length;

    // 연체 계산
    const overdueRentals = applications.filter((app) => {
      if (app.status !== "rented") return false;
      const endDate = new Date(app.dueDate);
      return now > endDate;
    }).length;

    // 인기 물품 계산
    const itemCounts: { [itemId: string]: number } = {};
    applications.forEach((app) => {
      itemCounts[app.itemId] = (itemCounts[app.itemId] || 0) + 1;
    });

    const popularItems = Object.entries(itemCounts)
      .map(([itemId, count]) => {
        const item = items.find((i) => i.id === itemId);
        return { name: item?.name || "알 수 없음", count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // 최근 활동 생성 (셀프 서비스 시스템에 맞게 수정)
    const recentActivities = applications
      .sort(
        (a, b) =>
          (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0)
      )
      .slice(0, 10)
      .map((app) => {
        const item = items.find((i) => i.id === app.itemId);

        let type = "";
        let message = "";
        let status: "info" | "warning" | "error" | "success" = "info";

        switch (app.status) {
          case "rented":
            // 연체 여부 확인
            const dueDate = new Date(app.dueDate);
            const isOverdue = now > dueDate;

            if (isOverdue) {
              type = "연체 중";
              message = `${app.studentName}님의 ${
                item?.name || "물품"
              }이 연체 중입니다`;
              status = "error";
            } else {
              type = "대여 중";
              message = `${app.studentName}님이 ${
                item?.name || "물품"
              }을 대여 중입니다`;
              status = "info";
            }
            break;
          case "returned":
            type = "반납 완료";
            message = `${app.studentName}님의 ${
              item?.name || "물품"
            } 반납이 완료되었습니다`;
            status = "success";
            break;
          case "overdue":
            type = "연체 발생";
            message = `${app.studentName}님의 ${
              item?.name || "물품"
            }이 연체되었습니다`;
            status = "error";
            break;
          case "lost":
            type = "분실 신고";
            message = `${app.studentName}님의 ${
              item?.name || "물품"
            }이 분실되었습니다`;
            status = "error";
            break;
          case "damaged":
            type = "파손 신고";
            message = `${app.studentName}님의 ${
              item?.name || "물품"
            }이 파손되었습니다`;
            status = "warning";
            break;
          default:
            type = "기타";
            message = `${app.studentName}님의 활동`;
            status = "info";
        }

        return {
          type,
          message,
          time: app.createdAt?.toDate().toLocaleString() || "",
          status,
        };
      });

    setDashboardStats({
      totalUsers,
      totalApplications,
      pendingApplications: todayRentals, // 승인 대기 → 오늘 대여 수로 변경
      activeRentals,
      overdueRentals,
      totalItems: items.length,
      availableItems: items.filter((item) => item.status === "available")
        .length,
      popularItems,
      recentActivities,
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/admin/login");
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

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
        <title>어드민 대시보드 - PNU IBE</title>
        <style jsx global>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 sm:py-6 space-y-3 sm:space-y-0">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                어드민 대시보드
              </h1>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                <span className="text-xs sm:text-sm text-gray-600">
                  {user.email}님 환영합니다
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm hover:bg-red-700 w-full sm:w-auto"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                📊 대시보드 개요
              </button>
              <button
                onClick={() => setActiveTab("notices")}
                className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === "notices"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                공지사항 관리
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === "events"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                행사 관리
              </button>
              <button
                onClick={() => setActiveTab("rentals")}
                className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === "rentals"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                대여 관리
              </button>
              <button
                onClick={() => setActiveTab("lockboxes")}
                className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === "lockboxes"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                보관함 관리
              </button>
              <button
                onClick={() => setActiveTab("items")}
                className={`py-2 px-1 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                  activeTab === "items"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                📦 물품 관리
              </button>
            </nav>
          </div>

          {/* 대시보드 개요 */}
          {activeTab === "overview" && (
            <DashboardOverview
              dashboardStats={dashboardStats}
              rentalApplications={rentalApplications}
              setActiveTab={setActiveTab}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              loadData={loadData}
            />
          )}

          {/* 공지사항 관리 */}
          {activeTab === "notices" && (
            <NoticeManagement
              notices={notices}
              isLoading={isLoading}
              loadData={loadData}
            />
          )}

          {/* 대여 관리 탭 */}
          {activeTab === "rentals" && (
            <RentalManagement
              rentalApplications={rentalApplications}
              rentalItems={rentalItems}
              isLoading={isLoading}
              loadData={loadData}
              openPhotoModal={openPhotoModal}
            />
          )}

          {/* 행사 관리 - 기존 코드 유지 */}
          {activeTab === "events" && (
            <EventManagement
              events={events}
              isLoading={isLoading}
              loadData={loadData}
            />
          )}

          {/* 보관함 관리 - 기존 코드 유지 */}
          {activeTab === "lockboxes" && (
            <LockboxManagement
              lockboxPasswords={lockboxPasswords}
              isLoading={isLoading}
              loadData={loadData}
              userEmail={user?.email || ""}
            />
          )}

          {/* 물품 관리 - 기존 코드 유지 */}
          {activeTab === "items" && (
            <ItemManagement
              rentalItems={rentalItems}
              isLoading={isLoading}
              loadData={loadData}
            />
          )}
        </div>
      </div>

      {/* 사진 모달 */}
      {photoModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full w-full">
            <button
              onClick={closePhotoModal}
              className="absolute top-2 right-2 z-10 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 transition-colors"
            >
              <svg
                className="w-4 h-4 sm:w-6 sm:h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="bg-white rounded-lg overflow-hidden max-h-full">
              <div className="p-3 sm:p-4 border-b">
                <h3 className="text-sm sm:text-lg font-medium text-gray-900">
                  {photoModal.title}
                </h3>
              </div>
              <div className="p-3 sm:p-4 max-h-[70vh] overflow-auto">
                <img
                  src={photoModal.imageUrl}
                  alt={photoModal.title}
                  className="max-w-full max-h-full object-contain mx-auto"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
