import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rentalItemService, FirestoreRentalItem } from "../firestore";

// 모든 대여 아이템 가져오기 훅
export const useRentalItems = () => {
  return useQuery({
    queryKey: ["rentalItems"],
    queryFn: () => rentalItemService.getAll(),
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 특정 대여 아이템 가져오기 훅
export const useRentalItem = (id: string | undefined) => {
  return useQuery({
    queryKey: ["rentalItems", id],
    queryFn: () => (id ? rentalItemService.getById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
};

// 이용 가능한 대여 아이템 가져오기 훅
export const useAvailableRentalItems = () => {
  return useQuery({
    queryKey: ["rentalItems", "available"],
    queryFn: () => rentalItemService.getAvailable(),
  });
};

// 카테고리별 대여 아이템 가져오기 훅
export const useRentalItemsByCategory = (category: string) => {
  return useQuery({
    queryKey: ["rentalItems", "category", category],
    queryFn: () => rentalItemService.getByCategory(category),
    enabled: !!category,
  });
};

// 대여 아이템 추가 훅
export const useAddRentalItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      item: Omit<FirestoreRentalItem, "id" | "createdAt" | "updatedAt">
    ) => rentalItemService.add(item),
    onSuccess: () => {
      // 대여 아이템 목록과 관련 쿼리 갱신
      queryClient.invalidateQueries({ queryKey: ["rentalItems"] });
    },
  });
};

// 대여 아이템 수정 훅
export const useUpdateRentalItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      item,
    }: {
      id: string;
      item: Partial<FirestoreRentalItem>;
    }) => rentalItemService.update(id, item),
    onSuccess: (_, { id }) => {
      // 대여 아이템 목록과 관련 쿼리 갱신
      queryClient.invalidateQueries({ queryKey: ["rentalItems", id] });
      queryClient.invalidateQueries({ queryKey: ["rentalItems"] });
    },
  });
};

// 대여 아이템 삭제 훅
export const useDeleteRentalItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => rentalItemService.delete(id),
    onSuccess: () => {
      // 대여 아이템 목록과 관련 쿼리 갱신
      queryClient.invalidateQueries({ queryKey: ["rentalItems"] });
    },
  });
};

// 🎯 확장된 대여 시스템 hooks

// 캠퍼스별 대여 아이템 가져오기 훅
export const useRentalItemsByCampus = (campus: "yangsan" | "jangjeom") => {
  return useQuery({
    queryKey: ["rentalItems", "campus", campus],
    queryFn: () => rentalItemService.getByCampus(campus),
    enabled: !!campus,
  });
};

// 캠퍼스별 이용 가능한 대여 아이템 가져오기 훅
export const useAvailableRentalItemsByCampus = (
  campus: "yangsan" | "jangjeom"
) => {
  return useQuery({
    queryKey: ["rentalItems", "available", "campus", campus],
    queryFn: () => rentalItemService.getAvailableByCampus(campus),
    enabled: !!campus,
  });
};

// 고유 ID로 대여 아이템 가져오기 훅
export const useRentalItemByUniqueId = (uniqueId: string | undefined) => {
  return useQuery({
    queryKey: ["rentalItems", "uniqueId", uniqueId],
    queryFn: () =>
      uniqueId
        ? rentalItemService.getByUniqueId(uniqueId)
        : Promise.resolve(null),
    enabled: !!uniqueId,
  });
};

// 대여 아이템 검색 훅
export const useSearchRentalItems = (
  searchTerm: string,
  campus?: "yangsan" | "jangjeom"
) => {
  return useQuery({
    queryKey: ["rentalItems", "search", searchTerm, campus],
    queryFn: () => rentalItemService.search(searchTerm, campus),
    enabled: searchTerm.length >= 2, // 최소 2글자 이상 입력시 검색
    staleTime: 30 * 1000, // 30초
  });
};

// 대여 아이템 통계 훅
export const useRentalItemsStatistics = () => {
  return useQuery({
    queryKey: ["rentalItems", "statistics"],
    queryFn: () => rentalItemService.getStatistics(),
    staleTime: 10 * 60 * 1000, // 10분
  });
};

// 인기 대여 아이템 훅
export const usePopularRentalItems = (limitCount: number = 5) => {
  return useQuery({
    queryKey: ["rentalItems", "popular", limitCount],
    queryFn: () => rentalItemService.getPopularItems(limitCount),
    staleTime: 30 * 60 * 1000, // 30분
  });
};

// 물품 대여 처리 훅
export const useRentItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, rentalId }: { itemId: string; rentalId: string }) =>
      rentalItemService.rentItem(itemId, rentalId),
    onSuccess: (success, { itemId }) => {
      if (success) {
        // 관련 쿼리들 갱신
        queryClient.invalidateQueries({ queryKey: ["rentalItems", itemId] });
        queryClient.invalidateQueries({ queryKey: ["rentalItems"] });
        queryClient.invalidateQueries({
          queryKey: ["rentalItems", "available"],
        });
        queryClient.invalidateQueries({
          queryKey: ["rentalItems", "statistics"],
        });
      }
    },
  });
};

// 물품 반납 처리 훅
export const useReturnItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => rentalItemService.returnItem(itemId),
    onSuccess: (success, itemId) => {
      if (success) {
        // 관련 쿼리들 갱신
        queryClient.invalidateQueries({ queryKey: ["rentalItems", itemId] });
        queryClient.invalidateQueries({ queryKey: ["rentalItems"] });
        queryClient.invalidateQueries({
          queryKey: ["rentalItems", "available"],
        });
        queryClient.invalidateQueries({
          queryKey: ["rentalItems", "statistics"],
        });
      }
    },
  });
};

// 물품 상태 업데이트 훅
export const useUpdateItemStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      condition,
    }: {
      id: string;
      status: "available" | "rented" | "maintenance" | "lost" | "damaged";
      condition?: string;
    }) => rentalItemService.updateItemStatus(id, status, condition),
    onSuccess: (_, { id }) => {
      // 관련 쿼리들 갱신
      queryClient.invalidateQueries({ queryKey: ["rentalItems", id] });
      queryClient.invalidateQueries({ queryKey: ["rentalItems"] });
      queryClient.invalidateQueries({ queryKey: ["rentalItems", "available"] });
      queryClient.invalidateQueries({
        queryKey: ["rentalItems", "statistics"],
      });
    },
  });
};
