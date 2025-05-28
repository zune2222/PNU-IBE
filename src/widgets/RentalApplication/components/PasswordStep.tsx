import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useToast } from "../../../shared/components/Toast";
import {
  FirestoreRentalItem,
  rentalApplicationService,
} from "../../../shared/services/firestore";
import { discordService } from "../../../shared/services/discordService";
import { useAuth } from "../../../shared/contexts/AuthContext";
import { RentalApplicationForm, ExtendedStudentIdInfo } from "../types";

interface PasswordStepProps {
  selectedItem: FirestoreRentalItem;
  applicationForm: RentalApplicationForm;
  verifiedStudentInfo: ExtendedStudentIdInfo;
  onApplicationFormChange: (form: RentalApplicationForm) => void;
  onNextStep: () => void;
  onReset: () => void;
  onRentalCompleted: (rentalId: string) => void;
}

export const PasswordStep: React.FC<PasswordStepProps> = ({
  selectedItem,
  applicationForm,
  verifiedStudentInfo,
  onApplicationFormChange,
  onNextStep,
  onReset,
  onRentalCompleted,
}) => {
  const { showToast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async () => {
    // 신청 정보 유효성 검사
    if (!applicationForm.agreement) {
      showToast({
        type: "error",
        message: "약관에 동의해주세요.",
      });
      return;
    }

    if (!user) {
      showToast({
        type: "error",
        message: "로그인이 필요합니다.",
      });
      return;
    }

    // 학생 정보 필수 필드 확인
    if (
      !verifiedStudentInfo.name ||
      !verifiedStudentInfo.studentId ||
      !verifiedStudentInfo.department
    ) {
      showToast({
        type: "error",
        message: "학생 정보가 완전하지 않습니다. 다시 인증해주세요.",
      });
      return;
    }

    try {
      showToast({
        type: "info",
        message: "대여를 진행하고 있습니다...",
      });

      // 대여 완료 처리 - 여기서 실제 대여가 완료됨
      const today = new Date();
      const dueDate = new Date(today);
      dueDate.setDate(today.getDate() + 1); // 24시간 후

      const rentalData = {
        userId: user.uid,
        itemId: selectedItem.id!,
        itemUniqueId: selectedItem.uniqueId,
        status: "rented" as const,
        rentDate: today.toISOString().split("T")[0],
        dueDate: dueDate.toISOString().split("T")[0],
        purpose: "즉시 대여", // 셀프 서비스는 목적을 기본값으로 설정

        // 학생 정보
        studentId: verifiedStudentInfo.studentId,
        studentName: verifiedStudentInfo.name,
        department: verifiedStudentInfo.department,
        campus: selectedItem.campus,
        phoneNumber: verifiedStudentInfo.phoneNumber,

        // 학생증 정보 (이미 인증 완료)
        studentIdPhotoUrl: verifiedStudentInfo.studentIdPhotoUrl || "",
        studentIdVerified: true,

        // 대여 시 촬영 사진들 (임시 값 - 다음 단계에서 업데이트 예정)
        itemConditionPhotoUrl: "",
        itemLabelPhotoUrl: "",
        lockboxSecuredPhotoUrl: "",
      };

      // Firestore에 대여 데이터 저장
      const rentalId = await rentalApplicationService.processRental(rentalData);

      // 디스코드 알림 전송
      const discordNotificationData = {
        studentName: verifiedStudentInfo.name,
        studentId: verifiedStudentInfo.studentId,
        department: verifiedStudentInfo.department,
        phoneNumber: verifiedStudentInfo.phoneNumber,
        itemName: selectedItem.name,
        itemCategory: selectedItem.category,
        campus: selectedItem.campus,
        location: selectedItem.location,
        rentDate: today.toISOString().split("T")[0],
        dueDate: dueDate.toISOString().split("T")[0],
        rentalId: rentalId,
      };

      // 디스코드 알림 전송 (실패해도 대여는 완료됨)
      try {
        await discordService.notifyInstantRental(discordNotificationData);
      } catch (discordError) {
        console.warn("디스코드 알림 전송 실패:", discordError);
      }

      showToast({
        type: "success",
        message: "대여가 완료되었습니다! 보관함에서 물품을 확인해주세요.",
      });

      // 대여 완료 상태를 상위 컴포넌트에 전달
      onRentalCompleted(rentalId);

      // 다음 단계로 이동
      onNextStep();
    } catch (error) {
      console.error("대여 처리 오류:", error);
      showToast({
        type: "error",
        message: "대여 처리 중 오류가 발생했습니다. 다시 시도해주세요.",
      });
    }
  };

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-6 sm:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-4">
          <span className="w-2 h-2 bg-primary rounded-full mr-3 animate-pulse"></span>
          <span className="text-sm font-semibold text-primary korean-text">
            3단계: 비밀번호 확인
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-dark to-gray-700 bg-clip-text text-transparent korean-text mb-2">
          자물쇠 비밀번호 확인
        </h2>
        <p className="text-gray-600 korean-text">
          보관함 비밀번호를 확인하고 물품을 찾아주세요
        </p>
      </motion.div>

      {/* 선택된 물품 정보 */}
      <motion.div
        className="bg-gradient-to-br from-gray-50/80 to-gray-100/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-200/60"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <h3 className="font-semibold text-gray-900 mb-4 korean-text flex items-center">
          <span className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></span>
          선택한 물품
        </h3>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Image
              src={selectedItem.image}
              alt={selectedItem.name}
              width={80}
              height={80}
              className="object-cover rounded-xl shadow-lg"
            />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center">
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
            </div>
          </div>
          <div className="flex-1">
            <p className="font-bold text-lg text-gray-900 korean-text">
              {selectedItem.name}
            </p>
            <p className="text-sm text-gray-600 line-clamp-2 korean-text leading-relaxed">
              {selectedItem.description}
            </p>
            <div className="flex items-center mt-2">
              <span className="px-2 py-1 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary text-xs font-medium rounded-full border border-primary/20">
                {selectedItem.campus === "yangsan"
                  ? "양산캠퍼스"
                  : "장전캠퍼스"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 자물쇠 비밀번호 표시 */}
      <motion.div
        className="bg-gradient-to-br from-blue-50/90 to-indigo-50/90 backdrop-blur-sm border border-blue-200/60 rounded-2xl p-6 mb-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mr-3">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h3 className="font-bold text-blue-800 korean-text">
            자물쇠 비밀번호
          </h3>
        </div>

        <motion.div
          className="bg-white/90 backdrop-blur-sm border border-blue-300/60 rounded-xl p-6 text-center shadow-lg"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm text-blue-600 mb-2 korean-text">
            보관함 자물쇠 비밀번호
          </p>
          <motion.p
            className="text-4xl font-mono font-bold text-blue-800 mb-3 tracking-wider"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {selectedItem.lockboxPassword || "1234"}
          </motion.p>
          <div className="flex items-center justify-center text-sm text-blue-600">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="korean-text">
              {selectedItem.campus === "yangsan" ? "양산캠퍼스" : "장전캠퍼스"}{" "}
              {selectedItem.location}
            </span>
          </div>
        </motion.div>

        <motion.div
          className="mt-4 p-4 bg-blue-100/50 rounded-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-start">
            <div className="w-6 h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center mr-3 mt-0.5">
              <span className="text-white text-sm">💡</span>
            </div>
            <p className="text-sm text-blue-700 korean-text leading-relaxed">
              이 비밀번호로 보관함을 열고 물품을 확인한 후 다음 단계로
              진행해주세요.
            </p>
          </div>
        </motion.div>
      </motion.div>

      {/* 대여 신청 정보 */}
      <motion.div
        className="border-t border-gray-200/60 pt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <h3 className="font-semibold text-gray-900 mb-6 korean-text flex items-center">
          <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
          대여 신청 정보
        </h3>

        <div className="space-y-6">
          <motion.div
            className="flex items-start space-x-4"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className={`flex items-center justify-center w-6 h-6 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                applicationForm.agreement
                  ? "bg-gradient-to-br from-primary to-secondary border-primary shadow-lg"
                  : "bg-white border-gray-300 hover:border-primary/50 shadow-sm"
              }`}
              onClick={() =>
                onApplicationFormChange({
                  ...applicationForm,
                  agreement: !applicationForm.agreement,
                })
              }
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {applicationForm.agreement && (
                <motion.svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </motion.svg>
              )}
            </motion.div>
            <div className="flex-1">
              <label
                className="font-medium text-gray-700 cursor-pointer korean-text"
                onClick={() =>
                  onApplicationFormChange({
                    ...applicationForm,
                    agreement: !applicationForm.agreement,
                  })
                }
              >
                대여 약관에 동의합니다
              </label>
              <p className="text-sm text-gray-500 mt-1 korean-text">
                물품 손상 시 수리비 부담, 연체 시 벌점 부과 등에 동의합니다
              </p>
            </div>
          </motion.div>

          {/* 상세 약관 내용 */}
          <motion.div
            className="bg-gradient-to-br from-gray-50/80 to-gray-100/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <h4 className="font-semibold text-gray-900 mb-4 korean-text flex items-center">
              <span className="text-lg mr-2">📋</span>
              대여 약관 상세 내용
            </h4>
            <div className="space-y-3 text-sm text-gray-700">
              {[
                { title: "대여 기간", content: "24시간 (익일 같은 시간까지)" },
                {
                  title: "연체 시",
                  content: "하루당 벌점 1점 부과, 3회 연체 시 한 달 이용 정지",
                },
                {
                  title: "물품 손상 시",
                  content: "수리비 실비 부담 (영수증 제공)",
                },
                {
                  title: "물품 분실 시",
                  content: "동일 물품 재구매 비용 부담",
                },
                {
                  title: "주의사항",
                  content: "대여 중 제3자에게 양도 금지, 타인 명의 대여 금지",
                },
                {
                  title: "문의",
                  content: "정보대학 학생회 (양산캠퍼스 학생회실)",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                >
                  <span className="font-semibold text-primary mr-2 korean-text">
                    {index + 1}.
                  </span>
                  <div>
                    <strong className="korean-text">{item.title}:</strong>
                    <span className="ml-1 korean-text">{item.content}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <motion.button
          type="button"
          onClick={onReset}
          className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-md korean-text"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          취소
        </motion.button>
        <motion.button
          type="button"
          onClick={handleSubmit}
          className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-xl hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg korean-text"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          사진 촬영하기
        </motion.button>
      </motion.div>
    </motion.div>
  );
};
