import { useState, useEffect } from "react";

interface OfflineApplication {
  userId: string;
  itemId: string;
  purpose: string;
  timestamp: number;
  type: string;
  storageKey?: string;
}

interface OfflinePhoto {
  rentalId: string;
  userId: string;
  photoType: string;
  file: File;
  timestamp: number;
  type: string;
  storageKey?: string;
}

interface OfflineData {
  applications: OfflineApplication[];
  photos: OfflinePhoto[];
  timestamp: number;
}

export function useOffline() {
  const [isOnline, setIsOnline] = useState(true);
  const [offlineData, setOfflineData] = useState<OfflineData | null>(null);

  // 온라인/오프라인 상태 감지
  useEffect(() => {
    const updateOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    // 초기 상태 설정
    updateOnlineStatus();

    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  // 로컬 스토리지에 데이터 저장
  const saveOfflineData = (
    data: OfflineApplication | OfflinePhoto,
    type: "application" | "photo"
  ) => {
    if (!isOnline) {
      const storageKey = `offline_${type}_${Date.now()}`;
      const dataToSave = {
        ...data,
        timestamp: Date.now(),
        type,
      };
      localStorage.setItem(storageKey, JSON.stringify(dataToSave));
      return storageKey;
    }
    return null;
  };

  // 저장된 오프라인 데이터 조회
  const getOfflineData = (): OfflineData => {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith("offline_")
    );
    const applications: OfflineApplication[] = [];
    const photos: OfflinePhoto[] = [];

    keys.forEach((key) => {
      try {
        const data = JSON.parse(localStorage.getItem(key) || "{}");
        if (data.type === "application") {
          applications.push({ ...data, storageKey: key });
        } else if (data.type === "photo") {
          photos.push({ ...data, storageKey: key });
        }
      } catch (error) {
        console.error("오프라인 데이터 파싱 오류:", error);
      }
    });

    return {
      applications,
      photos,
      timestamp: Date.now(),
    };
  };

  // 오프라인 데이터 동기화
  const syncOfflineData = async () => {
    if (!isOnline) return false;

    const data = getOfflineData();
    const syncResults = {
      success: 0,
      failed: 0,
      errors: [] as string[],
    };

    // 대여 신청 동기화
    for (const application of data.applications) {
      try {
        // 여기에 실제 API 호출 로직 추가
        console.log("동기화할 대여 신청:", application);
        localStorage.removeItem(application.storageKey || "");
        syncResults.success++;
      } catch (error) {
        console.error("대여 신청 동기화 오류:", error);
        syncResults.failed++;
        syncResults.errors.push(`대여 신청 동기화 실패: ${error}`);
      }
    }

    // 사진 업로드 동기화
    for (const photo of data.photos) {
      try {
        // 여기에 실제 사진 업로드 로직 추가
        console.log("동기화할 사진:", photo);
        localStorage.removeItem(photo.storageKey || "");
        syncResults.success++;
      } catch (error) {
        console.error("사진 동기화 오류:", error);
        syncResults.failed++;
        syncResults.errors.push(`사진 동기화 실패: ${error}`);
      }
    }

    return syncResults;
  };

  // 오프라인 데이터 제거
  const clearOfflineData = () => {
    const keys = Object.keys(localStorage).filter((key) =>
      key.startsWith("offline_")
    );
    keys.forEach((key) => localStorage.removeItem(key));
  };

  // 온라인 상태가 복구되면 자동 동기화
  useEffect(() => {
    if (isOnline && offlineData) {
      syncOfflineData().then((results) => {
        if (results && results.success > 0) {
          console.log(`${results.success}개 항목이 동기화되었습니다.`);
        }
      });
    }
  }, [isOnline]);

  // 오프라인 데이터 업데이트
  useEffect(() => {
    setOfflineData(getOfflineData());
  }, [isOnline]);

  return {
    isOnline,
    offlineData,
    saveOfflineData,
    getOfflineData,
    syncOfflineData,
    clearOfflineData,
  };
}
