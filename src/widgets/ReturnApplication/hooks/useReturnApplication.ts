import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../../shared/contexts/AuthContext";
import {
  rentalApplicationService,
  rentalItemService,
  photoUploadService,
  lockboxPasswordService,
  FirestoreRentalApplication,
  FirestoreRentalItem,
} from "../../../shared/services/firestore";
import { discordService } from "../../../shared/services/discordService";
import { StudentIdInfo } from "../../../shared/services/clientOcrService";

export type ReturnStep =
  | "verify"
  | "select"
  | "photos"
  | "password"
  | "lockbox"
  | "complete";

export interface ReturnPhotos {
  itemPhoto: string;
  labelPhoto: string;
  lockboxPhoto: string;
}

export default function useReturnApplication() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // 단계 관리
  const [step, setStep] = useState<ReturnStep>("verify");
  const [isLoading, setIsLoading] = useState(false);

  // 학생 정보
  const [studentInfo, setStudentInfo] = useState<StudentIdInfo | null>(null);

  // 대여 중인 물품들
  const [currentRentals, setCurrentRentals] = useState<
    FirestoreRentalApplication[]
  >([]);
  const [rentalItems, setRentalItems] = useState<{
    [id: string]: FirestoreRentalItem;
  }>({});
  const [selectedRental, setSelectedRental] =
    useState<FirestoreRentalApplication | null>(null);

  // 사진 업로드 상태
  const [photos, setPhotos] = useState<ReturnPhotos>({
    itemPhoto: "",
    labelPhoto: "",
    lockboxPhoto: "",
  });

  // 자물쇠 비밀번호
  const [lockboxPassword, setLockboxPassword] = useState("");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  // 학생증 인증 성공 처리
  const handleStudentIdSuccess = async (studentData: StudentIdInfo) => {
    setStudentInfo(studentData);
    setIsLoading(true);
    setErrors({});

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
        setErrors({ general: "현재 대여 중인 물품이 없습니다." });
      } else {
        setStep("select");
      }
    } catch (error) {
      console.error("대여 중인 물품 조회 오류:", error);
      setErrors({ general: "대여 중인 물품을 조회하는데 실패했습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  // 학생증 인증 실패 처리
  const handleStudentIdError = (error: string) => {
    setErrors({ verify: error });
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
  };

  // 사진 업로드 에러 처리
  const handlePhotoUploadError = (error: string) => {
    setErrors({ photo: error });
  };

  // 물품 상태 및 라벨 사진 검증
  const validateItemPhotos = () => {
    const newErrors: { [key: string]: string } = {};

    if (!photos.itemPhoto) {
      newErrors.itemPhoto = "물품 상태 사진을 업로드해주세요.";
    }

    if (!photos.labelPhoto) {
      newErrors.labelPhoto = "물품 라벨 사진을 업로드해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 자물쇠 비밀번호 제공 및 디스코드 알림
  const handleProvidePassword = async () => {
    if (!selectedRental || !validateItemPhotos()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const item = rentalItems[selectedRental.itemId];

      // 보관함 비밀번호 조회
      const passwordData = await lockboxPasswordService.getCurrentPassword(
        item.campus,
        item.location
      );

      if (!passwordData) {
        setErrors({
          general: "보관함 비밀번호를 찾을 수 없습니다. 관리자에게 문의하세요.",
        });
        return;
      }

      setLockboxPassword(passwordData.currentPassword);

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

      setStep("password");
    } catch (error) {
      console.error("비밀번호 제공 오류:", error);
      setErrors({ general: "처리 중 오류가 발생했습니다. 다시 시도해주세요." });
    } finally {
      setIsLoading(false);
    }
  };

  // 최종 반납 완료 처리
  const handleCompleteReturn = async () => {
    if (!photos.lockboxPhoto) {
      setErrors({ lockboxPhoto: "자물쇠 잠금 확인 사진을 업로드해주세요." });
      return;
    }

    setIsLoading(true);
    setErrors({});

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

      setSuccessMessage("반납이 완료되었습니다! 이용해주셔서 감사합니다.");
      setStep("complete");

      // 3초 후 메인 페이지로 이동
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("반납 완료 오류:", error);
      setErrors({
        general: "반납 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
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
    setLockboxPassword("");
    setErrors({});
    setSuccessMessage("");
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
    lockboxPassword,
    errors,
    successMessage,
    router,

    // 액션
    setStep,
    setPhotos,
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
