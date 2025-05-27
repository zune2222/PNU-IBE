import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "../shared/contexts/AuthContext";
import { StudentIdUpload } from "../widgets/StudentIdUpload";
import { StudentIdInfo } from "../shared/services/clientOcrService";
import {
  rentalItemService,
  FirestoreRentalItem,
  rentalApplicationService,
} from "../shared/services/firestore";
import { storage } from "../shared/config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

// 확장된 학생 정보 인터페이스 (휴대폰 번호 포함)
interface ExtendedStudentIdInfo extends StudentIdInfo {
  phoneNumber: string;
  studentIdPhotoFile?: File;
}

export default function RentalApplication() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [availableItems, setAvailableItems] = useState<FirestoreRentalItem[]>(
    []
  );
  const [selectedItem, setSelectedItem] = useState<FirestoreRentalItem | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<
    "verify" | "select" | "password" | "photos" | "complete"
  >("verify");
  const [verifiedStudentInfo, setVerifiedStudentInfo] =
    useState<ExtendedStudentIdInfo | null>(null);

  // 대여 신청 폼 상태
  const [applicationForm, setApplicationForm] = useState({
    agreement: false,
  });

  // 촬영 사진 상태
  const [photos, setPhotos] = useState({
    itemCondition: null as File | null,
    itemLabel: null as File | null,
    lockboxSecured: null as File | null,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [createdRentalId, setCreatedRentalId] = useState<string | null>(null);

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
    setApplicationForm({
      agreement: false,
    });
    setPhotos({
      itemCondition: null,
      itemLabel: null,
      lockboxSecured: null,
    });
    setCreatedRentalId(null);
    setErrors({});
    setSuccessMessage("");
    setStep("select");
  };

  // 학생증 사진을 Firebase Storage에 업로드
  const uploadStudentIdPhoto = async (
    file: File,
    userId: string
  ): Promise<string> => {
    try {
      // 파일명 생성 (사용자ID_timestamp_studentid.확장자)
      const timestamp = Date.now();
      const extension = file.name.split(".").pop();
      const fileName = `student-ids/${userId}_${timestamp}_studentid.${extension}`;

      // Firebase Storage 참조 생성
      const storageRef = ref(storage, fileName);

      // 파일 업로드
      const snapshot = await uploadBytes(storageRef, file);

      // 다운로드 URL 가져오기
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error("학생증 사진 업로드 오류:", error);
      throw new Error("학생증 사진 업로드에 실패했습니다.");
    }
  };

  // 대여 관련 사진들을 Firebase Storage에 업로드
  const uploadRentalPhotos = async (
    photos: { itemCondition: File; itemLabel: File; lockboxSecured: File },
    userId: string,
    rentalId: string
  ): Promise<{
    itemConditionPhotoUrl: string;
    itemLabelPhotoUrl: string;
    lockboxSecuredPhotoUrl: string;
  }> => {
    try {
      const timestamp = Date.now();

      // 각 사진 업로드
      const uploadPromises = [
        // 물품 상태 사진
        (async () => {
          const extension = photos.itemCondition.name.split(".").pop();
          const fileName = `rentals/${userId}/${rentalId}_${timestamp}_item_condition.${extension}`;
          const storageRef = ref(storage, fileName);
          const snapshot = await uploadBytes(storageRef, photos.itemCondition);
          return await getDownloadURL(snapshot.ref);
        })(),

        // 물품 라벨 사진
        (async () => {
          const extension = photos.itemLabel.name.split(".").pop();
          const fileName = `rentals/${userId}/${rentalId}_${timestamp}_item_label.${extension}`;
          const storageRef = ref(storage, fileName);
          const snapshot = await uploadBytes(storageRef, photos.itemLabel);
          return await getDownloadURL(snapshot.ref);
        })(),

        // 잠금함 보안 사진
        (async () => {
          const extension = photos.lockboxSecured.name.split(".").pop();
          const fileName = `rentals/${userId}/${rentalId}_${timestamp}_lockbox_secured.${extension}`;
          const storageRef = ref(storage, fileName);
          const snapshot = await uploadBytes(storageRef, photos.lockboxSecured);
          return await getDownloadURL(snapshot.ref);
        })(),
      ];

      const [itemConditionPhotoUrl, itemLabelPhotoUrl, lockboxSecuredPhotoUrl] =
        await Promise.all(uploadPromises);

      return {
        itemConditionPhotoUrl,
        itemLabelPhotoUrl,
        lockboxSecuredPhotoUrl,
      };
    } catch (error) {
      console.error("대여 사진 업로드 오류:", error);
      throw new Error("사진 업로드에 실패했습니다.");
    }
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
      const rentDate = now.toISOString().split("T")[0];

      // 24시간 후를 반납 마감일로 설정
      const dueDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const dueDateString = dueDate.toISOString().split("T")[0];

      // 대여 신청 데이터 생성
      const rentalApplicationData = {
        userId: user.uid,
        itemId: selectedItem.id!,
        itemUniqueId: selectedItem.uniqueId,
        status: "rented" as const,
        rentDate: rentDate,
        dueDate: dueDateString,
        purpose: "즉시 대여", // 기본 목적

        // 학생 정보 (OCR에서 추출된 정보)
        studentId: verifiedStudentInfo.studentId,
        studentName: verifiedStudentInfo.name,
        department: verifiedStudentInfo.department,
        campus: selectedItem.campus,
        phoneNumber: verifiedStudentInfo.phoneNumber,

        // 학생증 정보 (나중에 실제 업로드 URL로 교체)
        studentIdPhotoUrl: studentIdPhotoUrl,
        studentIdVerified: true,

        // 대여 시 촬영 사진들 (나중에 업데이트)
        itemConditionPhotoUrl: "", // 사진 촬영 단계에서 업데이트
        itemLabelPhotoUrl: "", // 사진 촬영 단계에서 업데이트
        lockboxSecuredPhotoUrl: "", // 사진 촬영 단계에서 업데이트
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

      // 생성된 대여 ID를 상태에 저장 (나중에 업데이트할 때 사용)
      setCreatedRentalId(rentalId);
    } catch (error) {
      console.error("대여 신청 생성 오류:", error);
      setErrors({ general: "대여 신청 생성 중 오류가 발생했습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-10 w-10 text-blue-500 mb-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <div className="text-base sm:text-lg">로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>물품 대여 신청 - PNU IBE</title>
      </Head>

      <div className="min-h-screen bg-gray-50 pb-16">
        {/* 헤더 */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4 sm:py-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  물품 대여 신청
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 mt-1">
                  PNU 정보대학 학생회 복지 프로그램
                </p>
              </div>
              <button
                onClick={() => router.push("/")}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md text-sm font-medium"
              >
                홈으로
              </button>
            </div>
          </div>
        </div>

        {/* 진행 단계 표시 - 모바일 뷰 */}
        <div className="bg-white border-b md:hidden">
          <div className="max-w-7xl mx-auto px-3 sm:px-6">
            <div className="py-4">
              <div className="relative">
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                  <div
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
                      step === "verify"
                        ? "w-1/3 bg-blue-500"
                        : step === "select"
                        ? "w-2/3 bg-green-500"
                        : step === "password"
                        ? "w-full bg-green-500"
                        : step === "photos"
                        ? "w-full bg-green-500"
                        : "w-full bg-green-500"
                    }`}
                  ></div>
                </div>
                <div className="flex justify-between">
                  <div
                    className={`${
                      step === "verify"
                        ? "text-blue-600 font-medium"
                        : step === "select"
                        ? "text-green-600"
                        : step === "password"
                        ? "text-blue-600"
                        : step === "photos"
                        ? "text-blue-600"
                        : "text-gray-400"
                    } text-xs`}
                  >
                    학생증 인증
                  </div>
                  <div
                    className={`${
                      step === "select"
                        ? "text-blue-600 font-medium"
                        : step === "password"
                        ? "text-green-600"
                        : step === "photos"
                        ? "text-green-600"
                        : "text-gray-400"
                    } text-xs`}
                  >
                    물품 선택
                  </div>
                  <div
                    className={`${
                      step === "password"
                        ? "text-blue-600 font-medium"
                        : step === "photos"
                        ? "text-green-600"
                        : "text-gray-400"
                    } text-xs`}
                  >
                    비밀번호 제공
                  </div>
                  <div
                    className={`${
                      step === "photos"
                        ? "text-blue-600 font-medium"
                        : "text-gray-400"
                    } text-xs`}
                  >
                    사진 촬영
                  </div>
                  <div
                    className={`${
                      step === "complete"
                        ? "text-blue-600 font-medium"
                        : "text-gray-400"
                    } text-xs`}
                  >
                    신청 완료
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 진행 단계 표시 - 데스크톱 뷰 */}
        <div className="bg-white border-b hidden md:block">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center space-x-4 sm:space-x-8">
                <div
                  className={`flex items-center ${
                    step === "verify"
                      ? "text-blue-600"
                      : step === "select" ||
                        step === "password" ||
                        step === "photos" ||
                        step === "complete"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === "verify"
                        ? "bg-blue-100"
                        : step === "select" ||
                          step === "password" ||
                          step === "photos" ||
                          step === "complete"
                        ? "bg-green-100"
                        : "bg-gray-100"
                    }`}
                  >
                    1
                  </div>
                  <span className="ml-2">학생증 인증</span>
                </div>
                <div
                  className={`w-8 h-px ${
                    step === "select" ||
                    step === "password" ||
                    step === "photos" ||
                    step === "complete"
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                />
                <div
                  className={`flex items-center ${
                    step === "select"
                      ? "text-blue-600"
                      : step === "password"
                      ? "text-green-600"
                      : step === "photos"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === "select"
                        ? "bg-blue-100"
                        : step === "password"
                        ? "bg-green-100"
                        : step === "photos"
                        ? "bg-green-100"
                        : "bg-gray-100"
                    }`}
                  >
                    2
                  </div>
                  <span className="ml-2">물품 선택</span>
                </div>
                <div
                  className={`w-8 h-px ${
                    step === "password" ||
                    step === "photos" ||
                    step === "complete"
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                />
                <div
                  className={`flex items-center ${
                    step === "password"
                      ? "text-blue-600"
                      : step === "photos"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === "password" ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    3
                  </div>
                  <span className="ml-2">비밀번호 제공</span>
                </div>
                <div
                  className={`w-8 h-px ${
                    step === "photos" ? "bg-green-600" : "bg-gray-300"
                  }`}
                />
                <div
                  className={`flex items-center ${
                    step === "photos" ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === "photos" ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    4
                  </div>
                  <span className="ml-2">사진 촬영</span>
                </div>
                <div
                  className={`w-8 h-px ${
                    step === "complete" ? "bg-green-600" : "bg-gray-300"
                  }`}
                />
                <div
                  className={`flex items-center ${
                    step === "complete" ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === "complete" ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    5
                  </div>
                  <span className="ml-2">신청 완료</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="max-w-xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* 에러 메시지 */}
          {errors.general && (
            <div className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-md p-3 sm:p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errors.general}</p>
                </div>
              </div>
            </div>
          )}

          {/* 성공 메시지 */}
          {successMessage && (
            <div className="mb-4 sm:mb-6 bg-green-50 border border-green-200 rounded-md p-3 sm:p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 1: 학생증 인증 */}
          {step === "verify" && (
            <div>
              <StudentIdUpload
                onSuccess={handleStudentIdSuccess}
                onError={handleStudentIdError}
              />
            </div>
          )}

          {/* Step 2: 물품 선택 */}
          {step === "select" && (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">
                대여 가능한 물품
              </h2>

              {isLoading ? (
                <div className="text-center py-8">
                  <svg
                    className="animate-spin h-8 w-8 text-blue-500 mx-auto mb-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <div className="text-sm sm:text-base text-gray-500">
                    물품 목록을 불러오는 중...
                  </div>
                </div>
              ) : availableItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-sm sm:text-base text-gray-500">
                    현재 대여 가능한 물품이 없습니다.
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                  {availableItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow shadow-sm"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-36 sm:h-48 object-cover"
                      />
                      <div className="p-3 sm:p-4">
                        <h3 className="font-medium text-gray-900 text-base sm:mb-2">
                          {item.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                          {item.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {item.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {item.campus === "yangsan"
                              ? "양산캠퍼스"
                              : "장전캠퍼스"}
                          </span>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          상태:{" "}
                          {item.status === "available"
                            ? "대여 가능"
                            : item.status === "rented"
                            ? "대여 중"
                            : item.status === "maintenance"
                            ? "정비 중"
                            : item.status === "lost"
                            ? "분실"
                            : item.status === "damaged"
                            ? "파손"
                            : "알 수 없음"}
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button
                            className="flex-1 text-xs sm:text-sm bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
                            onClick={() => {
                              // 여기에 상세 정보 보기 기능 추가 가능
                              alert(`${item.name}\n\n${item.description}`);
                            }}
                          >
                            상세정보
                          </button>
                          <button
                            className="flex-1 text-xs sm:text-sm bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                            onClick={() => handleItemSelect(item)}
                          >
                            {verifiedStudentInfo || user
                              ? "대여 신청"
                              : "학생증 인증 필요"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: 비밀번호 제공 */}
          {step === "password" && selectedItem && (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  자물쇠 비밀번호 확인
                </h2>
                <button
                  onClick={resetApplication}
                  className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 py-1 px-2 border border-gray-300 rounded"
                >
                  물품 다시 선택
                </button>
              </div>

              {/* 선택된 물품 정보 */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                  선택한 물품
                </h3>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-sm sm:text-base">
                      {selectedItem.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
                      {selectedItem.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedItem.campus === "yangsan"
                        ? "양산캠퍼스"
                        : "장전캠퍼스"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 자물쇠 비밀번호 표시 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-medium text-blue-800 mb-3">
                  🔒 자물쇠 비밀번호
                </h3>
                <div className="bg-white border border-blue-300 rounded-lg p-4 text-center">
                  <p className="text-xs text-blue-600 mb-2">
                    보관함 자물쇠 비밀번호
                  </p>
                  <p className="text-3xl font-mono font-bold text-blue-800 mb-2">
                    {selectedItem.lockboxPassword || "1234"}
                  </p>
                  <p className="text-xs text-blue-600">
                    위치:{" "}
                    {selectedItem.campus === "yangsan"
                      ? "양산캠퍼스"
                      : "장전캠퍼스"}{" "}
                    {selectedItem.location}
                  </p>
                </div>
                <div className="mt-3 text-xs text-blue-700">
                  💡 이 비밀번호로 보관함을 열고 물품을 확인한 후 다음 단계로
                  진행해주세요.
                </div>
              </div>

              {/* 대여 신청 정보 */}
              <div className="border-t pt-4 sm:pt-6">
                <h3 className="font-medium text-gray-900 mb-3 text-sm sm:text-base">
                  대여 신청 정보
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start space-x-3">
                    <div
                      className={`flex items-center justify-center w-5 h-5 border-2 rounded cursor-pointer transition-all duration-200 ${
                        applicationForm.agreement
                          ? "bg-blue-600 border-blue-600"
                          : "bg-white border-gray-300 hover:border-blue-400"
                      }`}
                      onClick={() =>
                        setApplicationForm({
                          ...applicationForm,
                          agreement: !applicationForm.agreement,
                        })
                      }
                    >
                      {applicationForm.agreement && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="text-sm">
                      <label
                        className="font-medium text-gray-700 cursor-pointer"
                        onClick={() =>
                          setApplicationForm({
                            ...applicationForm,
                            agreement: !applicationForm.agreement,
                          })
                        }
                      >
                        대여 약관에 동의합니다
                      </label>
                      <p className="text-xs text-gray-500 mt-1">
                        물품 손상 시 수리비 부담, 연체 시 벌점 부과 등에
                        동의합니다
                      </p>
                    </div>
                  </div>
                  {errors.agreement && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.agreement}
                    </p>
                  )}

                  {/* 상세 약관 내용 */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs">
                    <h4 className="font-medium text-gray-900 mb-2">
                      📋 대여 약관 상세 내용
                    </h4>
                    <div className="space-y-2 text-gray-700">
                      <div>
                        <strong>1. 대여 기간:</strong> 24시간 (익일 같은
                        시간까지)
                      </div>
                      <div>
                        <strong>2. 연체 시:</strong> 하루당 벌점 1점 부과, 3회
                        연체 시 한 달 이용 정지
                      </div>
                      <div>
                        <strong>3. 물품 손상 시:</strong> 수리비 실비 부담
                        (영수증 제공)
                      </div>
                      <div>
                        <strong>4. 물품 분실 시:</strong> 동일 물품 재구매 비용
                        부담
                      </div>
                      <div>
                        <strong>5. 주의사항:</strong> 대여 중 제3자에게 양도
                        금지, 타인 명의 대여 금지
                      </div>
                      <div>
                        <strong>6. 문의:</strong> 정보대학 학생회 (양산캠퍼스
                        학생회실)
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={resetApplication}
                  className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // 신청 정보 유효성 검사
                    const newErrors: { [key: string]: string } = {};

                    if (!applicationForm.agreement) {
                      newErrors.agreement = "약관에 동의해주세요.";
                    }

                    setErrors(newErrors);
                    if (Object.keys(newErrors).length === 0) {
                      setStep("photos");
                    }
                  }}
                  className="px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-md text-xs sm:text-sm font-medium hover:bg-blue-700 shadow-sm"
                >
                  사진 촬영하기
                </button>
              </div>
            </div>
          )}

          {/* Step 4: 사진 촬영 */}
          {step === "photos" && selectedItem && (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  물품 상태 사진 촬영
                </h2>
                <button
                  onClick={resetApplication}
                  className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 py-1 px-2 border border-gray-300 rounded"
                >
                  물품 다시 선택
                </button>
              </div>

              {/* 선택된 물품 정보 */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
                <h3 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                  선택한 물품
                </h3>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <img
                    src={selectedItem.image}
                    alt={selectedItem.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium text-sm sm:text-base">
                      {selectedItem.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-1">
                      {selectedItem.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedItem.campus === "yangsan"
                        ? "양산캠퍼스"
                        : "장전캠퍼스"}
                    </p>
                  </div>
                </div>
              </div>

              {/* 사진 촬영 폼 */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRentalProcess();
                }}
                className="space-y-4 sm:space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    물품 상태 사진 *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        const file = e.target.files[0];
                        setPhotos({ ...photos, itemCondition: file });
                      }
                    }}
                    className="w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                  {errors.itemCondition && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.itemCondition}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    물품 라벨 사진 *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        const file = e.target.files[0];
                        setPhotos({ ...photos, itemLabel: file });
                      }
                    }}
                    className="w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                  {errors.itemLabel && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.itemLabel}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    잠금함 보안 사진 *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files) {
                        const file = e.target.files[0];
                        setPhotos({ ...photos, lockboxSecured: file });
                      }
                    }}
                    className="w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                  />
                  {errors.lockboxSecured && (
                    <p className="text-red-600 text-xs mt-1">
                      {errors.lockboxSecured}
                    </p>
                  )}
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetApplication}
                    className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-md text-xs sm:text-sm font-medium hover:bg-blue-700 disabled:opacity-50 shadow-sm"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        대여 처리 중...
                      </div>
                    ) : (
                      "대여 신청"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 5: 신청 완료 */}
          {step === "complete" && (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  대여 신청 완료
                </h2>
                <button
                  onClick={resetApplication}
                  className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 py-1 px-2 border border-gray-300 rounded"
                >
                  물품 다시 선택
                </button>
              </div>

              {/* 신청 완료 메시지 */}
              <div className="text-center">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-center mb-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">
                    대여가 완료되었습니다!
                  </h3>
                  <p className="text-sm text-green-700">
                    보관함 비밀번호를 확인하고 물품을 수령해주세요.
                  </p>
                </div>

                {selectedItem && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-blue-800 mb-2">
                      보관함 정보
                    </h4>
                    <p className="text-sm text-blue-700 mb-1">
                      위치:{" "}
                      {selectedItem.campus === "yangsan"
                        ? "양산캠퍼스"
                        : "장전캠퍼스"}{" "}
                      {selectedItem.location}
                    </p>
                    <p className="text-sm text-blue-700 mb-2">
                      연락처: {selectedItem.contact}
                    </p>
                    <div className="bg-white border border-blue-300 rounded px-3 py-2">
                      <p className="text-xs text-blue-600 mb-1">비밀번호</p>
                      <p className="text-lg font-mono font-bold text-blue-800">
                        1234
                      </p>
                      <p className="text-xs text-blue-600 mt-1">
                        ※ 보안을 위해 잠시 후 자동으로 숨겨집니다
                      </p>
                    </div>
                  </div>
                )}

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
                  <h4 className="font-medium text-yellow-800 mb-2">
                    📋 다음 단계
                  </h4>
                  <ol className="text-sm text-yellow-700 space-y-1">
                    <li>1. 위 비밀번호로 보관함을 열어주세요</li>
                    <li>2. 대여할 물품의 라벨 ID를 확인해주세요</li>
                    <li>3. 물품 상태를 확인하고 사진을 촬영해주세요</li>
                    <li>4. 사용 후에는 같은 보관함에 반납해주세요</li>
                  </ol>
                </div>

                <button
                  onClick={() => router.push("/rental-status")}
                  className="mt-4 w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 font-medium"
                >
                  내 대여 현황 확인
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
