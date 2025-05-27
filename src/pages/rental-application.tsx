import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "../shared/contexts/AuthContext";
import { StudentIdUpload } from "../widgets/StudentIdUpload";
import {
  userService,
  rentalItemService,
  rentalApplicationService,
  FirestoreRentalItem,
  FirestoreUser,
} from "../shared/services/firestore";
import { StudentIdInfo } from "../shared/services/ocrService";

export default function RentalApplication() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<FirestoreUser | null>(null);
  const [availableItems, setAvailableItems] = useState<FirestoreRentalItem[]>(
    []
  );
  const [selectedItem, setSelectedItem] = useState<FirestoreRentalItem | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"verify" | "select" | "apply">("verify");
  const [verifiedStudentInfo, setVerifiedStudentInfo] =
    useState<StudentIdInfo | null>(null);

  // 대여 신청 폼 상태
  const [applicationForm, setApplicationForm] = useState({
    purpose: "",
    startDate: "",
    endDate: "",
    agreement: false,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  // 사용자 정보 확인
  useEffect(() => {
    if (user) {
      checkUserStatus();
    }
  }, [user]);

  // 물품 목록 로드
  useEffect(() => {
    if (step === "select") {
      loadAvailableItems();
    }
  }, [step]);

  const checkUserStatus = async () => {
    if (!user) return;

    try {
      const userData = await userService.getByUid(user.uid);

      if (userData && userData.studentIdVerified) {
        setCurrentUser(userData);
        setStep("select");
      } else {
        setStep("verify");
      }
    } catch (error) {
      console.error("사용자 상태 확인 오류:", error);
      setStep("verify");
    }
  };

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

  const handleStudentIdSuccess = (studentInfoData: StudentIdInfo) => {
    setSuccessMessage("학생증 인증이 완료되었습니다!");
    setVerifiedStudentInfo(studentInfoData);

    // 인증 완료 메시지 표시
    setTimeout(() => {
      setSuccessMessage(
        "학생 인증이 완료되었습니다. 물품을 둘러보시거나 대여하려면 로그인이 필요합니다."
      );
    }, 2000);
  };

  const handleStudentIdError = (error: string) => {
    setErrors({ general: error });
  };

  const handleItemSelect = (item: FirestoreRentalItem) => {
    if (!user) {
      // 로그인하지 않은 경우 로그인 페이지로 안내 (학생증 정보를 쿼리 파라미터로 전달)
      let studentIdParam = "";
      let nameParam = "";

      if (verifiedStudentInfo) {
        if (verifiedStudentInfo.studentId) {
          studentIdParam = `&studentId=${verifiedStudentInfo.studentId}`;
        }
        if (verifiedStudentInfo.name) {
          nameParam = `&name=${encodeURIComponent(verifiedStudentInfo.name)}`;
        }
      }

      router.push(
        `/auth/login?redirect=/rental-application${studentIdParam}${nameParam}`
      );
      return;
    }

    setSelectedItem(item);
    setStep("apply");
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!applicationForm.purpose.trim()) {
      newErrors.purpose = "대여 목적을 입력해주세요.";
    }

    if (!applicationForm.startDate) {
      newErrors.startDate = "대여 시작일을 선택해주세요.";
    }

    if (!applicationForm.endDate) {
      newErrors.endDate = "반납 예정일을 선택해주세요.";
    }

    if (applicationForm.startDate && applicationForm.endDate) {
      const start = new Date(applicationForm.startDate);
      const end = new Date(applicationForm.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (start < today) {
        newErrors.startDate = "대여 시작일은 오늘 이후여야 합니다.";
      }

      if (end <= start) {
        newErrors.endDate = "반납일은 대여 시작일 이후여야 합니다.";
      }

      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 14) {
        newErrors.endDate = "대여 기간은 최대 14일까지 가능합니다.";
      }
    }

    if (!applicationForm.agreement) {
      newErrors.agreement = "대여 약관에 동의해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !selectedItem || !currentUser) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const applicationData = {
        userId: currentUser.uid,
        itemId: selectedItem.id!,
        itemUniqueId: selectedItem.uniqueId,
        status: "pending" as const,
        startDate: applicationForm.startDate,
        endDate: applicationForm.endDate,
        purpose: applicationForm.purpose,
        studentIdPhotoUrl: currentUser.studentIdPhotoUrl || "",
        studentIdVerified: currentUser.studentIdVerified,
      };

      await rentalApplicationService.createApplication(applicationData);

      setSuccessMessage(
        "대여 신청이 완료되었습니다! 승인까지 최대 1-2일 소요됩니다."
      );

      // 3초 후 메인 페이지로 이동
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("대여 신청 오류:", error);
      setErrors({
        general: "대여 신청 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetApplication = () => {
    setSelectedItem(null);
    setApplicationForm({
      purpose: "",
      startDate: "",
      endDate: "",
      agreement: false,
    });
    setErrors({});
    setStep("select");
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
                        : "w-full bg-green-500"
                    }`}
                  ></div>
                </div>
                <div className="flex justify-between">
                  <div
                    className={`${
                      step === "verify"
                        ? "text-blue-600 font-medium"
                        : "text-green-600"
                    } text-xs`}
                  >
                    학생증 인증
                  </div>
                  <div
                    className={`${
                      step === "select"
                        ? "text-blue-600 font-medium"
                        : step === "apply"
                        ? "text-green-600"
                        : "text-gray-400"
                    } text-xs`}
                  >
                    물품 선택
                  </div>
                  <div
                    className={`${
                      step === "apply"
                        ? "text-blue-600 font-medium"
                        : "text-gray-400"
                    } text-xs`}
                  >
                    신청서 작성
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
                      : step === "select" || step === "apply"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === "verify"
                        ? "bg-blue-100"
                        : step === "select" || step === "apply"
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
                    step === "select" || step === "apply"
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                />
                <div
                  className={`flex items-center ${
                    step === "select"
                      ? "text-blue-600"
                      : step === "apply"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === "select"
                        ? "bg-blue-100"
                        : step === "apply"
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
                    step === "apply" ? "bg-green-600" : "bg-gray-300"
                  }`}
                />
                <div
                  className={`flex items-center ${
                    step === "apply" ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === "apply" ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    3
                  </div>
                  <span className="ml-2">신청서 작성</span>
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
                  {/* 인증 완료 후 물품 보기 및 로그인 버튼 */}
                  {verifiedStudentInfo && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => setStep("select")}
                        className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-200"
                      >
                        대여 가능한 물품 보기
                      </button>
                      {!user && (
                        <button
                          onClick={() => {
                            let studentIdParam = "";
                            let nameParam = "";

                            if (verifiedStudentInfo) {
                              if (verifiedStudentInfo.studentId) {
                                studentIdParam = `&studentId=${verifiedStudentInfo.studentId}`;
                              }
                              if (verifiedStudentInfo.name) {
                                nameParam = `&name=${encodeURIComponent(
                                  verifiedStudentInfo.name
                                )}`;
                              }
                            }

                            router.push(
                              `/auth/login?redirect=/rental-application${studentIdParam}${nameParam}`
                            );
                          }}
                          className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
                        >
                          로그인하고 대여하기
                        </button>
                      )}
                    </div>
                  )}
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
                          재고: {item.availableQuantity}/{item.totalQuantity}
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
                            {user ? "대여 신청" : "로그인하고 대여"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: 신청서 작성 */}
          {step === "apply" && selectedItem && (
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  대여 신청서
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

              {/* 신청 폼 */}
              <form
                onSubmit={handleSubmitApplication}
                className="space-y-4 sm:space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                    대여 목적 *
                  </label>
                  <textarea
                    value={applicationForm.purpose}
                    onChange={(e) =>
                      setApplicationForm({
                        ...applicationForm,
                        purpose: e.target.value,
                      })
                    }
                    className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                      errors.purpose ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="대여 목적을 구체적으로 설명해주세요"
                    rows={3}
                  />
                  {errors.purpose && (
                    <p className="mt-1 text-xs sm:text-sm text-red-600">
                      {errors.purpose}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      대여 시작일 *
                    </label>
                    <input
                      type="date"
                      value={applicationForm.startDate}
                      onChange={(e) =>
                        setApplicationForm({
                          ...applicationForm,
                          startDate: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                        errors.startDate ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {errors.startDate && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600">
                        {errors.startDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      반납 예정일 *
                    </label>
                    <input
                      type="date"
                      value={applicationForm.endDate}
                      onChange={(e) =>
                        setApplicationForm({
                          ...applicationForm,
                          endDate: e.target.value,
                        })
                      }
                      className={`w-full px-3 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base ${
                        errors.endDate ? "border-red-300" : "border-gray-300"
                      }`}
                    />
                    {errors.endDate && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600">
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* 대여 약관 */}
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                    대여 약관
                  </h4>
                  <div className="text-xs sm:text-sm text-gray-600 space-y-1 sm:space-y-2">
                    <p>• 대여 기간은 최대 14일까지 가능합니다.</p>
                    <p>• 연체 시 벌점이 부과됩니다 (1일당 1점).</p>
                    <p>• 물품 분실 또는 파손 시 배상 책임이 있습니다.</p>
                    <p>• 대여 물품은 타인에게 양도할 수 없습니다.</p>
                    <p>
                      • 수령 및 반납 시 물품 상태를 사진으로 촬영해야 합니다.
                    </p>
                  </div>

                  <div className="mt-3 sm:mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={applicationForm.agreement}
                        onChange={(e) =>
                          setApplicationForm({
                            ...applicationForm,
                            agreement: e.target.checked,
                          })
                        }
                        className="w-4 h-4 mr-2 text-blue-600"
                      />
                      <span className="text-xs sm:text-sm text-gray-700">
                        위 약관을 읽고 동의합니다 *
                      </span>
                    </label>
                    {errors.agreement && (
                      <p className="mt-1 text-xs sm:text-sm text-red-600">
                        {errors.agreement}
                      </p>
                    )}
                  </div>
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
                        신청 중...
                      </div>
                    ) : (
                      "대여 신청"
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
