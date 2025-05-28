import React, { useState } from "react";
import {
  FirestoreNotice,
  noticeService,
} from "../../shared/services/firestore";

interface NoticeManagementProps {
  notices: FirestoreNotice[];
  isLoading: boolean;
  loadData: () => void;
}

export default function NoticeManagement({
  notices,
  isLoading,
  loadData,
}: NoticeManagementProps) {
  const [noticeForm, setNoticeForm] = useState({
    id: "",
    title: "",
    category: "",
    content: "",
    preview: "",
    important: false,
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && noticeForm.id) {
        await noticeService.update(noticeForm.id, {
          title: noticeForm.title,
          category: noticeForm.category,
          content: noticeForm.content,
          preview: noticeForm.preview,
          important: noticeForm.important,
        });
        alert("공지사항이 수정되었습니다!");
      } else {
        await noticeService.add({
          title: noticeForm.title,
          category: noticeForm.category,
          content: noticeForm.content,
          preview: noticeForm.preview,
          important: noticeForm.important,
          views: 0,
        });
        alert("공지사항이 추가되었습니다!");
      }

      resetNoticeForm();
      loadData();
    } catch (error) {
      console.error("공지사항 저장 오류:", error);
      alert("저장에 실패했습니다.");
    }
  };

  const editNotice = (notice: FirestoreNotice) => {
    setNoticeForm({
      id: notice.id || "",
      title: notice.title,
      category: notice.category,
      content: notice.content,
      preview: notice.preview,
      important: notice.important,
    });
    setIsEditing(true);
  };

  const deleteNotice = async (id: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await noticeService.delete(id);
      alert("공지사항이 삭제되었습니다!");
      loadData();
    } catch (error) {
      console.error("공지사항 삭제 오류:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  const resetNoticeForm = () => {
    setNoticeForm({
      id: "",
      title: "",
      category: "",
      content: "",
      preview: "",
      important: false,
    });
    setIsEditing(false);
  };

  return (
    <div className="mt-6">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* 공지사항 폼 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">
            {isEditing ? "공지사항 수정" : "새 공지사항 작성"}
          </h2>

          <form onSubmit={handleNoticeSubmit} className="space-y-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                제목
              </label>
              <input
                type="text"
                required
                value={noticeForm.title}
                onChange={(e) =>
                  setNoticeForm({
                    ...noticeForm,
                    title: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                카테고리
              </label>
              <select
                required
                value={noticeForm.category}
                onChange={(e) =>
                  setNoticeForm({
                    ...noticeForm,
                    category: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">카테고리 선택</option>
                <option value="일반">일반</option>
                <option value="학생회">학생회</option>
                <option value="행사">행사</option>
                <option value="학사">학사</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                미리보기
              </label>
              <textarea
                required
                rows={2}
                value={noticeForm.preview}
                onChange={(e) =>
                  setNoticeForm({
                    ...noticeForm,
                    preview: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="공지사항 미리보기 텍스트"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                내용
              </label>
              <textarea
                required
                rows={6}
                value={noticeForm.content}
                onChange={(e) =>
                  setNoticeForm({
                    ...noticeForm,
                    content: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="공지사항 내용 (HTML 태그 사용 가능)"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="important"
                checked={noticeForm.important}
                onChange={(e) =>
                  setNoticeForm({
                    ...noticeForm,
                    important: e.target.checked,
                  })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="important"
                className="ml-2 block text-xs sm:text-sm text-gray-900"
              >
                중요 공지사항
              </label>
            </div>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {isLoading ? "저장 중..." : isEditing ? "수정" : "추가"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetNoticeForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                >
                  취소
                </button>
              )}
            </div>
          </form>
        </div>

        {/* 공지사항 목록 */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-medium mb-4">
            공지사항 목록
          </h2>

          <div className="space-y-3 max-h-80 sm:max-h-96 overflow-y-auto">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="border border-gray-200 rounded-lg p-3 sm:p-4"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start">
                  <div className="flex-1 mb-3 sm:mb-0">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base">
                      {notice.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">
                      {notice.category}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1 line-clamp-2">
                      {notice.preview}
                    </p>
                    {notice.important && (
                      <span className="inline-block mt-2 px-2 py-1 text-xs bg-red-100 text-red-800 rounded">
                        중요
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2 w-full sm:w-auto sm:ml-4">
                    <button
                      onClick={() => editNotice(notice)}
                      className="flex-1 sm:flex-none text-blue-600 hover:text-blue-800 text-xs sm:text-sm px-2 py-1 border border-blue-200 rounded"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => deleteNotice(notice.id!)}
                      className="flex-1 sm:flex-none text-red-600 hover:text-red-800 text-xs sm:text-sm px-2 py-1 border border-red-200 rounded"
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
