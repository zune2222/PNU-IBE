import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { noticeService, FirestoreNotice } from "../firestore";

// 모든 공지사항 가져오기 훅
export const useNotices = () => {
  return useQuery({
    queryKey: ["notices"],
    queryFn: () => noticeService.getAll(),
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 특정 공지사항 가져오기 훅
export const useNotice = (id: string | undefined) => {
  return useQuery({
    queryKey: ["notices", id],
    queryFn: () => (id ? noticeService.getById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
};

// 중요 공지사항 가져오기 훅
export const useImportantNotices = () => {
  return useQuery({
    queryKey: ["notices", "important"],
    queryFn: () => noticeService.getImportant(),
  });
};

// 공지사항 추가 훅
export const useAddNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      notice: Omit<FirestoreNotice, "id" | "createdAt" | "updatedAt">
    ) => noticeService.add(notice),
    onSuccess: () => {
      // 전체 공지사항 목록과 중요 공지사항 목록을 갱신
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });
};

// 공지사항 수정 훅
export const useUpdateNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      notice,
    }: {
      id: string;
      notice: Partial<FirestoreNotice>;
    }) => noticeService.update(id, notice),
    onSuccess: (_, { id }) => {
      // 특정 공지사항과 전체 목록, 중요 공지사항 목록을 갱신
      queryClient.invalidateQueries({ queryKey: ["notices", id] });
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });
};

// 공지사항 삭제 훅
export const useDeleteNotice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => noticeService.delete(id),
    onSuccess: () => {
      // 전체 공지사항 목록과 중요 공지사항 목록을 갱신
      queryClient.invalidateQueries({ queryKey: ["notices"] });
    },
  });
};

// 공지사항 조회수 증가 훅
export const useIncrementNoticeViews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => noticeService.incrementViews(id),
    onSuccess: (_, id) => {
      // 특정 공지사항 정보를 갱신
      queryClient.invalidateQueries({ queryKey: ["notices", id] });
    },
  });
};
