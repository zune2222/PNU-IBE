import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "../../../shared/components/Toast";
import {
  FirestoreRentalItem,
  lockboxPasswordService,
} from "../../../shared/services/firestore";
import { RentalApplicationForm } from "../types";

interface PasswordStepProps {
  selectedItem: FirestoreRentalItem;
  applicationForm: RentalApplicationForm;
  onApplicationFormChange: (form: RentalApplicationForm) => void;
  onNextStep: () => void;
  onReset: () => void;
}

// 모달 컴포넌트
const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden"
            style={{
              marginBottom: "env(safe-area-inset-bottom, 0)",
              marginTop: "env(safe-area-inset-top, 0)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-8rem)]">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const PasswordStep: React.FC<PasswordStepProps> = ({
  selectedItem,
  applicationForm,
  onApplicationFormChange,
  onNextStep,
  onReset,
}) => {
  const { showToast } = useToast();
  const [lockboxPassword, setLockboxPassword] = useState<string>("1234");
  const [isLoadingPassword, setIsLoadingPassword] = useState(true);

  // 모달 관련 상태
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // 컴포넌트 마운트 시 자물쇠 비밀번호 가져오기
  useEffect(() => {
    const fetchLockboxPassword = async () => {
      try {
        setIsLoadingPassword(true);

        const passwordData =
          await lockboxPasswordService.getCurrentPasswordByCampus(
            selectedItem.campus
          );

        if (passwordData) {
          setLockboxPassword(passwordData.currentPassword);
        } else {
          // 비밀번호가 설정되지 않은 경우 기본값 사용
          setLockboxPassword("1234");
          showToast({
            type: "warning",
            message:
              "보관함 비밀번호가 설정되지 않았습니다. 관리자에게 문의하세요.",
          });
        }
      } catch (error) {
        console.error("자물쇠 비밀번호 조회 오류:", error);
        setLockboxPassword("1234");
        showToast({
          type: "error",
          message:
            "비밀번호 조회 중 오류가 발생했습니다. 관리자에게 문의하세요.",
        });
      } finally {
        setIsLoadingPassword(false);
      }
    };

    fetchLockboxPassword();
  }, [selectedItem.campus, showToast]);

  // 약관 동의 변경 시 agreement 값도 함께 변경
  useEffect(() => {
    if (termsAgreed && privacyAgreed) {
      onApplicationFormChange({
        ...applicationForm,
        agreement: true,
      });
    } else {
      onApplicationFormChange({
        ...applicationForm,
        agreement: false,
      });
    }
  }, [termsAgreed, privacyAgreed, onApplicationFormChange]);

  const handleSubmit = () => {
    // 신청 정보 유효성 검사
    if (!termsAgreed || !privacyAgreed) {
      showToast({
        type: "error",
        message: "이용약관 및 개인정보처리방침에 모두 동의해주세요.",
      });
      return;
    }

    // 다음 단계로 이동
    onNextStep();
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
          {isLoadingPassword ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-blue-600 korean-text">
                비밀번호 로딩 중...
              </span>
            </div>
          ) : (
            <motion.p
              className="text-4xl font-mono font-bold text-blue-800 mb-3 tracking-wider"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {lockboxPassword}
            </motion.p>
          )}
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
          약관 동의
        </h3>

        <div className="space-y-4">
          {/* 이용약관 동의 */}
          <motion.div
            className="flex items-start space-x-4"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className={`flex items-center justify-center w-6 h-6 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                termsAgreed
                  ? "bg-gradient-to-br from-primary to-secondary border-primary shadow-lg"
                  : "bg-white border-gray-300 hover:border-primary/50 shadow-sm"
              }`}
              onClick={() => setShowTermsModal(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {termsAgreed && (
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
              <div className="flex items-center">
                <label
                  className="font-medium text-gray-700 cursor-pointer korean-text"
                  onClick={() => setShowTermsModal(true)}
                >
                  이용약관에 동의합니다
                </label>
                <button
                  onClick={() => setShowTermsModal(true)}
                  className="ml-2 text-primary hover:text-secondary underline text-sm transition-colors duration-200 korean-text"
                >
                  보기
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1 korean-text">
                물품 대여 서비스 이용을 위한 약관에 동의합니다
              </p>
            </div>
          </motion.div>

          {/* 개인정보처리방침 동의 */}
          <motion.div
            className="flex items-start space-x-4"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className={`flex items-center justify-center w-6 h-6 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                privacyAgreed
                  ? "bg-gradient-to-br from-primary to-secondary border-primary shadow-lg"
                  : "bg-white border-gray-300 hover:border-primary/50 shadow-sm"
              }`}
              onClick={() => setShowPrivacyModal(true)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {privacyAgreed && (
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
              <div className="flex items-center">
                <label
                  className="font-medium text-gray-700 cursor-pointer korean-text"
                  onClick={() => setShowPrivacyModal(true)}
                >
                  개인정보처리방침에 동의합니다
                </label>
                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className="ml-2 text-primary hover:text-secondary underline text-sm transition-colors duration-200 korean-text"
                >
                  보기
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1 korean-text">
                개인정보 수집 및 이용에 동의합니다
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
              대여 유의사항 요약
            </h4>
            <div className="space-y-3 text-sm text-gray-700">
              {[
                { title: "대여 기간", content: "24시간 (익일 같은 시간까지)" },
                {
                  title: "반납 지연 시",
                  content:
                    "30분 이내: 경고 1회 / 30분 초과: 1주일 대여 제한 / 2시간 초과: 1개월 대여 제한 / 24시간 초과: 영구 대여 제한",
                },
                {
                  title: "손상 시",
                  content:
                    "약간의 손상: 책임 없음 / 사용 불가능한 손상: 동일 물품 구매 제출",
                },
                {
                  title: "분실 시",
                  content:
                    "동일 물품 구매 제출 (불이행 시 영구 대여 제한 및 학생회 행사 참여 제한)",
                },
                {
                  title: "유의사항",
                  content:
                    "손상 및 분실 여부에 대한 최종 판단은 담당자에게 있음",
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

      {/* 이용약관 모달 */}
      <Modal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        title="이용약관"
      >
        <iframe
          src="/terms"
          className="w-full h-[60vh] border-0 rounded"
          title="이용약관"
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setTermsAgreed(true);
              setShowTermsModal(false);
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors korean-text"
          >
            약관에 동의합니다
          </button>
        </div>
      </Modal>

      {/* 개인정보처리방침 모달 */}
      <Modal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        title="개인정보처리방침"
      >
        <iframe
          src="/privacy"
          className="w-full h-[60vh] border-0 rounded"
          title="개인정보처리방침"
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setPrivacyAgreed(true);
              setShowPrivacyModal(false);
            }}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors korean-text"
          >
            방침에 동의합니다
          </button>
        </div>
      </Modal>
    </motion.div>
  );
};
