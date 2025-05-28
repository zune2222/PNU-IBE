import React, { useState } from "react";
import Image from "next/image";
import {
  FirestoreRentalItem,
  rentalItemService,
} from "../../shared/services/firestore";
import { storageService } from "../../shared/services/storage";

interface ItemManagementProps {
  rentalItems: { [id: string]: FirestoreRentalItem };
  isLoading: boolean;
  loadData: () => void;
}

export default function ItemManagement({
  rentalItems,
  isLoading,
  loadData,
}: ItemManagementProps) {
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

  const handleItemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemForm.name || !itemForm.category || !itemForm.description) {
      alert("필수 정보를 모두 입력해주세요.");
      return;
    }

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

    try {
      await rentalItemService.delete(id);
      alert("물품이 삭제되었습니다.");
      loadData();
    } catch (error) {
      console.error("물품 삭제 오류:", error);
      alert("물품 삭제에 실패했습니다.");
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

  return (
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

            <div className="grid grid-cols-2 gap-4">
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
                  <Image
                    src={itemForm.image}
                    alt="물품 이미지"
                    width={128}
                    height={128}
                    className="object-cover rounded-lg border"
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
                {isLoading ? "저장 중..." : isEditingItem ? "수정" : "추가"}
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
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="object-cover rounded-lg"
                          />
                        )}
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.category} •{" "}
                            {item.campus === "yangsan" ? "양산" : "장전"}
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
  );
}
