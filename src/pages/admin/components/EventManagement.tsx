import React, { useState } from "react";
import {
  FirestoreEvent,
  eventService,
} from "../../../shared/services/firestore";
import { storageService } from "../../../shared/services/storage";

interface EventManagementProps {
  events: FirestoreEvent[];
  isLoading: boolean;
  loadData: () => void;
}

export default function EventManagement({
  events,
  isLoading,
  loadData,
}: EventManagementProps) {
  const [eventForm, setEventForm] = useState({
    id: "",
    title: "",
    category: "",
    description: "",
    content: "",
    date: "",
    time: "",
    location: "",
    image: "",
    status: "upcoming" as "upcoming" | "ongoing" | "completed",
    organizer: "",
    contact: "",
    registrationRequired: false,
    registrationDeadline: "",
    featured: false,
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = eventForm.image;

      // 새 이미지가 선택된 경우 업로드
      if (selectedImage) {
        setUploadProgress(0);
        const uploadResult = await storageService.uploadFileWithProgress(
          selectedImage,
          "events/images",
          undefined,
          (progress) => setUploadProgress(progress.progress)
        );
        imageUrl = uploadResult.url;
      }

      const eventData = {
        title: eventForm.title,
        category: eventForm.category,
        description: eventForm.description,
        content: eventForm.content,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.location,
        image: imageUrl,
        status: eventForm.status,
        organizer: eventForm.organizer,
        contact: eventForm.contact,
        registrationRequired: eventForm.registrationRequired,
        registrationDeadline: eventForm.registrationDeadline,
        featured: eventForm.featured,
      };

      if (isEditing && eventForm.id) {
        await eventService.update(eventForm.id, eventData);
        alert("행사 정보가 수정되었습니다!");
      } else {
        await eventService.add(eventData);
        alert("행사가 추가되었습니다!");
      }

      resetEventForm();
      loadData();
    } catch (error) {
      console.error("행사 저장 오류:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setUploadProgress(0);
    }
  };

  const editEvent = (event: FirestoreEvent) => {
    setEventForm({
      id: event.id || "",
      title: event.title,
      category: event.category,
      description: event.description,
      content: event.content || "",
      date: event.date,
      time: event.time,
      location: event.location,
      image: event.image,
      status: event.status,
      organizer: event.organizer || "",
      contact: event.contact || "",
      registrationRequired: event.registrationRequired || false,
      registrationDeadline: event.registrationDeadline || "",
      featured: event.featured || false,
    });
    setIsEditing(true);
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await eventService.delete(id);
      alert("행사가 삭제되었습니다!");
      loadData();
    } catch (error) {
      console.error("행사 삭제 오류:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  const resetEventForm = () => {
    setEventForm({
      id: "",
      title: "",
      category: "",
      description: "",
      content: "",
      date: "",
      time: "",
      location: "",
      image: "",
      status: "upcoming",
      organizer: "",
      contact: "",
      registrationRequired: false,
      registrationDeadline: "",
      featured: false,
    });
    setSelectedImage(null);
    setIsEditing(false);
  };

  return (
    <div className="mt-6">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* 행사 폼 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">
            {isEditing ? "행사 수정" : "새 행사 등록"}
          </h2>

          <form onSubmit={handleEventSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                제목
              </label>
              <input
                type="text"
                required
                value={eventForm.title}
                onChange={(e) =>
                  setEventForm({ ...eventForm, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  카테고리
                </label>
                <select
                  required
                  value={eventForm.category}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">카테고리 선택</option>
                  <option value="학술">학술</option>
                  <option value="체육">체육</option>
                  <option value="문화">문화</option>
                  <option value="취업">취업</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  상태
                </label>
                <select
                  required
                  value={eventForm.status}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      status: e.target.value as
                        | "upcoming"
                        | "ongoing"
                        | "completed",
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="upcoming">예정</option>
                  <option value="ongoing">진행중</option>
                  <option value="completed">완료</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  날짜
                </label>
                <input
                  type="date"
                  required
                  value={eventForm.date}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시간
                </label>
                <input
                  type="time"
                  required
                  value={eventForm.time}
                  onChange={(e) =>
                    setEventForm({ ...eventForm, time: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                장소
              </label>
              <input
                type="text"
                required
                value={eventForm.location}
                onChange={(e) =>
                  setEventForm({
                    ...eventForm,
                    location: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                설명
              </label>
              <textarea
                required
                rows={3}
                value={eventForm.description}
                onChange={(e) =>
                  setEventForm({
                    ...eventForm,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                콘텐츠 (HTML 가능)
              </label>
              <textarea
                rows={10}
                value={eventForm.content}
                onChange={(e) =>
                  setEventForm({
                    ...eventForm,
                    content: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="행사 상세 내용 (HTML 태그 사용 가능)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이미지
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {uploadProgress > 0 && (
                <div className="mt-2">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {uploadProgress.toFixed(1)}%
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  주최자
                </label>
                <input
                  type="text"
                  value={eventForm.organizer}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      organizer: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  연락처
                </label>
                <input
                  type="text"
                  value={eventForm.contact}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      contact: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="registrationRequired"
                  checked={eventForm.registrationRequired}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      registrationRequired: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="registrationRequired"
                  className="ml-2 block text-sm text-gray-900"
                >
                  사전 신청 필요
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="featured"
                  checked={eventForm.featured}
                  onChange={(e) =>
                    setEventForm({
                      ...eventForm,
                      featured: e.target.checked,
                    })
                  }
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="featured"
                  className="ml-2 block text-sm text-gray-900"
                >
                  추천 행사
                </label>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "저장 중..." : isEditing ? "수정" : "추가"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetEventForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  취소
                </button>
              )}
            </div>
          </form>
        </div>

        {/* 행사 목록 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">행사 목록</h2>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {events.map((event) => (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{event.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {event.category} • {event.date} {event.time}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {event.location}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span
                        className={`inline-block px-2 py-1 text-xs rounded ${
                          event.status === "upcoming"
                            ? "bg-blue-100 text-blue-800"
                            : event.status === "ongoing"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {event.status === "upcoming"
                          ? "예정"
                          : event.status === "ongoing"
                          ? "진행중"
                          : "완료"}
                      </span>
                      {event.featured && (
                        <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">
                          추천
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => editEvent(event)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => deleteEvent(event.id!)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
