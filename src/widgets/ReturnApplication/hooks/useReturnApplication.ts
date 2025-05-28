import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../../shared/contexts/AuthContext";
import { useToast } from "../../../shared/components/Toast";
import {
  rentalApplicationService,
  rentalItemService,
  photoUploadService,
  FirestoreRentalApplication,
  FirestoreRentalItem,
} from "../../../shared/services/firestore";
import { discordService } from "../../../shared/services/discordService";
import { StudentIdInfo } from "../../../shared/services/clientOcrService";

export type ReturnStep =
  | "verify"
  | "select"
  | "photos"
  | "lockbox"
  | "complete";

export interface ReturnPhotos {
  itemPhoto: string;
  labelPhoto: string;
  lockboxPhoto: string;
}

// localStorage 키 상수
const STORAGE_KEYS = {
  RETURN_APPLICATION_STATE: "returnApplicationState",
  RETURN_STEP: "returnStep",
  STUDENT_INFO: "returnStudentInfo",
  CURRENT_RENTALS: "returnCurrentRentals",
  RENTAL_ITEMS: "returnRentalItems",
  SELECTED_RENTAL: "returnSelectedRental",
  PHOTOS: "returnPhotos",
} as const;

// 상태 저장 함수
const saveToStorage = (key: string, data: unknown) => {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch (error) {
    console.warn("localStorage 저장 실패:", error);
  }
};

// 상태 불러오기 함수
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    }
  } catch (error) {
    console.warn("localStorage 불러오기 실패:", error);
  }
  return defaultValue;
};

// 상태 삭제 함수
const clearStorage = () => {
  try {
    if (typeof window !== "undefined") {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    }
  } catch (error) {
    console.warn("localStorage 삭제 실패:", error);
  }
};

