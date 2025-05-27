import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../../shared/contexts/AuthContext";
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

export const useRentalApplication = () => {
  const { user, loading } = useAuth();
  const router = useRouter();

  // 상태 관리
  const [availableItems, setAvailableItems] = useState<FirestoreRentalItem[]>(
    []
  );
  const [selectedItem, setSelectedItem] = useState<FirestoreRentalItem | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<RentalStep>("verify");
  const [verifiedStudentInfo, setVerifiedStudentInfo] =
    useState<ExtendedStudentIdInfo | null>(null);
  const [applicationForm, setApplicationForm] = useState<RentalApplicationForm>(
    {
      agreement: false,
    }
  );
  const [photos, setPhotos] = useState<RentalPhotos>({
    itemCondition: null,
    itemLabel: null,
    lockboxSecured: null,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [createdRentalId, setCreatedRentalId] = useState<string | null>(null);
  const [rentalDueDate, setRentalDueDate] = useState<Date | null>(null);

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
      setErrors({ general: "물품 목록을 불러오는데 실패했습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentIdSuccess = (studentInfoData: ExtendedStudentIdInfo) => {
    setSuccessMessage("학생증 인증이 완료되었습니다!");
    setVerifiedStudentInfo(studentInfoData);

    // 인증 완료 후 바로 물품 선택 단계로 이동
    setTimeout(() => {
      setStep("select");
      setSuccessMessage(
        "학생 인증이 완료되었습니다. 이제 물품을 선택하고 대여 신청하실 수 있습니다!"
      );
    }, 2000);
  };

  const handleStudentIdError = (error: string) => {
    setErrors({ general: error });
  };

  const handleItemSelect = (item: FirestoreRentalItem) => {
    setSelectedItem(item);
    setStep("password");
  };

  const handleRentalProcess = async () => {
    if (!selectedItem || !verifiedStudentInfo || !createdRentalId || !user) {
      setErrors({
        general: "대여 신청 정보가 없습니다. 처음부터 다시 시도해주세요.",
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

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

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
      setSuccessMessage("대여가 완료되었습니다!");
      setStep("complete");
    } catch (error) {
      console.error("사진 업데이트 오류:", error);
      setErrors({ general: "사진 업로드 중 오류가 발생했습니다." });
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
    setErrors({});
    setSuccessMessage("");
    setStep("select");
  };

  const uploadStudentInfo = async () => {
    if (!verifiedStudentInfo || !selectedItem || !user) return;

    // OCR 정보 검증
    if (
      !verifiedStudentInfo.studentId ||
      !verifiedStudentInfo.name ||
      !verifiedStudentInfo.department
    ) {
      setErrors({
        general: "학생증 정보가 완전하지 않습니다. 다시 인증해주세요.",
      });
      return;
    }

    setIsLoading(true);
    try {
      // 학생증 사진 업로드
      let studentIdPhotoUrl = "temp_student_id_photo_url";
      if (verifiedStudentInfo.studentIdPhotoFile) {
        studentIdPhotoUrl = await uploadStudentIdPhoto(
          verifiedStudentInfo.studentIdPhotoFile,
          user.uid
        );
        console.log("학생증 사진 업로드 완료:", studentIdPhotoUrl);
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
      setSuccessMessage(
        "대여 신청이 생성되었습니다. 이제 사진을 촬영해주세요."
      );

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
      setErrors({ general: "대여 신청 생성 중 오류가 발생했습니다." });
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
    errors,
    successMessage,
    createdRentalId,
    rentalDueDate,
    router,

    // 액션
    setStep,
    setApplicationForm,
    setPhotos,
    setErrors,
    handleStudentIdSuccess,
    handleStudentIdError,
    handleItemSelect,
    handleRentalProcess,
    resetApplication,
  };
};

export default useRentalApplication;
