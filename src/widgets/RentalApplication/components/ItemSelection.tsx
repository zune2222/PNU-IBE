import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { FirestoreRentalItem } from "../../../shared/services/firestore";

interface ItemSelectionProps {
  availableItems: FirestoreRentalItem[];
  isLoading: boolean;
  onItemSelect: (item: FirestoreRentalItem) => void;
}

export const ItemSelection: React.FC<ItemSelectionProps> = ({
  availableItems,
  isLoading,
  onItemSelect,
}) => {
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 캠퍼스별 물품 필터링
  const itemsByCampus = useMemo(() => {
    if (!selectedCampus) return [];
    return availableItems.filter((item) => item.campus === selectedCampus);
  }, [availableItems, selectedCampus]);

  // 선택된 캠퍼스의 카테고리 목록
  const categories = useMemo(() => {
    const categorySet = new Set(itemsByCampus.map((item) => item.category));
    return Array.from(categorySet).sort();
  }, [itemsByCampus]);

  // 선택된 카테고리의 물품들
  const filteredItems = useMemo(() => {
    if (!selectedCategory) return [];
    return itemsByCampus.filter((item) => item.category === selectedCategory);
  }, [itemsByCampus, selectedCategory]);

  const goBackToCampus = () => {
    setSelectedCampus(null);
    setSelectedCategory(null);
  };

  const goBackToCategory = () => {
    setSelectedCategory(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "rented":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "lost":
        return "bg-red-100 text-red-800 border-red-200";
      case "damaged":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "대여 가능";
      case "rented":
        return "대여 중";
      case "maintenance":
        return "정비 중";
      case "lost":
        return "분실";
      case "damaged":
        return "파손";
      default:
        return "알 수 없음";
    }
  };

  // 캠퍼스 선택 단계
  const renderCampusSelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-3 sm:mb-4">
          <span className="w-2 h-2 bg-primary rounded-full mr-2 sm:mr-3 animate-pulse"></span>
          <span className="text-xs sm:text-sm font-semibold text-primary">
            1단계: 캠퍼스 선택
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          캠퍼스를 선택하세요
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          물품을 대여할 캠퍼스를 선택해주세요
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
        {[
          {
            id: "jangjeom",
            name: "장전캠퍼스",
            icon: "🏛️",
            description: "부산 금정구 장전동",
          },
          {
            id: "yangsan",
            name: "양산캠퍼스",
            icon: "🌿",
            description: "양산시 물금읍",
          },
        ].map((campus, index) => (
          <motion.button
            key={campus.id}
            className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left"
            onClick={() => setSelectedCampus(campus.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-3xl mb-3">{campus.icon}</div>
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
              {campus.name}
            </h3>
            <p className="text-sm text-gray-600">{campus.description}</p>
            <div className="mt-4 flex justify-end">
              <span className="text-xs text-primary font-medium">
                선택하기 →
              </span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  // 카테고리 선택 단계
  const renderCategorySelection = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-3 sm:mb-4">
          <span className="w-2 h-2 bg-primary rounded-full mr-2 sm:mr-3 animate-pulse"></span>
          <span className="text-xs sm:text-sm font-semibold text-primary">
            2단계: 카테고리 선택
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          카테고리를 선택하세요
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          {selectedCampus === "jangjeom" ? "장전캠퍼스" : "양산캠퍼스"}에서 대여
          가능한 카테고리입니다
        </p>
      </div>

      <div className="flex justify-center mb-6">
        <button
          onClick={goBackToCampus}
          className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-primary transition-colors"
        >
          ← 캠퍼스 다시 선택
        </button>
      </div>

      {categories.length === 0 ? (
        <motion.div
          className="text-center py-8 sm:py-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-6 rounded-2xl mx-auto w-fit mb-4">
            <svg
              className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5"
              />
            </svg>
          </div>
          <div className="text-base sm:text-lg font-medium text-gray-700">
            선택한 캠퍼스에 대여 가능한 물품이 없습니다
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categories.map((category, index) => {
            const categoryItems = itemsByCampus.filter(
              (item) => item.category === category
            );
            const availableCount = categoryItems.filter(
              (item) => item.status === "available"
            ).length;

            return (
              <motion.button
                key={category}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 text-left"
                onClick={() => setSelectedCategory(category)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {category}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  총 {categoryItems.length}개 물품
                </p>
                <div className="flex justify-between items-center">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      availableCount > 0
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {availableCount > 0
                      ? `${availableCount}개 대여가능`
                      : "대여불가"}
                  </span>
                  <span className="text-xs text-primary font-medium">
                    선택하기 →
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </motion.div>
  );

  // 물품 목록 단계
  const renderItemList = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-6 sm:mb-8">
        <div className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-3 sm:mb-4">
          <span className="w-2 h-2 bg-primary rounded-full mr-2 sm:mr-3 animate-pulse"></span>
          <span className="text-xs sm:text-sm font-semibold text-primary">
            3단계: 물품 선택
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
          {selectedCategory} 카테고리
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          {selectedCampus === "jangjeom" ? "장전캠퍼스" : "양산캠퍼스"} • 원하는
          물품을 선택하여 대여 신청을 진행하세요
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={goBackToCampus}
          className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-primary transition-colors"
        >
          ← 캠퍼스 변경
        </button>
        <button
          onClick={goBackToCategory}
          className="flex items-center px-4 py-2 text-sm text-gray-600 hover:text-primary transition-colors"
        >
          ← 카테고리 변경
        </button>
      </div>

      {filteredItems.length === 0 ? (
        <motion.div
          className="text-center py-8 sm:py-12"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-6 rounded-2xl mx-auto w-fit mb-4">
            <svg
              className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1H7a1 1 0 00-1 1v1m8 0V4.5"
              />
            </svg>
          </div>
          <div className="text-base sm:text-lg font-medium text-gray-700">
            이 카테고리에 대여 가능한 물품이 없습니다
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-white/60 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.name}
                  width={400}
                  height={192}
                  className="w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                  <span
                    className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      item.status
                    )} backdrop-blur-sm`}
                  >
                    {getStatusText(item.status)}
                  </span>
                </div>
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                  {item.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="flex flex-col sm:flex-row gap-2">
                  <motion.button
                    className="flex-1 px-3 py-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 text-xs sm:text-sm font-medium rounded-xl hover:bg-gray-200 transition-all duration-300"
                    onClick={() => {
                      alert(`${item.name}\n\n${item.description}`);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    상세정보
                  </motion.button>
                  <motion.button
                    className="flex-1 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-primary to-secondary text-white text-xs sm:text-sm font-medium rounded-xl hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 shadow-lg"
                    onClick={() => onItemSelect(item)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    대여 신청
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-4 sm:p-6 lg:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {isLoading ? (
        <motion.div
          className="text-center py-8 sm:py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mx-auto w-12 h-12 sm:w-16 sm:h-16 mb-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 border-4 border-blue-500/20 rounded-full animate-spin border-t-blue-500"></div>
          </div>
          <div className="text-base sm:text-lg font-medium text-gray-700">
            물품 목록을 불러오는 중...
          </div>
        </motion.div>
      ) : !selectedCampus ? (
        renderCampusSelection()
      ) : !selectedCategory ? (
        renderCategorySelection()
      ) : (
        renderItemList()
      )}
    </motion.div>
  );
};