export default function useReturnApplication() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  // 단계 관리 (localStorage에서 복원)
  const [step, setStepState] = useState<ReturnStep>(() =>
    loadFromStorage(STORAGE_KEYS.RETURN_STEP, "verify")
  );
  const [isLoading, setIsLoading] = useState(false);

  // 학생 정보 (localStorage에서 복원)
  const [studentInfo, setStudentInfoState] = useState<StudentIdInfo | null>(
    () => loadFromStorage(STORAGE_KEYS.STUDENT_INFO, null)
  );

  // 대여 중인 물품들 (localStorage에서 복원)
  const [currentRentals, setCurrentRentalsState] = useState<
    FirestoreRentalApplication[]
  >(() => loadFromStorage(STORAGE_KEYS.CURRENT_RENTALS, []));

  const [rentalItems, setRentalItemsState] = useState<{
    [id: string]: FirestoreRentalItem;
  }>(() => loadFromStorage(STORAGE_KEYS.RENTAL_ITEMS, {}));

  const [selectedRental, setSelectedRentalState] =
    useState<FirestoreRentalApplication | null>(() =>
      loadFromStorage(STORAGE_KEYS.SELECTED_RENTAL, null)
    );

  // 사진 업로드 상태 (localStorage에서 복원)
  const [photos, setPhotosState] = useState<ReturnPhotos>(() =>
    loadFromStorage(STORAGE_KEYS.PHOTOS, {
      itemPhoto: "",
      labelPhoto: "",
      lockboxPhoto: "",
    })
  );

  // 상태 변경 시 localStorage에 저장하는 래퍼 함수들
  const setStep = (newStep: ReturnStep) => {
    setStepState(newStep);
    saveToStorage(STORAGE_KEYS.RETURN_STEP, newStep);
  };

  const setStudentInfo = (info: StudentIdInfo | null) => {
    setStudentInfoState(info);
    saveToStorage(STORAGE_KEYS.STUDENT_INFO, info);
  };

  const setCurrentRentals = (rentals: FirestoreRentalApplication[]) => {
    setCurrentRentalsState(rentals);
    saveToStorage(STORAGE_KEYS.CURRENT_RENTALS, rentals);
  };

  const setRentalItems = (items: { [id: string]: FirestoreRentalItem }) => {
    setRentalItemsState(items);
    saveToStorage(STORAGE_KEYS.RENTAL_ITEMS, items);
  };

  const setSelectedRental = (rental: FirestoreRentalApplication | null) => {
    setSelectedRentalState(rental);
    saveToStorage(STORAGE_KEYS.SELECTED_RENTAL, rental);
  };

  const setPhotos = (
    photos: ReturnPhotos | ((prev: ReturnPhotos) => ReturnPhotos)
  ) => {
    if (typeof photos === "function") {
      setPhotosState((prev) => {
        const newPhotos = photos(prev);
        saveToStorage(STORAGE_KEYS.PHOTOS, newPhotos);
        return newPhotos;
      });
    } else {
      setPhotosState(photos);
      saveToStorage(STORAGE_KEYS.PHOTOS, photos);
    }
  };

  // 컴포넌트 마운트 시 상태 복원 확인
  useEffect(() => {
    // 이미 진행 중인 상태가 있다면 복원된 상태 사용
    const savedStep = loadFromStorage(STORAGE_KEYS.RETURN_STEP, "verify");
    if (savedStep !== "verify" && savedStep !== "complete") {
      console.log("이전 진행 상태를 복원했습니다:", savedStep);
    }
  }, []);

  // 페이지 언로드 시 상태 저장 (추가 보장)
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveToStorage(STORAGE_KEYS.RETURN_STEP, step);
      saveToStorage(STORAGE_KEYS.STUDENT_INFO, studentInfo);
      saveToStorage(STORAGE_KEYS.CURRENT_RENTALS, currentRentals);
      saveToStorage(STORAGE_KEYS.RENTAL_ITEMS, rentalItems);
      saveToStorage(STORAGE_KEYS.SELECTED_RENTAL, selectedRental);
      saveToStorage(STORAGE_KEYS.PHOTOS, photos);
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [step, studentInfo, currentRentals, rentalItems, selectedRental, photos]);

  // 학생증 인증 성공 처리
  const handleStudentIdSuccess = async (studentData: StudentIdInfo) => {
    setStudentInfo(studentData);
    setIsLoading(true);

    try {
      // 학번으로 대여 중인 물품들 조회
      const allRentals = await rentalApplicationService.getAllApplications();
      const userRentals = allRentals.filter(
        (rental: FirestoreRentalApplication) =>
          rental.studentId === studentData.studentId &&
          rental.status === "rented"
      );

      setCurrentRentals(userRentals);

      // 물품 정보 로드
      const itemsMap: { [id: string]: FirestoreRentalItem } = {};
      for (const rental of userRentals) {
        try {
          const item = await rentalItemService.getById(rental.itemId);
          if (item && item.id) {
            itemsMap[item.id] = item;
          }
        } catch (error) {
          console.error(`물품 ${rental.itemId} 로드 오류:`, error);
        }
      }
      setRentalItems(itemsMap);

      if (userRentals.length === 0) {
        showToast({
          type: "info",
          message: "현재 대여 중인 물품이 없습니다.",
        });
      } else {
        showToast({
          type: "success",
          message: "학생 인증이 완료되었습니다. 반납할 물품을 선택해주세요.",
        });
        setStep("select");
      }
    } catch (error) {
      console.error("대여 중인 물품 조회 오류:", error);
      showToast({
        type: "error",
        message: "대여 중인 물품을 조회하는데 실패했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 학생증 인증 실패 처리
  const handleStudentIdError = (error: string) => {
    showToast({
      type: "error",
      message: error,
    });
  };

  // 물품 선택 처리
  const handleRentalSelect = (rental: FirestoreRentalApplication) => {
    setSelectedRental(rental);
    setStep("photos");
  };

  // 사진 업로드 성공 처리
  const handlePhotoUploadSuccess = (
    type: "item" | "label" | "lockbox",
    url: string
  ) => {
    setPhotos((prev) => ({
      ...prev,
      [type === "item"
        ? "itemPhoto"
        : type === "label"
        ? "labelPhoto"
        : "lockboxPhoto"]: url,
    }));

    showToast({
      type: "success",
      message: "사진이 성공적으로 업로드되었습니다.",
    });
  };

  // 사진 업로드 에러 처리
  const handlePhotoUploadError = (error: string) => {
    showToast({
      type: "error",
      message: error,
    });
  };

  // 물품 상태 및 라벨 사진 검증
  const validateItemPhotos = () => {
    if (!photos.itemPhoto) {
      showToast({
        type: "error",
        message: "물품 상태 사진을 업로드해주세요.",
      });
      return false;
    }

    if (!photos.labelPhoto) {
      showToast({
        type: "error",
        message: "물품 라벨 사진을 업로드해주세요.",
      });
      return false;
    }

    return true;
  };

  // 자물쇠 비밀번호 제공 및 디스코드 알림
  const handleProvidePassword = async () => {
    if (!selectedRental || !validateItemPhotos()) {
      return;
    }

    setIsLoading(true);

    try {
      const item = rentalItems[selectedRental.itemId];

      // 사진 업로드 기록 저장
      await photoUploadService.createPhotoRecord({
        rentalId: selectedRental.id!,
        userId: user?.uid || "anonymous",
        type: "item_pre_return",
        url: photos.itemPhoto,
        verified: false,
      });

      await photoUploadService.createPhotoRecord({
        rentalId: selectedRental.id!,
        userId: user?.uid || "anonymous",
        type: "item_pre_return", // item_label 대신 item_pre_return 사용
        url: photos.labelPhoto,
        verified: false,
      });

      // 디스코드 알림 발송
      await discordService.notifyReturnRequested({
        userName: studentInfo?.name || "알 수 없음",
        studentId: studentInfo?.studentId || "알 수 없음",
        itemName: item.name,
        endDate: selectedRental.dueDate,
      });

      showToast({
        type: "success",
        message: "반납 요청이 전송되었습니다. 자물쇠 잠금 사진을 촬영해주세요.",
      });

      setStep("lockbox");
    } catch (error) {
      console.error("비밀번호 제공 오류:", error);
      showToast({
        type: "error",
        message: "처리 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 최종 반납 완료 처리
  const handleCompleteReturn = async () => {
    if (!photos.lockboxPhoto) {
      showToast({
        type: "error",
        message: "자물쇠 잠금 확인 사진을 업로드해주세요.",
      });
      return;
    }

    setIsLoading(true);

    try {
      // 반납 상태 업데이트
      await rentalApplicationService.updateStatus(
        selectedRental!.id!,
        "returned",
        {
          actualReturnDate: new Date().toISOString().split("T")[0],
        }
      );

      // 자물쇠 사진 기록 저장
      await photoUploadService.createPhotoRecord({
        rentalId: selectedRental!.id!,
        userId: user?.uid || "anonymous",
        type: "lockbox_post_return",
        url: photos.lockboxPhoto,
        verified: false,
      });

      // 반납 완료 디스코드 알림
      const item = rentalItems[selectedRental!.itemId];

      await discordService.notifyReturnCompleted({
        userName: studentInfo?.name || "알 수 없음",
        studentId: studentInfo?.studentId || "알 수 없음",
        itemName: item.name,
        actualReturnDate: new Date().toISOString().split("T")[0],
      });

      showToast({
        type: "success",
        message: "반납이 완료되었습니다! 이용해주셔서 감사합니다.",
        duration: 3000,
      });

      setStep("complete");

      // localStorage 정리 (반납 완료 시)
      clearStorage();

      // 3초 후 메인 페이지로 이동
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("반납 완료 오류:", error);
      showToast({
        type: "error",
        message: "반납 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 초기화
  const resetApplication = () => {
    setStep("verify");
    setStudentInfo(null);
    setCurrentRentals([]);
    setRentalItems({});
    setSelectedRental(null);
    setPhotos({
      itemPhoto: "",
      labelPhoto: "",
      lockboxPhoto: "",
    });
    clearStorage();
  };

  // 연체 여부 확인
  const isOverdue = (rental: FirestoreRentalApplication) => {
    const today = new Date();
    const endDate = new Date(rental.dueDate);
    return today > endDate;
  };

  // 연체 일수 계산
  const getOverdueDays = (rental: FirestoreRentalApplication) => {
    const today = new Date();
    const endDate = new Date(rental.dueDate);
    const diffTime = today.getTime() - endDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return {
    // 상태
    loading,
    step,
    isLoading,
    studentInfo,
    currentRentals,
    rentalItems,
    selectedRental,
    photos,
    router,

    // 액션
    setStep,
    handleStudentIdSuccess,
    handleStudentIdError,
    handleRentalSelect,
    handlePhotoUploadSuccess,
    handlePhotoUploadError,
    handleProvidePassword,
    handleCompleteReturn,
    resetApplication,
    isOverdue,
    getOverdueDays,
  };
}
