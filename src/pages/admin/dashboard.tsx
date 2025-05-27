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
import { storageService } from "../../shared/services/storage";
import { discordService } from "../../shared/services/discordService";
import { penaltySystem } from "../../shared/services/penaltySystem";

export default function AdminDashboard() {
  const { user, loading, signOut, isAdmin } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<
    "overview" | "notices" | "events" | "rentals" | "lockboxes" | "items"
  >("overview");
  const [notices, setNotices] = useState<FirestoreNotice[]>([]);
  const [events, setEvents] = useState<FirestoreEvent[]>([]);
  const [rentalApplications, setRentalApplications] = useState<
    FirestoreRentalApplication[]
  >([]);
  const [users, setUsers] = useState<{ [uid: string]: FirestoreUser }>({});
  const [rentalItems, setRentalItems] = useState<{
    [id: string]: FirestoreRentalItem;
  }>({});
  const [lockboxPasswords, setLockboxPasswords] = useState<
    FirestoreLockboxPassword[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // 실시간 통계 상태
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    totalApplications: 0,
    pendingApplications: 0,
    activeRentals: 0,
    overdueRentals: 0,
    totalItems: 0,
    availableItems: 0,
    popularItems: [] as { name: string; count: number }[],
    recentActivities: [] as {
      type: string;
      message: string;
      time: string;
      status: "info" | "warning" | "error" | "success";
    }[],
  });

  // 공지사항 폼 상태
  const [noticeForm, setNoticeForm] = useState({
    id: "",
    title: "",
    category: "",
    content: "",
    preview: "",
    important: false,
  });

  // 행사 폼 상태
  const [eventForm, setEventForm] = useState({
    id: "",
    title: "",
    category: "",
    description: "",
    content: "",
    date: "",
    time: "",
    location: "",
    image: "",
    status: "upcoming" as "upcoming" | "ongoing" | "completed",
    organizer: "",
    contact: "",
    registrationRequired: false,
    registrationDeadline: "",
    featured: false,
  });

  // 보관함 비밀번호 폼 상태
  const [lockboxForm, setLockboxForm] = useState({
    campus: "yangsan" as "yangsan" | "jangjeom",
    location: "",
    newPassword: "",
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  // 물품 관리 폼 상태
  const [itemForm, setItemForm] = useState({
    id: "",
    name: "",
    category: "",
    description: "",
    image: "",
    condition: "양호" as string,
    location: "",
    contact: "",
    campus: "yangsan" as "yangsan" | "jangjeom",
    uniqueId: "",
    status: "available" as
      | "available"
      | "rented"
      | "maintenance"
      | "lost"
      | "damaged",
  });

  const [selectedItemImage, setSelectedItemImage] = useState<File | null>(null);
  const [itemUploadProgress, setItemUploadProgress] = useState(0);
  const [isEditingItem, setIsEditingItem] = useState(false);

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
      setLockboxPasswords(lockboxPasswordsData);

      // 사용자 데이터를 객체로 변환
      const usersMap: { [uid: string]: FirestoreUser } = {};
      usersData.forEach((user: FirestoreUser) => {
        usersMap[user.uid] = user;
      });
      setUsers(usersMap);

      // 대여 물품 데이터를 객체로 변환
      const itemsMap: { [id: string]: FirestoreRentalItem } = {};
      rentalItemsData.forEach((item: FirestoreRentalItem) => {
        if (item.id) {
          itemsMap[item.id] = item;
        }
      });
      setRentalItems(itemsMap);

      // 대시보드 통계 계산
      calculateDashboardStats(rentalApplicationsData, rentalItemsData);
    } catch (error) {
      console.error("데이터 로드 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDashboardStats = (
    applications: FirestoreRentalApplication[],
    items: FirestoreRentalItem[]
  ) => {
    const now = new Date();

    // 기본 통계
    const totalUsers = Object.values(users).length;
    const totalApplications = applications.length;
    const pendingApplications = applications.filter(
      (app) => app.status === "rented"
    ).length;
    const activeRentals = applications.filter(
      (app) => app.status === "rented"
    ).length;

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

    // 최근 활동 생성
    const recentActivities = applications
      .sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis())
      .slice(0, 10)
      .map((app) => {
        const item = items.find((i) => i.id === app.itemId);

        let type = "";
        let message = "";
        let status: "info" | "warning" | "error" | "success" = "info";

        switch (app.status) {
          case "rented":
            type = "대여 시작";
            message = `${app.studentName}님이 ${
              item?.name || "물품"
            }을 대여했습니다`;
            status = "info";
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
      pendingApplications,
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

  // 공지사항 관련 함수들
  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditing && noticeForm.id) {
        await noticeService.update(noticeForm.id, {
          title: noticeForm.title,
          category: noticeForm.category,
          content: noticeForm.content,
          preview: noticeForm.preview,
          important: noticeForm.important,
        });
        alert("공지사항이 수정되었습니다!");
      } else {
        await noticeService.add({
          title: noticeForm.title,
          category: noticeForm.category,
          content: noticeForm.content,
          preview: noticeForm.preview,
          important: noticeForm.important,
          views: 0,
        });
        alert("공지사항이 추가되었습니다!");
      }

      resetNoticeForm();
      loadData();
    } catch (error) {
      console.error("공지사항 저장 오류:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const editNotice = (notice: FirestoreNotice) => {
    setNoticeForm({
      id: notice.id || "",
      title: notice.title,
      category: notice.category,
      content: notice.content,
      preview: notice.preview,
      important: notice.important,
    });
    setIsEditing(true);
  };

  const deleteNotice = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await noticeService.delete(id);
      alert("공지사항이 삭제되었습니다!");
      loadData();
    } catch (error) {
      console.error("공지사항 삭제 오류:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  const resetNoticeForm = () => {
    setNoticeForm({
      id: "",
      title: "",
      category: "",
      content: "",
      preview: "",
      important: false,
    });
    setIsEditing(false);
  };

  // 행사 관련 함수들
  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrl = eventForm.image;

      // 새 이미지가 선택된 경우 업로드
      if (selectedImage) {
        setUploadProgress(0);
        const uploadResult = await storageService.uploadFileWithProgress(
          selectedImage,
          "events/images",
          undefined,
          (progress) => setUploadProgress(progress.progress)
        );
        imageUrl = uploadResult.url;
      }

      const eventData = {
        title: eventForm.title,
        category: eventForm.category,
        description: eventForm.description,
        content: eventForm.content,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.location,
        image: imageUrl,
        status: eventForm.status,
        organizer: eventForm.organizer,
        contact: eventForm.contact,
        registrationRequired: eventForm.registrationRequired,
        registrationDeadline: eventForm.registrationDeadline,
        featured: eventForm.featured,
      };

      if (isEditing && eventForm.id) {
        await eventService.update(eventForm.id, eventData);
        alert("행사 정보가 수정되었습니다!");
      } else {
        await eventService.add(eventData);
        alert("행사가 추가되었습니다!");
      }

      resetEventForm();
      loadData();
    } catch (error) {
      console.error("행사 저장 오류:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const editEvent = (event: FirestoreEvent) => {
    setEventForm({
      id: event.id || "",
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
    });
    setIsEditing(true);
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await eventService.delete(id);
      alert("행사가 삭제되었습니다!");
      loadData();
    } catch (error) {
      console.error("행사 삭제 오류:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  const resetEventForm = () => {
    setEventForm({
      id: "",
      title: "",
      category: "",
      description: "",
      content: "",
      date: "",
      time: "",
      location: "",
      image: "",
      status: "upcoming",
      organizer: "",
      contact: "",
      registrationRequired: false,
      registrationDeadline: "",
      featured: false,
    });
    setSelectedImage(null);
    setIsEditing(false);
  };

  // 보관함 비밀번호 관련 함수들
  const handleLockboxPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lockboxForm.location || !lockboxForm.newPassword) {
      alert("위치와 새 비밀번호를 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      await lockboxPasswordService.updatePassword(
        lockboxForm.campus,
        lockboxForm.location,
        lockboxForm.newPassword,
        user?.email || "관리자"
      );
      alert("보관함 비밀번호가 변경되었습니다.");
      setLockboxForm({
        campus: "yangsan",
        location: "",
        newPassword: "",
      });
      loadData();
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      alert("비밀번호 변경에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 물품 관리 함수들
  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemForm.name || !itemForm.category || !itemForm.description) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      let imageUrl = itemForm.image;

      // 이미지 업로드
      if (selectedItemImage) {
        const uploadResult = await storageService.uploadRentalImage(
          selectedItemImage
        );
        imageUrl = uploadResult.url;
        setItemUploadProgress(100);
      }

      if (isEditingItem && itemForm.id) {
        // 물품 수정
        await rentalItemService.update(itemForm.id, {
          name: itemForm.name,
          category: itemForm.category,
          description: itemForm.description,
          image: imageUrl,
          condition: itemForm.condition,
          location: itemForm.location,
          contact: itemForm.contact,
          campus: itemForm.campus,
          uniqueId: itemForm.uniqueId,
          status: itemForm.status,
        });
        alert("물품이 수정되었습니다.");
      } else {
        // 물품 추가
        await rentalItemService.add({
          name: itemForm.name,
          category: itemForm.category,
          description: itemForm.description,
          image: imageUrl,
          condition: itemForm.condition,
          location: itemForm.location,
          contact: itemForm.contact,
          campus: itemForm.campus,
          uniqueId: itemForm.uniqueId,
          status: itemForm.status,
          totalRentCount: 0,
        });
        alert("물품이 추가되었습니다.");
      }

      resetItemForm();
      loadData();
    } catch (error) {
      console.error("물품 처리 오류:", error);
      alert("물품 처리에 실패했습니다.");
    } finally {
      setIsLoading(false);
      setItemUploadProgress(0);
    }
  };

  const editItem = (item: FirestoreRentalItem) => {
    setItemForm({
      id: item.id || "",
      name: item.name,
      category: item.category,
      description: item.description,
      image: item.image,
      condition: item.condition as "excellent" | "good" | "fair" | "poor",
      location: item.location,
      contact: item.contact,
      campus: item.campus,
      uniqueId: item.uniqueId,
      status: item.status,
    });
    setIsEditingItem(true);
    setSelectedItemImage(null);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("정말로 이 물품을 삭제하시겠습니까?")) return;

    setIsLoading(true);
    try {
      await rentalItemService.delete(id);
      alert("물품이 삭제되었습니다.");
      loadData();
    } catch (error) {
      console.error("물품 삭제 오류:", error);
      alert("물품 삭제에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetItemForm = () => {
    setItemForm({
      id: "",
      name: "",
      category: "",
      description: "",
      image: "",
      condition: "양호",
      location: "",
      contact: "",
      campus: "yangsan",
      uniqueId: "",
      status: "available",
    });
    setIsEditingItem(false);
    setSelectedItemImage(null);
    setItemUploadProgress(0);
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
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-2xl font-bold text-gray-900">
                어드민 대시보드
              </h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {user.email}님 환영합니다
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "overview"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                📊 대시보드 개요
              </button>
              <button
                onClick={() => setActiveTab("notices")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "notices"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                공지사항 관리
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "events"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                행사 관리
              </button>
              <button
                onClick={() => setActiveTab("rentals")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "rentals"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                대여 관리
              </button>
              <button
                onClick={() => setActiveTab("lockboxes")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "lockboxes"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                보관함 관리
              </button>
              <button
                onClick={() => setActiveTab("items")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
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
            <div className="space-y-6">
              {/* 주요 통계 카드 */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          전체 사용자
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {dashboardStats.totalUsers}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          총 신청
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {dashboardStats.totalApplications}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-yellow-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          승인 대기
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {dashboardStats.pendingApplications}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-purple-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          대여 중
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {
                            rentalApplications.filter(
                              (app) => app.status === "rented"
                            ).length
                          }
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          연체
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {dashboardStats.overdueRentals}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-orange-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          전체 물품
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {dashboardStats.totalItems}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-teal-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          대여 가능
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {dashboardStats.availableItems}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* 2열 레이아웃: 인기 물품 + 최근 활동 */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 인기 물품 */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                      📈 인기 대여 물품
                    </h3>
                  </div>
                  <div className="p-6">
                    {dashboardStats.popularItems.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        데이터가 없습니다
                      </p>
                    ) : (
                      <div className="space-y-3">
                        {dashboardStats.popularItems.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center">
                              <span
                                className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium text-white ${
                                  index === 0
                                    ? "bg-yellow-500"
                                    : index === 1
                                    ? "bg-gray-400"
                                    : index === 2
                                    ? "bg-orange-400"
                                    : "bg-blue-500"
                                }`}
                              >
                                {index + 1}
                              </span>
                              <span className="ml-3 text-sm font-medium text-gray-900">
                                {item.name}
                              </span>
                            </div>
                            <span className="text-sm text-gray-500">
                              {item.count}회
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 알림 센터 (최근 활동) */}
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">
                      🔔 알림 센터
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      최근 30초마다 자동 업데이트
                    </p>
                  </div>
                  <div className="p-6">
                    {dashboardStats.recentActivities.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">
                        최근 활동이 없습니다
                      </p>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {dashboardStats.recentActivities.map(
                          (activity, index) => (
                            <div
                              key={index}
                              className="flex items-start space-x-3"
                            >
                              <div
                                className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                                  activity.status === "error"
                                    ? "bg-red-500"
                                    : activity.status === "warning"
                                    ? "bg-yellow-500"
                                    : activity.status === "success"
                                    ? "bg-green-500"
                                    : "bg-blue-500"
                                }`}
                              ></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">
                                  {activity.type}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {activity.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {activity.time}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 빠른 액션 버튼 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  ⚡ 빠른 액션
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <button
                    onClick={() => setActiveTab("rentals")}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg
                      className="h-5 w-5 mr-2 text-yellow-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    승인 대기 처리
                  </button>
                  <button
                    onClick={() => setActiveTab("lockboxes")}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg
                      className="h-5 w-5 mr-2 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                      />
                    </svg>
                    보관함 관리
                  </button>
                  <button
                    onClick={() => setActiveTab("notices")}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg
                      className="h-5 w-5 mr-2 text-green-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
                      />
                    </svg>
                    공지사항 작성
                  </button>
                  <button
                    onClick={() => setActiveTab("items")}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg
                      className="h-5 w-5 mr-2 text-orange-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                      />
                    </svg>
                    물품 관리
                  </button>
                  <button
                    onClick={() => window.open("/rental-status", "_blank")}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    <svg
                      className="h-5 w-5 mr-2 text-purple-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    현황 조회
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        const success = await discordService.sendTestMessage();
                        if (success) {
                          alert("Discord 테스트 메시지가 전송되었습니다!");
                        } else {
                          alert(
                            "Discord 메시지 전송에 실패했습니다. Webhook URL을 확인해주세요."
                          );
                        }
                      } catch (error) {
                        console.error("Discord 테스트 오류:", error);
                        alert("Discord 테스트 중 오류가 발생했습니다.");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <svg
                      className="h-5 w-5 mr-2 text-indigo-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                    Discord 테스트
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        setIsLoading(true);
                        const result =
                          await penaltySystem.processOverdueItems();
                        alert(
                          `벌점 시스템 실행 완료!\n` +
                            `처리된 항목: ${result.totalProcessed}개\n` +
                            `새로운 연체: ${result.newOverdueItems.length}개\n` +
                            `벌점 부과: ${result.penaltiesApplied.length}건\n` +
                            `알림 전송: ${result.notificationsSent}건\n` +
                            `오류: ${result.errors.length}건`
                        );
                        if (result.errors.length > 0) {
                          console.error("벌점 시스템 오류들:", result.errors);
                        }
                        // 데이터 새로고침
                        loadData();
                      } catch (error) {
                        console.error("벌점 시스템 실행 오류:", error);
                        alert("벌점 시스템 실행 중 오류가 발생했습니다.");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    disabled={isLoading}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <svg
                      className="h-5 w-5 mr-2 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                    벌점 시스템 실행
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 공지사항 관리 */}
          {activeTab === "notices" && (
            <div className="mt-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* 공지사항 폼 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium mb-4">
                    {isEditing ? "공지사항 수정" : "새 공지사항 작성"}
                  </h2>

                  <form onSubmit={handleNoticeSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        제목
                      </label>
                      <input
                        type="text"
                        required
                        value={noticeForm.title}
                        onChange={(e) =>
                          setNoticeForm({
                            ...noticeForm,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        카테고리
                      </label>
                      <select
                        required
                        value={noticeForm.category}
                        onChange={(e) =>
                          setNoticeForm({
                            ...noticeForm,
                            category: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">카테고리 선택</option>
                        <option value="일반">일반</option>
                        <option value="학생회">학생회</option>
                        <option value="행사">행사</option>
                        <option value="학사">학사</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        미리보기
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={noticeForm.preview}
                        onChange={(e) =>
                          setNoticeForm({
                            ...noticeForm,
                            preview: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="공지사항 미리보기 텍스트"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        내용
                      </label>
                      <textarea
                        required
                        rows={8}
                        value={noticeForm.content}
                        onChange={(e) =>
                          setNoticeForm({
                            ...noticeForm,
                            content: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="공지사항 내용 (HTML 태그 사용 가능)"
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="important"
                        checked={noticeForm.important}
                        onChange={(e) =>
                          setNoticeForm({
                            ...noticeForm,
                            important: e.target.checked,
                          })
                        }
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label
                        htmlFor="important"
                        className="ml-2 block text-sm text-gray-900"
                      >
                        중요 공지사항
                      </label>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isLoading ? "저장 중..." : isEditing ? "수정" : "추가"}
                      </button>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={resetNoticeForm}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          취소
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* 공지사항 목록 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium mb-4">공지사항 목록</h2>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {notices.map((notice) => (
                      <div
                        key={notice.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {notice.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {notice.category}
                            </p>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {notice.preview}
                            </p>
                            {notice.important && (
                              <span className="inline-block mt-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                                중요
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => editNotice(notice)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => deleteNotice(notice.id!)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 대여 관리 탭 */}
          {activeTab === "rentals" && (
            <div className="space-y-6">
              {/* 대여 현황 관리 */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">
                    대여 현황 관리
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    현재 대여 중인 물품과 반납 처리를 관리합니다
                  </p>
                </div>

                {/* 필터 및 검색 */}
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <div className="flex flex-wrap gap-2">
                    {["rented", "returned", "overdue", "lost", "damaged"].map(
                      (status) => (
                        <button
                          key={status}
                          className={`px-3 py-1 text-xs rounded-full border ${
                            status === "rented"
                              ? "bg-blue-100 text-blue-800 border-blue-200"
                              : status === "returned"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : status === "overdue"
                              ? "bg-red-100 text-red-800 border-red-200"
                              : status === "lost"
                              ? "bg-gray-100 text-gray-800 border-gray-200"
                              : "bg-orange-100 text-orange-800 border-orange-200"
                          }`}
                        >
                          {status === "rented"
                            ? "대여중"
                            : status === "returned"
                            ? "반납완료"
                            : status === "overdue"
                            ? "연체"
                            : status === "lost"
                            ? "분실"
                            : "파손"}
                          (
                          {
                            rentalApplications.filter(
                              (app) => app.status === status
                            ).length
                          }
                          )
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* 대여 목록 */}
                <div className="divide-y divide-gray-200">
                  {isLoading ? (
                    <div className="p-6 text-center text-gray-500">
                      데이터를 불러오는 중...
                    </div>
                  ) : rentalApplications.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                      대여 기록이 없습니다.
                    </div>
                  ) : (
                    rentalApplications.map((application) => {
                      const item = rentalItems[application.itemId];

                      return (
                        <div key={application.id} className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <span
                                  className={`px-2 py-1 text-xs rounded-full ${
                                    application.status === "rented"
                                      ? "bg-blue-100 text-blue-800"
                                      : application.status === "returned"
                                      ? "bg-green-100 text-green-800"
                                      : application.status === "overdue"
                                      ? "bg-red-100 text-red-800"
                                      : application.status === "lost"
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-orange-100 text-orange-800"
                                  }`}
                                >
                                  {application.status === "rented"
                                    ? "대여중"
                                    : application.status === "returned"
                                    ? "반납완료"
                                    : application.status === "overdue"
                                    ? "연체"
                                    : application.status === "lost"
                                    ? "분실"
                                    : "파손"}
                                </span>
                                <h3 className="text-sm font-medium text-gray-900">
                                  {item?.name || "물품 정보 없음"}
                                </h3>
                                <span className="text-xs text-gray-500">
                                  #{application.itemUniqueId}
                                </span>
                              </div>

                              <div className="mt-2 text-sm text-gray-600">
                                <p>
                                  <strong>대여자:</strong>{" "}
                                  {application.studentName} (
                                  {application.studentId})
                                </p>
                                <p>
                                  <strong>휴대폰:</strong>{" "}
                                  {application.phoneNumber}
                                </p>
                                <p>
                                  <strong>대여일:</strong>{" "}
                                  {application.rentDate}
                                </p>
                                <p>
                                  <strong>반납 예정일:</strong>{" "}
                                  {application.dueDate}
                                </p>
                                <p>
                                  <strong>대여 목적:</strong>{" "}
                                  {application.purpose}
                                </p>
                                {application.actualReturnDate && (
                                  <p>
                                    <strong>실제 반납일:</strong>{" "}
                                    {application.actualReturnDate}
                                  </p>
                                )}
                                {application.overdueDays &&
                                  application.overdueDays > 0 && (
                                    <p className="text-red-600">
                                      <strong>연체일:</strong>{" "}
                                      {application.overdueDays}일
                                    </p>
                                  )}
                                {(application.lostReason ||
                                  application.damageReason) && (
                                  <p className="text-red-600">
                                    <strong>
                                      {application.status === "lost"
                                        ? "분실"
                                        : "파손"}{" "}
                                      사유:
                                    </strong>{" "}
                                    {application.lostReason ||
                                      application.damageReason}
                                  </p>
                                )}
                              </div>

                              <div className="mt-3 text-xs text-gray-400">
                                대여 시작:{" "}
                                {application.createdAt
                                  ?.toDate()
                                  .toLocaleString()}
                              </div>
                            </div>

                            <div className="flex space-x-2 ml-4">
                              {application.status === "rented" && (
                                <>
                                  <button
                                    onClick={async () => {
                                      try {
                                        await rentalApplicationService.processReturn(
                                          application.id!,
                                          {
                                            returnItemConditionPhotoUrl: "", // TODO: 반납 사진 처리
                                            returnLockboxSecuredPhotoUrl: "",
                                          }
                                        );
                                        loadData();
                                        alert("반납 처리가 완료되었습니다.");
                                      } catch (error) {
                                        console.error("반납 처리 오류:", error);
                                        alert(
                                          "반납 처리 중 오류가 발생했습니다."
                                        );
                                      }
                                    }}
                                    className="bg-green-600 text-white px-3 py-1 text-xs rounded hover:bg-green-700"
                                  >
                                    반납 처리
                                  </button>
                                  <button
                                    onClick={async () => {
                                      const reason =
                                        prompt("분실 사유를 입력해주세요:");
                                      if (reason) {
                                        try {
                                          await rentalApplicationService.markAsLost(
                                            application.id!,
                                            reason
                                          );
                                          loadData();
                                          alert("분실 처리가 완료되었습니다.");
                                        } catch (error) {
                                          console.error(
                                            "분실 처리 오류:",
                                            error
                                          );
                                          alert(
                                            "분실 처리 중 오류가 발생했습니다."
                                          );
                                        }
                                      }
                                    }}
                                    className="bg-red-600 text-white px-3 py-1 text-xs rounded hover:bg-red-700"
                                  >
                                    분실 처리
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* 대여 통계 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-blue-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          현재 대여 중
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {
                            rentalApplications.filter(
                              (app) => app.status === "rented"
                            ).length
                          }
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-green-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          반납 완료
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {
                            rentalApplications.filter(
                              (app) => app.status === "returned"
                            ).length
                          }
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-8 w-8 text-red-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                        />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          연체
                        </dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {
                            rentalApplications.filter(
                              (app) => app.status === "overdue"
                            ).length
                          }
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 행사 관리 */}
          {activeTab === "events" && (
            <div className="mt-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* 행사 폼 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium mb-4">
                    {isEditing ? "행사 수정" : "새 행사 등록"}
                  </h2>

                  <form onSubmit={handleEventSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        제목
                      </label>
                      <input
                        type="text"
                        required
                        value={eventForm.title}
                        onChange={(e) =>
                          setEventForm({ ...eventForm, title: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          카테고리
                        </label>
                        <select
                          required
                          value={eventForm.category}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">카테고리 선택</option>
                          <option value="학술">학술</option>
                          <option value="체육">체육</option>
                          <option value="문화">문화</option>
                          <option value="취업">취업</option>
                          <option value="기타">기타</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          상태
                        </label>
                        <select
                          required
                          value={eventForm.status}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              status: e.target.value as
                                | "upcoming"
                                | "ongoing"
                                | "completed",
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="upcoming">예정</option>
                          <option value="ongoing">진행중</option>
                          <option value="completed">완료</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          날짜
                        </label>
                        <input
                          type="date"
                          required
                          value={eventForm.date}
                          onChange={(e) =>
                            setEventForm({ ...eventForm, date: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          시간
                        </label>
                        <input
                          type="time"
                          required
                          value={eventForm.time}
                          onChange={(e) =>
                            setEventForm({ ...eventForm, time: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        장소
                      </label>
                      <input
                        type="text"
                        required
                        value={eventForm.location}
                        onChange={(e) =>
                          setEventForm({
                            ...eventForm,
                            location: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        설명
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={eventForm.description}
                        onChange={(e) =>
                          setEventForm({
                            ...eventForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        콘텐츠 (HTML 가능)
                      </label>
                      <textarea
                        rows={10}
                        value={eventForm.content}
                        onChange={(e) =>
                          setEventForm({
                            ...eventForm,
                            content: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="행사 상세 내용 (HTML 태그 사용 가능)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        이미지
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setSelectedImage(e.target.files?.[0] || null)
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {uploadProgress > 0 && (
                        <div className="mt-2">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {uploadProgress.toFixed(1)}%
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          주최자
                        </label>
                        <input
                          type="text"
                          value={eventForm.organizer}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              organizer: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          연락처
                        </label>
                        <input
                          type="text"
                          value={eventForm.contact}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              contact: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="registrationRequired"
                          checked={eventForm.registrationRequired}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              registrationRequired: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="registrationRequired"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          사전 신청 필요
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="featured"
                          checked={eventForm.featured}
                          onChange={(e) =>
                            setEventForm({
                              ...eventForm,
                              featured: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor="featured"
                          className="ml-2 block text-sm text-gray-900"
                        >
                          추천 행사
                        </label>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isLoading ? "저장 중..." : isEditing ? "수정" : "추가"}
                      </button>
                      {isEditing && (
                        <button
                          type="button"
                          onClick={resetEventForm}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          취소
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* 행사 목록 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium mb-4">행사 목록</h2>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {events.map((event) => (
                      <div
                        key={event.id}
                        className="border border-gray-200 rounded-lg p-4"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">
                              {event.title}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {event.category} • {event.date} {event.time}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {event.location}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <span
                                className={`inline-block px-2 py-1 text-xs rounded ${
                                  event.status === "upcoming"
                                    ? "bg-blue-100 text-blue-800"
                                    : event.status === "ongoing"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {event.status === "upcoming"
                                  ? "예정"
                                  : event.status === "ongoing"
                                  ? "진행중"
                                  : "완료"}
                              </span>
                              {event.featured && (
                                <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                                  추천
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => editEvent(event)}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              수정
                            </button>
                            <button
                              onClick={() => deleteEvent(event.id!)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 보관함 관리 */}
          {activeTab === "lockboxes" && (
            <div className="mt-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* 보관함 비밀번호 폼 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium mb-4">
                    보관함 비밀번호 설정
                  </h2>

                  <form
                    onSubmit={handleLockboxPasswordSubmit}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        캠퍼스
                      </label>
                      <select
                        value={lockboxForm.campus}
                        onChange={(e) =>
                          setLockboxForm({
                            ...lockboxForm,
                            campus: e.target.value as "yangsan" | "jangjeom",
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="yangsan">양산캠퍼스</option>
                        <option value="jangjeom">장전캠퍼스</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        위치
                      </label>
                      <input
                        type="text"
                        value={lockboxForm.location}
                        onChange={(e) =>
                          setLockboxForm({
                            ...lockboxForm,
                            location: e.target.value,
                          })
                        }
                        placeholder="예: 정보대학 학생회실"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        새 비밀번호
                      </label>
                      <input
                        type="password"
                        value={lockboxForm.newPassword}
                        onChange={(e) =>
                          setLockboxForm({
                            ...lockboxForm,
                            newPassword: e.target.value,
                          })
                        }
                        placeholder="숫자 4-6자리"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isLoading ? "저장 중..." : "비밀번호 변경"}
                      </button>
                    </div>
                  </form>
                </div>

                {/* 현재 보관함 비밀번호 목록 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium mb-4">
                    현재 보관함 비밀번호
                  </h2>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {lockboxPasswords.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        설정된 보관함 비밀번호가 없습니다.
                      </div>
                    ) : (
                      lockboxPasswords.map((lockbox) => (
                        <div
                          key={lockbox.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900">
                                {lockbox.campus === "yangsan"
                                  ? "양산캠퍼스"
                                  : "장전캠퍼스"}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                위치: {lockbox.location}
                              </p>
                              <p className="text-lg font-mono text-blue-600 mt-2">
                                비밀번호: {lockbox.currentPassword}
                              </p>
                              <div className="text-xs text-gray-400 mt-2">
                                <p>
                                  변경일:{" "}
                                  {lockbox.lastChangedAt
                                    ?.toDate()
                                    .toLocaleString()}
                                </p>
                                <p>변경자: {lockbox.lastChangedBy}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 물품 관리 */}
          {activeTab === "items" && (
            <div className="mt-6">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* 물품 추가/수정 폼 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium mb-4">
                    {isEditingItem ? "물품 수정" : "물품 추가"}
                  </h2>

                  <form onSubmit={handleItemSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          물품명 *
                        </label>
                        <input
                          type="text"
                          value={itemForm.name}
                          onChange={(e) =>
                            setItemForm({ ...itemForm, name: e.target.value })
                          }
                          placeholder="우산, 충전기 등"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          카테고리 *
                        </label>
                        <select
                          value={itemForm.category}
                          onChange={(e) =>
                            setItemForm({
                              ...itemForm,
                              category: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">카테고리 선택</option>
                          <option value="우산">우산</option>
                          <option value="충전기">충전기</option>
                          <option value="C타입선">C타입선</option>
                          <option value="8핀선">8핀선</option>
                          <option value="HDMI케이블">HDMI케이블</option>
                          <option value="멀티허브">멀티허브</option>
                          <option value="기타">기타</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        설명 *
                      </label>
                      <textarea
                        value={itemForm.description}
                        onChange={(e) =>
                          setItemForm({
                            ...itemForm,
                            description: e.target.value,
                          })
                        }
                        placeholder="물품에 대한 상세 설명을 입력하세요"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          캠퍼스
                        </label>
                        <select
                          value={itemForm.campus}
                          onChange={(e) =>
                            setItemForm({
                              ...itemForm,
                              campus: e.target.value as "yangsan" | "jangjeom",
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="yangsan">양산캠퍼스</option>
                          <option value="jangjeom">장전캠퍼스</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          상태
                        </label>
                        <select
                          value={itemForm.condition}
                          onChange={(e) =>
                            setItemForm({
                              ...itemForm,
                              condition: e.target.value as
                                | "excellent"
                                | "good"
                                | "fair"
                                | "poor",
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="excellent">매우 좋음</option>
                          <option value="good">좋음</option>
                          <option value="fair">보통</option>
                          <option value="poor">나쁨</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          위치
                        </label>
                        <input
                          type="text"
                          value={itemForm.location}
                          onChange={(e) =>
                            setItemForm({
                              ...itemForm,
                              location: e.target.value,
                            })
                          }
                          placeholder="정보대학 학생회실"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          연락처
                        </label>
                        <input
                          type="text"
                          value={itemForm.contact}
                          onChange={(e) =>
                            setItemForm({
                              ...itemForm,
                              contact: e.target.value,
                            })
                          }
                          placeholder="관리자 연락처"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          고유 ID *
                        </label>
                        <input
                          type="text"
                          value={itemForm.uniqueId}
                          onChange={(e) =>
                            setItemForm({
                              ...itemForm,
                              uniqueId: e.target.value,
                            })
                          }
                          placeholder="스티커에 적힌 고유 번호"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          상태
                        </label>
                        <select
                          value={itemForm.status}
                          onChange={(e) =>
                            setItemForm({
                              ...itemForm,
                              status: e.target.value as
                                | "available"
                                | "rented"
                                | "maintenance"
                                | "lost"
                                | "damaged",
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="available">대여 가능</option>
                          <option value="rented">대여 중</option>
                          <option value="maintenance">정비 중</option>
                          <option value="lost">분실</option>
                          <option value="damaged">파손</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        물품 이미지
                      </label>
                      <input
                        type="file"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedItemImage(file);
                          }
                        }}
                        accept="image/*"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {itemUploadProgress > 0 && itemUploadProgress < 100 && (
                        <div className="mt-2">
                          <div className="bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${itemUploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}
                      {itemForm.image && (
                        <div className="mt-2">
                          <img
                            src={itemForm.image}
                            alt="물품 이미지"
                            className="w-32 h-32 object-cover rounded-lg border"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {isLoading
                          ? "저장 중..."
                          : isEditingItem
                          ? "수정"
                          : "추가"}
                      </button>
                      {isEditingItem && (
                        <button
                          type="button"
                          onClick={resetItemForm}
                          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        >
                          취소
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* 물품 목록 */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-lg font-medium mb-4">물품 목록</h2>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {Object.values(rentalItems).length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        등록된 물품이 없습니다.
                      </div>
                    ) : (
                      Object.values(rentalItems).map((item) => (
                        <div
                          key={item.id}
                          className="border border-gray-200 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                {item.image && (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded-lg"
                                  />
                                )}
                                <div>
                                  <h3 className="font-medium text-gray-900">
                                    {item.name}
                                  </h3>
                                  <p className="text-sm text-gray-600">
                                    {item.category} •{" "}
                                    {item.campus === "yangsan"
                                      ? "양산"
                                      : "장전"}
                                  </p>
                                </div>
                              </div>
                              <p className="text-sm text-gray-500 mt-2">
                                {item.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm text-gray-600">
                                  고유 ID: {item.uniqueId}
                                </span>
                                <span
                                  className={`inline-block px-2 py-1 text-xs rounded ${
                                    item.condition === "양호"
                                      ? "bg-green-100 text-green-800"
                                      : item.condition === "보통"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : item.condition === "불량"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {item.condition}
                                </span>
                                <span
                                  className={`inline-block px-2 py-1 text-xs rounded ${
                                    item.status === "available"
                                      ? "bg-green-100 text-green-800"
                                      : item.status === "rented"
                                      ? "bg-blue-100 text-blue-800"
                                      : item.status === "maintenance"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {item.status === "available"
                                    ? "대여 가능"
                                    : item.status === "rented"
                                    ? "대여 중"
                                    : item.status === "maintenance"
                                    ? "정비 중"
                                    : item.status === "lost"
                                    ? "분실"
                                    : "파손"}
                                </span>
                              </div>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button
                                onClick={() => editItem(item)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                수정
                              </button>
                              <button
                                onClick={() => deleteItem(item.id!)}
                                className="text-red-600 hover:text-red-800 text-sm"
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
