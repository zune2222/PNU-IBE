import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useToast } from "../../shared/components/Toast";
import {
  rentalItemService,
  FirestoreRentalItem,
  rentalApplicationService,
  studentSanctionService,
} from "../../shared/services/firestore";
import { discordService } from "../../shared/services/discordService";
import type { RentalNotificationData } from "../../shared/services/discordService";
import {
  ExtendedStudentIdInfo,
  RentalStep,
  RentalApplicationForm,
  RentalPhotos,
} from "./types";
import { uploadRentalPhotos } from "./services";

// localStorage 키 상수
const STORAGE_KEYS = {
  RENTAL_APPLICATION_STATE: "rentalApplicationState",
  RENTAL_STEP: "rentalStep",
  SELECTED_ITEM: "rentalSelectedItem",
  VERIFIED_STUDENT_INFO: "rentalVerifiedStudentInfo",
  APPLICATION_FORM: "rentalApplicationForm",
  // PHOTOS: "rentalPhotos", // File 객체는 localStorage에 저장할 수 없음
  CREATED_RENTAL_ID: "rentalCreatedRentalId",
  RENTAL_DUE_DATE: "rentalDueDate",
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
const loadFromStorage = function <T>(key: string, defaultValue: T): T {
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
const clearRentalStorage = () => {
  try {
    if (typeof window !== "undefined") {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
      // 기존에 잘못 저장된 photos 데이터도 정리
      localStorage.removeItem("rentalPhotos");
    }
  } catch (error) {
    console.warn("localStorage 삭제 실패:", error);
  }
};

export const useRentalApplication = () => {
  const router = useRouter();
  const { showToast } = useToast();

  // 상태 관리 (기본값으로 초기화, localStorage 복원은 useEffect에서)
  const [availableItems, setAvailableItems] = useState<FirestoreRentalItem[]>(
    []
  );
  const [selectedItem, setSelectedItemState] =
    useState<FirestoreRentalItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStepState] = useState<RentalStep>("verify");
  const [verifiedStudentInfo, setVerifiedStudentInfoState] =
    useState<ExtendedStudentIdInfo | null>(null);
  const [applicationForm, setApplicationFormState] =
    useState<RentalApplicationForm>({ agreement: false });
  const [photos, setPhotosState] = useState<RentalPhotos>({
    itemCondition: null,
    itemLabel: null,
    lockboxSecured: null,
  });
  const [createdRentalId, setCreatedRentalIdState] = useState<string | null>(
    null
  );
  const [rentalDueDate, setRentalDueDateState] = useState<Date | null>(null);

  // 클라이언트에서만 localStorage 상태 복원
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSelectedItem = loadFromStorage(
        STORAGE_KEYS.SELECTED_ITEM,
        null
      );
      const savedStep = loadFromStorage(STORAGE_KEYS.RENTAL_STEP, "verify");
      const savedStudentInfo = loadFromStorage(
        STORAGE_KEYS.VERIFIED_STUDENT_INFO,
        null
      );
      const savedApplicationForm = loadFromStorage(
        STORAGE_KEYS.APPLICATION_FORM,
        { agreement: false }
      );
      const savedCreatedRentalId = loadFromStorage(
        STORAGE_KEYS.CREATED_RENTAL_ID,
        null
      );
      const savedRentalDueDate = loadFromStorage(
        STORAGE_KEYS.RENTAL_DUE_DATE,
        null
      );

      setSelectedItemState(savedSelectedItem);
      setStepState(savedStep);
      setVerifiedStudentInfoState(savedStudentInfo);
      setApplicationFormState(savedApplicationForm);
      setCreatedRentalIdState(savedCreatedRentalId);
      setRentalDueDateState(
        savedRentalDueDate ? new Date(savedRentalDueDate) : null
      );
    }
  }, []);

  // 상태 변경 시 localStorage에 저장하는 래퍼 함수들
  const setSelectedItem = (item: FirestoreRentalItem | null) => {
    setSelectedItemState(item);
    saveToStorage(STORAGE_KEYS.SELECTED_ITEM, item);
  };

  const setStep = (newStep: RentalStep) => {
    setStepState(newStep);
    saveToStorage(STORAGE_KEYS.RENTAL_STEP, newStep);
  };

  const setVerifiedStudentInfo = (info: ExtendedStudentIdInfo | null) => {
    setVerifiedStudentInfoState(info);
    saveToStorage(STORAGE_KEYS.VERIFIED_STUDENT_INFO, info);
  };

  const setApplicationForm = (form: RentalApplicationForm) => {
    setApplicationFormState(form);
    saveToStorage(STORAGE_KEYS.APPLICATION_FORM, form);
  };

  const setPhotos = (photos: RentalPhotos) => {
    setPhotosState(photos);
    // File 객체는 localStorage에 저장할 수 없으므로 저장하지 않음
  };

  const setCreatedRentalId = (id: string | null) => {
    setCreatedRentalIdState(id);
    saveToStorage(STORAGE_KEYS.CREATED_RENTAL_ID, id);
  };

  const setRentalDueDate = (date: Date | null) => {
    setRentalDueDateState(date);
    saveToStorage(STORAGE_KEYS.RENTAL_DUE_DATE, date?.toISOString() || null);
  };

  // 물품 목록 로드
  useEffect(() => {
    if (step === "select") {
      loadAvailableItems();
    }
  }, [step]);

  // 비밀번호 단계에서 학생증 정보 업로드
  useEffect(() => {
    if (step === "password" && verifiedStudentInfo && selectedItem) {
      uploadStudentInfo();
    }
  }, [step, verifiedStudentInfo, selectedItem]);

  const loadAvailableItems = async () => {
    setIsLoading(true);
    try {
      const items = await rentalItemService.getAvailable();
      setAvailableItems(items);
    } catch (error) {
      console.error("물품 목록 로드 오류:", error);
      showToast({
        type: "error",
        message: "물품 목록을 불러오는데 실패했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentIdSuccess = (studentInfoData: ExtendedStudentIdInfo) => {
    setVerifiedStudentInfo(studentInfoData);

    // 인증 완료 후 바로 물품 선택 단계로 이동
    setTimeout(() => {
      setStep("select");
      showToast({
        type: "success",
        message:
          "학생 인증이 완료되었습니다. 이제 물품을 선택하고 대여 신청하실 수 있습니다!",
      });
    }, 1000); // 1초 후에 한 번만 토스트 표시
  };

  const handleStudentIdError = (error: string) => {
    showToast({
      type: "error",
      message: error,
    });
  };

  const handleItemSelect = async (item: FirestoreRentalItem) => {
    if (!verifiedStudentInfo) {
      showToast({
        type: "error",
        message: "학생 인증이 필요합니다.",
      });
      return;
    }

    // 학생 정보 필수 필드 확인
    if (
      !verifiedStudentInfo.name ||
      !verifiedStudentInfo.studentId ||
      !verifiedStudentInfo.department
    ) {
      showToast({
        type: "error",
        message: "학생 정보가 완전하지 않습니다. 다시 인증해주세요.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // 제재 상태 확인
      const eligibilityCheck = await studentSanctionService.checkEligibility(
        verifiedStudentInfo.studentId
      );

      if (!eligibilityCheck.eligible) {
        showToast({
          type: "error",
          message: eligibilityCheck.reason || "대여가 제한된 상태입니다.",
        });
        setIsLoading(false);
        return;
      }

      showToast({
        type: "info",
        message: "대여를 진행하고 있습니다...",
      });

      // 대여 완료 처리 - 여기서 실제 대여가 완료됨
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setDate(today.getDate() + 1); // 24시간 후

      const rentalData = {
        userId: verifiedStudentInfo.studentId, // 학번을 userId로 사용
        itemId: item.id!,
        itemUniqueId: item.uniqueId,
        status: "rented" as const,
        rentDate: today.toISOString(),
        dueDate: dueDate.toISOString(),
        purpose: "즉시 대여", // 셀프 서비스는 목적을 기본값으로 설정

        // 학생 정보
        studentId: verifiedStudentInfo.studentId,
        studentName: verifiedStudentInfo.name,
        department: verifiedStudentInfo.department,
        campus: item.campus,
        phoneNumber: verifiedStudentInfo.phoneNumber,

        // 학생증 정보 (이미 인증 완료)
        studentIdPhotoUrl: verifiedStudentInfo.studentIdPhotoUrl || "",
        studentIdVerified: true,

        // 대여 시 촬영 사진들 (임시 값 - 다음 단계에서 업데이트 예정)
        itemConditionPhotoUrl: "",
        itemLabelPhotoUrl: "",
        lockboxSecuredPhotoUrl: "",
      };

      // Firestore에 대여 데이터 저장
      const rentalId = await rentalApplicationService.processRental(rentalData);

      // 디스코드 알림 전송
      const discordNotificationData: RentalNotificationData = {
        studentName: verifiedStudentInfo.name,
        studentId: verifiedStudentInfo.studentId,
        department: verifiedStudentInfo.department,
        phoneNumber: verifiedStudentInfo.phoneNumber,
        itemName: item.name,
        itemCategory: item.category,
        campus: item.campus,
        location: item.location,
        rentDate: today.toLocaleDateString("ko-KR"),
        dueDate: dueDate.toLocaleDateString("ko-KR"),
        rentalId: rentalId,
      };

      // 디스코드 알림 전송 (실패해도 대여는 완료됨)
      try {
        await discordService.notifyInstantRental(discordNotificationData);
      } catch (discordError) {
        console.warn("디스코드 알림 전송 실패:", discordError);
      }

      showToast({
        type: "success",
        message: "대여가 완료되었습니다! 보관함 비밀번호를 확인해주세요.",
      });

      // 선택된 물품과 대여 완료 정보 저장
      setSelectedItem(item);
      setCreatedRentalId(rentalId);
      setRentalDueDate(dueDate);
      setStep("password");
    } catch (error) {
      console.error("대여 처리 오류:", error);
      showToast({
        type: "error",
        message: "대여 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetApplication = () => {
    setSelectedItem(null);
    setApplicationForm({ agreement: false });
    setPhotos({
      itemCondition: null,
      itemLabel: null,
      lockboxSecured: null,
    });
    setCreatedRentalId(null);
    setRentalDueDate(null);
    setStep("select");
    clearRentalStorage();
  };

  const uploadStudentInfo = async () => {
    if (!verifiedStudentInfo || !selectedItem) return;

    // OCR 정보 검증
    if (
      !verifiedStudentInfo.studentId ||
      !verifiedStudentInfo.name ||
      !verifiedStudentInfo.department
    ) {
      showToast({
        type: "error",
        message: "학생증 정보가 완전하지 않습니다. 다시 인증해주세요.",
      });
      return;
    }

    // 학생증 사진 URL 확인
    const studentIdPhotoUrl = verifiedStudentInfo.studentIdPhotoUrl;
    if (!studentIdPhotoUrl) {
      showToast({
        type: "error",
        message: "학생증 사진이 필요합니다. 다시 인증해주세요.",
      });
      return;
    }

    // 24시간 후를 반납 마감일로 설정
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1);
    setRentalDueDate(dueDate);

    showToast({
      type: "success",
      message: "학생 정보 확인이 완료되었습니다. 비밀번호를 확인해주세요.",
    });
  };

  // 대여 완료 처리 (비밀번호 확인 시점)
  const handleRentalCompleted = (rentalId: string) => {
    setCreatedRentalId(rentalId);
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 1); // 24시간 후
    setRentalDueDate(dueDate);
  };

  const handleRentalProcess = async () => {
    if (!selectedItem || !verifiedStudentInfo || !createdRentalId) {
      showToast({
        type: "error",
        message: "대여 신청 정보가 없습니다. 처음부터 다시 시도해주세요.",
      });
      return;
    }

    const newErrors: { [key: string]: string } = {};

    // 사진 파일 검증
    if (!photos.itemCondition) {
      newErrors.itemCondition = "물품 상태 사진을 촬영해주세요.";
    }
    if (!photos.itemLabel) {
      newErrors.itemLabel = "물품 라벨 사진을 촬영해주세요.";
    }
    if (!photos.lockboxSecured) {
      newErrors.lockboxSecured = "잠금함 보안 사진을 촬영해주세요.";
    }

    if (Object.keys(newErrors).length > 0) {
      // 첫 번째 에러만 toast로 표시
      const firstError = Object.values(newErrors)[0];
      showToast({
        type: "error",
        message: firstError,
      });
      return;
    }

    // 모든 사진이 존재하는지 타입 가드
    if (!photos.itemCondition || !photos.itemLabel || !photos.lockboxSecured) {
      return;
    }

    setIsLoading(true);
    try {
      // 대여 관련 사진들을 Firebase Storage에 업로드
      const rentalPhotos = await uploadRentalPhotos(
        {
          itemCondition: photos.itemCondition,
          itemLabel: photos.itemLabel,
          lockboxSecured: photos.lockboxSecured,
        },
        verifiedStudentInfo.studentId!, // 학번을 userId로 사용 (이미 null 체크 완료)
        createdRentalId
      );

      // 기존 대여 신청에 사진 정보 업데이트
      await rentalApplicationService.updateStatus(
        createdRentalId,
        "rented",
        rentalPhotos
      );

      console.log("대여 신청 사진 업데이트 완료:", createdRentalId);
      showToast({
        type: "success",
        message: "사진 업로드가 완료되었습니다!",
      });
      setStep("complete");

      // localStorage 정리 (대여 완료 시)
      clearRentalStorage();
    } catch (error) {
      console.error("사진 업데이트 오류:", error);
      showToast({
        type: "error",
        message: "사진 업로드 중 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // 상태
    availableItems,
    selectedItem,
    isLoading,
    step,
    verifiedStudentInfo,
    applicationForm,
    photos,
    createdRentalId,
    rentalDueDate,
    router,

    // 액션
    setStep,
    setApplicationForm,
    setPhotos,
    handleStudentIdSuccess,
    handleStudentIdError,
    handleItemSelect,
    handleRentalProcess,
    handleRentalCompleted,
    resetApplication,
  };
};

export default useRentalApplication;
