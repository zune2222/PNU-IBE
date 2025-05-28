import React from "react";
import { NextRouter } from "next/router";

interface CompleteStepProps {
  router: NextRouter;
}

export default function CompleteStep({ router }: CompleteStepProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-8 text-center">
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
      <h2 className="text-2xl font-bold text-gray-900 mb-4">반납 완료!</h2>
      <p className="text-gray-600 mb-6">
        물품 반납이 성공적으로 완료되었습니다.
        <br />
        이용해주셔서 감사합니다!
      </p>
      <button
        onClick={() => router.push("/")}
        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}
