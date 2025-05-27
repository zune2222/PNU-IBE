import React, { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useAuth } from "../shared/contexts/AuthContext";
import { PhotoUpload } from "../widgets/PhotoUpload";
import {
  rentalApplicationService,
  rentalItemService,
  photoUploadService,
  FirestoreRentalApplication,
  FirestoreRentalItem,
} from "../shared/services/firestore";

export default function ReturnApplication() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentRentals, setCurrentRentals] = useState<
    FirestoreRentalApplication[]
  >([]);
  const [rentalItems, setRentalItems] = useState<{
    [id: string]: FirestoreRentalItem;
  }>({});
  const [selectedRental, setSelectedRental] =
    useState<FirestoreRentalApplication | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"select" | "photos" | "confirm">("select");

  // 사진 업로드 상태
  const [photos, setPhotos] = useState({
    itemPhoto: "",
    lockboxPhoto: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState("");

  // 대여 중인 물품 로드
  useEffect(() => {
    if (user) {
      loadCurrentRentals();
    } else if (!loading) {
      // 로그인하지 않은 경우
      setErrors({ auth: "물품 반납은 로그인 후 이용 가능합니다." });
    }
  }, [user, loading]);

  const loadCurrentRentals = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // 현재 사용자의 대여 중인 물품들 조회
      const userRentals = await rentalApplicationService.getByUserId(user.uid);
      const activeRentals = userRentals.filter(
        (rental) => rental.status === "rented"
      );

      setCurrentRentals(activeRentals);

      // 물품 정보 로드
      const itemsMap: { [id: string]: FirestoreRentalItem } = {};
      for (const rental of activeRentals) {
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
    } catch (error) {
      console.error("대여 중인 물품 로드 오류:", error);
      setErrors({ general: "대여 중인 물품을 불러오는데 실패했습니다." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRentalSelect = (rental: FirestoreRentalApplication) => {
    setSelectedRental(rental);
    setStep("photos");
  };

  const handlePhotoUploadSuccess = (type: "item" | "lockbox", url: string) => {
    setPhotos((prev) => ({
      ...prev,
      [type === "item" ? "itemPhoto" : "lockboxPhoto"]: url,
    }));
  };

  const handlePhotoUploadError = (error: string) => {
    setErrors({ photo: error });
  };

  const validatePhotos = () => {
    const newErrors: { [key: string]: string } = {};

    if (!photos.itemPhoto) {
      newErrors.itemPhoto = "물품 상태 사진을 업로드해주세요.";
    }

    if (!photos.lockboxPhoto) {
      newErrors.lockboxPhoto = "보관함 사진을 업로드해주세요.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitReturn = async () => {
    if (!user) {
      router.push("/auth/login?redirect=/return-application");
      return;
    }

    if (!selectedRental || !validatePhotos()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      // 1. 반납 신청 상태 업데이트
      await rentalApplicationService.updateStatus(
        selectedRental.id!,
        "returned",
        {
          actualReturnDate: new Date().toISOString().split("T")[0],
        }
      );

      // 2. 사진 업로드 기록 저장
      await photoUploadService.createPhotoRecord({
        rentalId: selectedRental.id!,
        userId: user!.uid,
        type: "item_pre_return",
        url: photos.itemPhoto,
        verified: false,
      });

      await photoUploadService.createPhotoRecord({
        rentalId: selectedRental.id!,
        userId: user!.uid,
        type: "lockbox_post_return",
        url: photos.lockboxPhoto,
        verified: false,
      });

      setSuccessMessage(
        "반납 신청이 완료되었습니다! 관리자 확인 후 반납 처리됩니다."
      );
      setStep("confirm");

      // 3초 후 메인 페이지로 이동
      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (error) {
      console.error("반납 신청 오류:", error);
      setErrors({
        general: "반납 신청 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetApplication = () => {
    setSelectedRental(null);
    setPhotos({
      itemPhoto: "",
      lockboxPhoto: "",
    });
    setErrors({});
    setStep("select");
  };

  const isOverdue = (rental: FirestoreRentalApplication) => {
    const today = new Date();
    const endDate = new Date(rental.dueDate);
    return today > endDate;
  };

  const getOverdueDays = (rental: FirestoreRentalApplication) => {
    const today = new Date();
    const endDate = new Date(rental.dueDate);
    const diffTime = today.getTime() - endDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <Head>
        <title>물품 반납 신청 - PNU IBE</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* 헤더 */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  물품 반납 신청
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  대여 중인 물품을 반납 신청하세요
                </p>
              </div>
              <button
                onClick={() => router.push("/")}
                className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium"
              >
                홈으로
              </button>
            </div>
          </div>
        </div>

        {/* 진행 단계 표시 */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center py-4">
              <div className="flex items-center space-x-8">
                <div
                  className={`flex items-center ${
                    step === "select"
                      ? "text-blue-600"
                      : step === "photos" || step === "confirm"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === "select"
                        ? "bg-blue-100"
                        : step === "photos" || step === "confirm"
                        ? "bg-green-100"
                        : "bg-gray-100"
                    }`}
                  >
                    1
                  </div>
                  <span className="ml-2">물품 선택</span>
                </div>
                <div
                  className={`w-8 h-px ${
                    step === "photos" || step === "confirm"
                      ? "bg-green-600"
                      : "bg-gray-300"
                  }`}
                />
                <div
                  className={`flex items-center ${
                    step === "photos"
                      ? "text-blue-600"
                      : step === "confirm"
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === "photos"
                        ? "bg-blue-100"
                        : step === "confirm"
                        ? "bg-green-100"
                        : "bg-gray-100"
                    }`}
                  >
                    2
                  </div>
                  <span className="ml-2">사진 업로드</span>
                </div>
                <div
                  className={`w-8 h-px ${
                    step === "confirm" ? "bg-green-600" : "bg-gray-300"
                  }`}
                />
                <div
                  className={`flex items-center ${
                    step === "confirm" ? "text-blue-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === "confirm" ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    3
                  </div>
                  <span className="ml-2">신청 완료</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* 에러 메시지 */}
          {errors.general && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
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
            <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
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

          {/* Step 1: 물품 선택 */}
          {step === "select" && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                반납할 물품 선택
              </h2>

              {isLoading ? (
                <div className="text-center py-8">
                  <div className="text-gray-500">
                    대여 중인 물품을 불러오는 중...
                  </div>
                </div>
              ) : currentRentals.length === 0 ? (
                <div className="text-center py-8">
                  <div className="mb-4">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                      />
                    </svg>
                  </div>
                  <div className="text-gray-500">
                    현재 대여 중인 물품이 없습니다.
                  </div>
                  <button
                    onClick={() => router.push("/rental-application")}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    물품 대여하기
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {currentRentals.map((rental) => {
                    const item = rentalItems[rental.itemId];
                    const overdueStatus = isOverdue(rental);
                    const daysOverdue = overdueStatus
                      ? getOverdueDays(rental)
                      : 0;

                    return (
                      <div
                        key={rental.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => handleRentalSelect(rental)}
                      >
                        <div className="flex items-center space-x-4">
                          {item?.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded"
                            />
                          )}
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium text-gray-900">
                                {item?.name || "물품 정보 없음"}
                              </h3>
                              {overdueStatus && (
                                <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                                  연체 {daysOverdue}일
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              {item?.description || "설명 없음"}
                            </p>
                            <div className="mt-2 text-sm text-gray-500">
                              <p>
                                대여 기간: {rental.rentDate} ~ {rental.dueDate}
                              </p>
                              <p>대여 목적: {rental.purpose}</p>
                            </div>
                            {overdueStatus && (
                              <div className="mt-2 text-sm text-red-600">
                                <p>
                                  ⚠️ 반납 예정일이 {daysOverdue}일 지났습니다.
                                  빠른 반납 부탁드립니다.
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                              반납 신청
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 2: 사진 업로드 */}
          {step === "photos" && selectedRental && (
            <div className="space-y-6">
              {/* 선택된 물품 정보 */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">
                    반납 물품 정보
                  </h2>
                  <button
                    onClick={resetApplication}
                    className="text-sm text-gray-600 hover:text-gray-800"
                  >
                    다른 물품 선택
                  </button>
                </div>

                <div className="flex items-center space-x-4">
                  {rentalItems[selectedRental.itemId]?.image && (
                    <img
                      src={rentalItems[selectedRental.itemId].image}
                      alt={rentalItems[selectedRental.itemId].name}
                      className="w-16 h-16 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {rentalItems[selectedRental.itemId]?.name ||
                        "물품 정보 없음"}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {rentalItems[selectedRental.itemId]?.description ||
                        "설명 없음"}
                    </p>
                    <p className="text-sm text-gray-500">
                      대여 기간: {selectedRental.rentDate} ~{" "}
                      {selectedRental.dueDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* 물품 상태 사진 업로드 */}
              <div>
                <PhotoUpload
                  type="item_pre_return"
                  label="1. 물품 상태 사진"
                  description="반납하기 전 물품의 현재 상태를 촬영해주세요"
                  required
                  onUploadSuccess={(url) =>
                    handlePhotoUploadSuccess("item", url)
                  }
                  onError={handlePhotoUploadError}
                  isLoading={isLoading}
                />
                {errors.itemPhoto && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.itemPhoto}
                  </p>
                )}
              </div>

              {/* 보관함 사진 업로드 */}
              <div>
                <PhotoUpload
                  type="lockbox_post_return"
                  label="2. 보관함 사진"
                  description="물품을 보관함에 넣고 잠근 후 촬영해주세요"
                  required
                  onUploadSuccess={(url) =>
                    handlePhotoUploadSuccess("lockbox", url)
                  }
                  onError={handlePhotoUploadError}
                  isLoading={isLoading}
                />
                {errors.lockboxPhoto && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.lockboxPhoto}
                  </p>
                )}
              </div>

              {/* 반납 신청 버튼 */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={resetApplication}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    취소
                  </button>
                  <button
                    onClick={handleSubmitReturn}
                    disabled={
                      isLoading || !photos.itemPhoto || !photos.lockboxPhoto
                    }
                    className="px-6 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
                  >
                    {isLoading ? "신청 중..." : "반납 신청"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: 신청 완료 */}
          {step === "confirm" && (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="mb-6">
                <svg
                  className="mx-auto h-16 w-16 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                반납 신청 완료!
              </h2>
              <p className="text-gray-600 mb-6">
                관리자가 업로드된 사진을 확인한 후 반납 처리를 완료합니다.
                <br />
                처리 완료 시 알림을 보내드리겠습니다.
              </p>
              <button
                onClick={() => router.push("/")}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                홈으로 돌아가기
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
