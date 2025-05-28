import React, { useState } from "react";
import {
  FirestoreLockboxPassword,
  lockboxPasswordService,
} from "../../../shared/services/firestore";

interface LockboxManagementProps {
  lockboxPasswords: FirestoreLockboxPassword[];
  isLoading: boolean;
  loadData: () => void;
  userEmail: string;
}

export default function LockboxManagement({
  lockboxPasswords,
  isLoading,
  loadData,
  userEmail,
}: LockboxManagementProps) {
  const [lockboxForm, setLockboxForm] = useState({
    campus: "yangsan" as "yangsan" | "jangjeom",
    location: "",
    newPassword: "",
  });

  const handleLockboxPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lockboxForm.location || !lockboxForm.newPassword) {
      alert("위치와 새 비밀번호를 입력해주세요.");
      return;
    }

    try {
      await lockboxPasswordService.updatePassword(
        lockboxForm.campus,
        lockboxForm.location,
        lockboxForm.newPassword,
        userEmail || "관리자"
      );
      alert("보관함 비밀번호가 변경되었습니다.");
      setLockboxForm({
        campus: "yangsan",
        location: "",
        newPassword: "",
      });
      loadData();
    } catch (error) {
      console.error("비밀번호 변경 오류:", error);
      alert("비밀번호 변경에 실패했습니다.");
    }
  };

  return (
    <div className="mt-6">
      <div className="grid lg:grid-cols-2 gap-8">
        {/* 보관함 비밀번호 폼 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">보관함 비밀번호 설정</h2>

          <form onSubmit={handleLockboxPasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                캠퍼스
              </label>
              <select
                value={lockboxForm.campus}
                onChange={(e) =>
                  setLockboxForm({
                    ...lockboxForm,
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
                위치
              </label>
              <input
                type="text"
                value={lockboxForm.location}
                onChange={(e) =>
                  setLockboxForm({
                    ...lockboxForm,
                    location: e.target.value,
                  })
                }
                placeholder="예: 정보대학 학생회실"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                새 비밀번호
              </label>
              <input
                type="password"
                value={lockboxForm.newPassword}
                onChange={(e) =>
                  setLockboxForm({
                    ...lockboxForm,
                    newPassword: e.target.value,
                  })
                }
                placeholder="숫자 4-6자리"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "저장 중..." : "비밀번호 변경"}
              </button>
            </div>
          </form>
        </div>

        {/* 현재 보관함 비밀번호 목록 */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium mb-4">현재 보관함 비밀번호</h2>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {lockboxPasswords.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                설정된 보관함 비밀번호가 없습니다.
              </div>
            ) : (
              lockboxPasswords.map((lockbox) => (
                <div
                  key={lockbox.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">
                        {lockbox.campus === "yangsan"
                          ? "양산캠퍼스"
                          : "장전캠퍼스"}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        위치: {lockbox.location}
                      </p>
                      <p className="text-lg font-mono text-blue-600 mt-2">
                        비밀번호: {lockbox.currentPassword}
                      </p>
                      <div className="text-xs text-gray-400 mt-2">
                        <p>
                          변경일:{" "}
                          {lockbox.lastChangedAt?.toDate().toLocaleString()}
                        </p>
                        <p>변경자: {lockbox.lastChangedBy}</p>
                      </div>
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
