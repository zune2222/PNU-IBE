import { StudentIdInfo } from "../../shared/services/clientOcrService";

// 확장된 학생 정보 인터페이스 (휴대폰 번호 포함)
export interface ExtendedStudentIdInfo extends StudentIdInfo {
  phoneNumber: string;
  studentIdPhotoUrl?: string;
}

// 대여 신청 단계
export type RentalStep =
  | "verify"
  | "select"
  | "password"
  | "photos"
  | "complete";

// 대여 신청 폼
export interface RentalApplicationForm {
  agreement: boolean;
}

// 촬영 사진들
export interface RentalPhotos {
  itemCondition: File | null;
  itemLabel: File | null;
  lockboxSecured: File | null;
}

// 업로드된 사진 URL들
export interface UploadedRentalPhotos {
  itemConditionPhotoUrl: string;
  itemLabelPhotoUrl: string;
  lockboxSecuredPhotoUrl: string;
}
