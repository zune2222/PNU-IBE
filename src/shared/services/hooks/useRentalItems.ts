import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { rentalService, FirestoreRentalItem } from "../firestore";

// 모든 대여 아이템 가져오기 훅
export const useRentalItems = () => {
  return useQuery({
    queryKey: ["rentalItems"],
    queryFn: () => rentalService.getAll(),
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 특정 대여 아이템 가져오기 훅
export const useRentalItem = (id: string | undefined) => {
  return useQuery({
    queryKey: ["rentalItems", id],
    queryFn: () => (id ? rentalService.getById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
};

// 이용 가능한 대여 아이템 가져오기 훅
export const useAvailableRentalItems = () => {
  return useQuery({
    queryKey: ["rentalItems", "available"],
    queryFn: () => rentalService.getAvailable(),
  });
};

// 카테고리별 대여 아이템 가져오기 훅
export const useRentalItemsByCategory = (category: string) => {
  return useQuery({
    queryKey: ["rentalItems", "category", category],
    queryFn: () => rentalService.getByCategory(category),
    enabled: !!category,
  });
};

// 대여 아이템 추가 훅
export const useAddRentalItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      item: Omit<FirestoreRentalItem, "id" | "createdAt" | "updatedAt">
    ) => rentalService.add(item),
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
    }) => rentalService.update(id, item),
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
    mutationFn: (id: string) => rentalService.delete(id),
    onSuccess: () => {
      // 대여 아이템 목록과 관련 쿼리 갱신
      queryClient.invalidateQueries({ queryKey: ["rentalItems"] });
    },
  });
};
