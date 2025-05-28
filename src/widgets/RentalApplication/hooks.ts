import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../shared/contexts/AuthContext";
import { useToast } from "../../shared/components/Toast";
import {
  rentalItemService,
  FirestoreRentalItem,
  rentalApplicationService,
} from "../../shared/services/firestore";
import { discordService } from "../../shared/services/discordService";
import type { RentalNotificationData } from "../../shared/services/discordService";
import {
  ExtendedStudentIdInfo,
  RentalStep,
  RentalApplicationForm,
  RentalPhotos,
} from "./types";
import { uploadStudentIdPhoto, uploadRentalPhotos } from "./services";

// localStorage 키 상수
const STORAGE_KEYS = {
  RENTAL_APPLICATION_STATE: "rentalApplicationState",
  RENTAL_STEP: "rentalStep",
  SELECTED_ITEM: "rentalSelectedItem",
  VERIFIED_STUDENT_INFO: "rentalVerifiedStudentInfo",
  APPLICATION_FORM: "rentalApplicationForm",
  PHOTOS: "rentalPhotos",
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
    }
  } catch (error) {
    console.warn("localStorage 삭제 실패:", error);
  }
};

export const useRentalApplication = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  // 상태 관리 (localStorage에서 복원)
  const [availableItems, setAvailableItems] = useState<FirestoreRentalItem[]>(
    []
  );
  const [selectedItem, setSelectedItemState] =
    useState<FirestoreRentalItem | null>(() =>
      loadFromStorage(STORAGE_KEYS.SELECTED_ITEM, null)
    );
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStepState] = useState<RentalStep>(() =>
    loadFromStorage(STORAGE_KEYS.RENTAL_STEP, "verify")
  );
  const [verifiedStudentInfo, setVerifiedStudentInfoState] =
    useState<ExtendedStudentIdInfo | null>(() =>
      loadFromStorage(STORAGE_KEYS.VERIFIED_STUDENT_INFO, null)
    );
  const [applicationForm, setApplicationFormState] =
    useState<RentalApplicationForm>(() =>
      loadFromStorage(STORAGE_KEYS.APPLICATION_FORM, { agreement: false })
    );
  const [photos, setPhotosState] = useState<RentalPhotos>(() =>
    loadFromStorage(STORAGE_KEYS.PHOTOS, {
      itemCondition: null,
      itemLabel: null,
      lockboxSecured: null,
    })
  );
  const [createdRentalId, setCreatedRentalIdState] = useState<string | null>(
    () => loadFromStorage(STORAGE_KEYS.CREATED_RENTAL_ID, null)
  );
  const [rentalDueDate, setRentalDueDateState] = useState<Date | null>(() => {
    const saved = loadFromStorage(STORAGE_KEYS.RENTAL_DUE_DATE, null);
    return saved ? new Date(saved) : null;
  });

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
    saveToStorage(STORAGE_KEYS.PHOTOS, photos);
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

  const handleItemSelect = (item: FirestoreRentalItem) => {
    setSelectedItem(item);
    setStep("password");
  };

  const handleRentalProcess = async () => {
    if (!selectedItem || !verifiedStudentInfo || !createdRentalId || !user) {
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
        user.uid,
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
        message: "대여가 완료되었습니다!",
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
    if (!verifiedStudentInfo || !selectedItem || !user) return;

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

    setIsLoading(true);
    try {
      // 학생증 사진 업로드
      let studentIdPhotoUrl = "temp_student_id_photo_url";
      if (
        verifiedStudentInfo.studentIdPhotoFile &&
        verifiedStudentInfo.studentIdPhotoFile instanceof File
      ) {
        try {
          studentIdPhotoUrl = await uploadStudentIdPhoto(
            verifiedStudentInfo.studentIdPhotoFile,
            user.uid
          );
          console.log("학생증 사진 업로드 완료:", studentIdPhotoUrl);
        } catch (uploadError) {
          console.error("학생증 사진 업로드 실패:", uploadError);
          showToast({
            type: "error",
            message: "학생증 사진 업로드에 실패했습니다. 다시 시도해주세요.",
          });
          return;
        }
      } else {
        console.warn("학생증 사진 파일이 없거나 유효하지 않습니다.");
        showToast({
          type: "error",
          message: "학생증 사진이 필요합니다. 다시 인증해주세요.",
        });
        return;
      }

      // 현재 시간을 대여 시작 시간으로 설정
      const now = new Date();
      const rentDate = now.toISOString();

      // 24시간 후를 반납 마감일로 설정
      const dueDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const dueDateString = dueDate.toISOString();

      // 대여 신청 데이터 생성
      const rentalApplicationData = {
        userId: user.uid,
        itemId: selectedItem.id!,
        itemUniqueId: selectedItem.uniqueId,
        status: "rented" as const,
        rentDate: rentDate,
        dueDate: dueDateString,
        purpose: "즉시 대여",
        studentId: verifiedStudentInfo.studentId,
        studentName: verifiedStudentInfo.name,
        department: verifiedStudentInfo.department,
        campus: selectedItem.campus,
        phoneNumber: verifiedStudentInfo.phoneNumber,
        studentIdPhotoUrl: studentIdPhotoUrl,
        studentIdVerified: true,
        itemConditionPhotoUrl: "",
        itemLabelPhotoUrl: "",
        lockboxSecuredPhotoUrl: "",
      };

      // 대여 신청 생성
      const rentalId = await rentalApplicationService.createApplication(
        rentalApplicationData
      );

      // 물품 상태를 대여 중으로 변경
      await rentalItemService.rentItem(selectedItem.id!, rentalId);

      console.log("대여 신청 생성 완료:", rentalId);
      showToast({
        type: "success",
        message: "대여 신청이 생성되었습니다. 이제 사진을 촬영해주세요.",
      });

      // 생성된 대여 ID를 상태에 저장
      setCreatedRentalId(rentalId);
      setRentalDueDate(dueDate);

      // 디스코드 알림 보내기
      const notificationData: RentalNotificationData = {
        studentName: verifiedStudentInfo.name || "이름 없음",
        studentId: verifiedStudentInfo.studentId || "",
        department: verifiedStudentInfo.department || "학과 정보 없음",
        phoneNumber: verifiedStudentInfo.phoneNumber,
        itemName: selectedItem.name,
        itemCategory: selectedItem.category,
        campus: selectedItem.campus,
        location: selectedItem.location,
        rentDate: rentDate,
        dueDate: dueDateString,
        rentalId: rentalId,
      };

      // 디스코드 알림 전송
      try {
        await discordService.notifyInstantRental(notificationData);
        console.log("즉시 대여 디스코드 알림 전송 완료");
      } catch (discordError) {
        console.warn("디스코드 알림 전송 실패:", discordError);
      }
    } catch (error) {
      console.error("대여 신청 생성 오류:", error);
      showToast({
        type: "error",
        message: "대여 신청 생성 중 오류가 발생했습니다.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // 상태
    user,
    loading,
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
    resetApplication,
  };
};

export default useRentalApplication;
