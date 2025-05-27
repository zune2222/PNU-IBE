import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventService, FirestoreEvent } from "../firestore";

// 모든 이벤트 가져오기 훅
export const useEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => eventService.getAll(),
    staleTime: 5 * 60 * 1000, // 5분
  });
};

// 특정 이벤트 가져오기 훅
export const useEvent = (id: string | undefined) => {
  return useQuery({
    queryKey: ["events", id],
    queryFn: () => (id ? eventService.getById(id) : Promise.resolve(null)),
    enabled: !!id,
  });
};

// 곧 진행될 이벤트 가져오기 훅
export const useUpcomingEvents = (limit: number = 3) => {
  return useQuery({
    queryKey: ["events", "upcoming", limit],
    queryFn: () => eventService.getUpcoming(limit),
  });
};

// 특별 이벤트 가져오기 훅
export const useFeaturedEvents = () => {
  return useQuery({
    queryKey: ["events", "featured"],
    queryFn: () => eventService.getFeatured(),
  });
};

// 이벤트 추가 훅
export const useAddEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      event: Omit<FirestoreEvent, "id" | "createdAt" | "updatedAt">
    ) => eventService.add(event),
    onSuccess: () => {
      // 이벤트 목록과 관련 쿼리 갱신
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

// 이벤트 수정 훅
export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      event,
    }: {
      id: string;
      event: Partial<FirestoreEvent>;
    }) => eventService.update(id, event),
    onSuccess: (_, { id }) => {
      // 이벤트 목록과 관련 쿼리 갱신
      queryClient.invalidateQueries({ queryKey: ["events", id] });
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};

// 이벤트 삭제 훅
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => eventService.delete(id),
    onSuccess: () => {
      // 이벤트 목록과 관련 쿼리 갱신
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
};
