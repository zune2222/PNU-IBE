import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  rentalApplicationService,
  FirestoreRentalApplication,
  RentalStatus,
} from "../firestore";

// 🎯 대여 신청 관련 hooks

// 모든 대여 신청 가져오기 훅 (관리자용)
export const useRentalApplications = () => {
  return useQuery({
    queryKey: ["rentalApplications"],
    queryFn: () => rentalApplicationService.getAllApplications(),
    staleTime: 2 * 60 * 1000, // 2분
  });
};

// 특정 대여 신청 가져오기 훅
export const useRentalApplication = (id: string | undefined) => {
  return useQuery({
    queryKey: ["rentalApplications", id],
    queryFn: () =>
      id ? rentalApplicationService.getById(id) : Promise.resolve(null),
    enabled: !!id,
  });
};

// 사용자별 대여 신청 가져오기 훅
export const useUserRentalApplications = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["rentalApplications", "user", userId],
    queryFn: () =>
      userId
        ? rentalApplicationService.getByUserId(userId)
        : Promise.resolve([]),
    enabled: !!userId,
  });
};

// 상태별 대여 신청 가져오기 훅
export const useRentalApplicationsByStatus = (status: RentalStatus) => {
  return useQuery({
    queryKey: ["rentalApplications", "status", status],
    queryFn: () => rentalApplicationService.getByStatus(status),
    enabled: !!status,
  });
};

// 현재 대여중인 물품 가져오기 훅 (사용자별)
export const useCurrentRentals = (userId: string | undefined) => {
  return useQuery({
    queryKey: ["rentalApplications", "current", userId],
    queryFn: () =>
      userId
        ? rentalApplicationService.getCurrentRentals(userId)
        : Promise.resolve([]),
    enabled: !!userId,
    staleTime: 1 * 60 * 1000, // 1분
  });
};

// 대여 신청 생성 훅
export const useCreateRentalApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      application: Omit<
        FirestoreRentalApplication,
        "id" | "createdAt" | "updatedAt"
      >
    ) => rentalApplicationService.createApplication(application),
    onSuccess: (_, application) => {
      // 관련 쿼리들 갱신
      queryClient.invalidateQueries({ queryKey: ["rentalApplications"] });
      queryClient.invalidateQueries({
        queryKey: ["rentalApplications", "user", application.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["rentalApplications", "status", "pending"],
      });
    },
  });
};

// 대여 신청 상태 업데이트 훅
export const useUpdateRentalApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      additionalData,
    }: {
      id: string;
      status: RentalStatus;
      additionalData?: Partial<FirestoreRentalApplication>;
    }) => rentalApplicationService.updateStatus(id, status, additionalData),
    onSuccess: (_, { id, status }) => {
      // 관련 쿼리들 갱신
      queryClient.invalidateQueries({ queryKey: ["rentalApplications", id] });
      queryClient.invalidateQueries({ queryKey: ["rentalApplications"] });
      queryClient.invalidateQueries({
        queryKey: ["rentalApplications", "status", status],
      });
    },
  });
};

// 즉시 대여 처리 훅
export const useProcessRental = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      applicationData: Omit<
        FirestoreRentalApplication,
        "id" | "createdAt" | "updatedAt"
      >
    ) => rentalApplicationService.processRental(applicationData),
    onSuccess: () => {
      // 관련 쿼리들 갱신
      queryClient.invalidateQueries({ queryKey: ["rentalApplications"] });
      queryClient.invalidateQueries({
        queryKey: ["rentalApplications", "status", "rented"],
      });
    },
  });
};

// 반납 처리 훅
export const useProcessReturn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      returnPhotos,
      rating,
      feedback,
    }: {
      id: string;
      returnPhotos: {
        returnItemConditionPhotoUrl: string;
        returnLockboxSecuredPhotoUrl: string;
      };
      rating?: number;
      feedback?: string;
    }) =>
      rentalApplicationService.processReturn(
        id,
        returnPhotos,
        rating,
        feedback
      ),
    onSuccess: (_, { id }) => {
      // 관련 쿼리들 갱신
      queryClient.invalidateQueries({ queryKey: ["rentalApplications", id] });
      queryClient.invalidateQueries({ queryKey: ["rentalApplications"] });
      queryClient.invalidateQueries({
        queryKey: ["rentalApplications", "status", "rented"],
      });
      queryClient.invalidateQueries({
        queryKey: ["rentalApplications", "status", "returned"],
      });
    },
  });
};

// 분실 처리 훅
export const useMarkAsLost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rentalApplicationService.markAsLost(id, reason),
    onSuccess: (_, { id }) => {
      // 관련 쿼리들 갱신
      queryClient.invalidateQueries({ queryKey: ["rentalApplications", id] });
      queryClient.invalidateQueries({ queryKey: ["rentalApplications"] });
      queryClient.invalidateQueries({
        queryKey: ["rentalApplications", "status", "rented"],
      });
      queryClient.invalidateQueries({
        queryKey: ["rentalApplications", "status", "lost"],
      });
    },
  });
};

// 파손 처리 훅
export const useMarkAsDamaged = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      rentalApplicationService.markAsDamaged(id, reason),
    onSuccess: (_, { id }) => {
      // 관련 쿼리들 갱신
      queryClient.invalidateQueries({ queryKey: ["rentalApplications", id] });
      queryClient.invalidateQueries({ queryKey: ["rentalApplications"] });
      queryClient.invalidateQueries({
        queryKey: ["rentalApplications", "status", "rented"],
      });
      queryClient.invalidateQueries({
        queryKey: ["rentalApplications", "status", "damaged"],
      });
    },
  });
};
