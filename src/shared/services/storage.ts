import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  getMetadata,
  StorageReference,
} from "firebase/storage";
import { storage } from "../config/firebase";
import { PhotoType } from "./firestore";

// 파일 업로드 결과 타입
export interface UploadResult {
  url: string;
  path: string;
  name: string;
  size: number;
  contentType: string;
}

// 업로드 진행 상황 타입
export interface UploadProgress {
  bytesTransferred: number;
  totalBytes: number;
  progress: number;
}

// 사진 업로드 결과 (확장된 버전)
export interface PhotoUploadResult extends UploadResult {
  thumbnailUrl?: string; // 썸네일 URL (필요시)
  metadata: {
    uploadedAt: string;
    photoType: PhotoType;
    userId: string;
    rentalId?: string;
  };
}

// Storage 서비스
export const storageService = {
  // 파일 업로드 (간단한 방식)
  async uploadFile(
    file: File,
    path: string,
    fileName?: string
  ): Promise<UploadResult> {
    const finalFileName = fileName || `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${path}/${finalFileName}`);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      url: downloadURL,
      path: snapshot.ref.fullPath,
      name: finalFileName,
      size: snapshot.metadata.size,
      contentType: snapshot.metadata.contentType || file.type,
    };
  },

  // 파일 업로드 (진행 상황 추적)
  uploadFileWithProgress(
    file: File,
    path: string,
    fileName?: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const finalFileName = fileName || `${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `${path}/${finalFileName}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = {
            bytesTransferred: snapshot.bytesTransferred,
            totalBytes: snapshot.totalBytes,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          };

          if (onProgress) {
            onProgress(progress);
          }
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            const metadata = uploadTask.snapshot.metadata;

            resolve({
              url: downloadURL,
              path: uploadTask.snapshot.ref.fullPath,
              name: finalFileName,
              size: metadata.size,
              contentType: metadata.contentType || file.type,
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  },

  // 이미지 업로드 (리사이징 포함)
  async uploadImage(
    file: File,
    path: string,
    maxWidth: number = 1200,
    quality: number = 0.8
  ): Promise<UploadResult> {
    // 이미지 리사이징
    const resizedFile = await this.resizeImage(file, maxWidth, quality);
    return this.uploadFile(resizedFile, path);
  },

  // 이미지 리사이징 헬퍼 함수
  resizeImage(file: File, maxWidth: number, quality: number): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const img = new Image();

      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            }
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  },

  // 파일 삭제
  async deleteFile(path: string): Promise<void> {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  },

  // 파일 다운로드 URL 가져오기
  async getDownloadURL(path: string): Promise<string> {
    const storageRef = ref(storage, path);
    return await getDownloadURL(storageRef);
  },

  // 폴더 내 모든 파일 목록 가져오기
  async listFiles(path: string): Promise<StorageReference[]> {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    return result.items;
  },

  // 파일 메타데이터 가져오기
  async getFileMetadata(path: string) {
    const storageRef = ref(storage, path);
    return await getMetadata(storageRef);
  },

  // 공지사항 이미지 업로드
  async uploadNoticeImage(file: File): Promise<UploadResult> {
    return this.uploadImage(file, "notices/images");
  },

  // 행사 이미지 업로드
  async uploadEventImage(file: File): Promise<UploadResult> {
    return this.uploadImage(file, "events/images");
  },

  // 대여 물품 이미지 업로드
  async uploadRentalImage(file: File): Promise<UploadResult> {
    return this.uploadImage(file, "rentals/images");
  },

  // 일반 파일 업로드 (문서, PDF 등)
  async uploadDocument(file: File, category: string): Promise<UploadResult> {
    return this.uploadFile(file, `documents/${category}`);
  },

  // 파일 크기 검증
  validateFileSize(file: File, maxSizeMB: number = 10): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  },

  // 파일 타입 검증
  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  },

  // 이미지 파일 검증
  validateImageFile(file: File, maxSizeMB: number = 5): boolean {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    return (
      this.validateFileType(file, allowedTypes) &&
      this.validateFileSize(file, maxSizeMB)
    );
  },

  // 문서 파일 검증
  validateDocumentFile(file: File, maxSizeMB: number = 10): boolean {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ];
    return (
      this.validateFileType(file, allowedTypes) &&
      this.validateFileSize(file, maxSizeMB)
    );
  },

  // 🎯 대여 시스템 전용 사진 업로드 함수들

  // 학생증 사진 업로드
  async uploadStudentIdPhoto(
    file: File,
    userId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<PhotoUploadResult> {
    // 파일 검증
    if (!this.validateStudentIdPhoto(file)) {
      throw new Error(
        "학생증 사진 파일이 유효하지 않습니다. (JPG, PNG, 최대 5MB)"
      );
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}_student_id.${file.name.split(".").pop()}`;
    const path = `student-ids/${userId}`;

    const uploadResult = await this.uploadImageWithProgress(
      file,
      path,
      fileName,
      800, // 최대 너비 800px
      0.9, // 높은 품질 유지 (학생증 정보가 선명해야 함)
      onProgress
    );

    return {
      ...uploadResult,
      metadata: {
        uploadedAt: new Date().toISOString(),
        photoType: "student_id" as PhotoType,
        userId,
      },
    };
  },

  // 물품 상태 사진 업로드 (수령 전/반납 전)
  async uploadItemPhoto(
    file: File,
    rentalId: string,
    userId: string,
    photoType: "item_pre_pickup" | "item_pre_return",
    onProgress?: (progress: UploadProgress) => void
  ): Promise<PhotoUploadResult> {
    // 파일 검증
    if (!this.validateItemPhoto(file)) {
      throw new Error(
        "물품 사진 파일이 유효하지 않습니다. (JPG, PNG, 최대 10MB)"
      );
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}_${photoType}.${file.name.split(".").pop()}`;
    const path = `item-photos/${rentalId}/${photoType}`;

    const uploadResult = await this.uploadImageWithProgress(
      file,
      path,
      fileName,
      1200, // 물품 세부사항이 보이도록 더 큰 해상도
      0.8,
      onProgress
    );

    return {
      ...uploadResult,
      metadata: {
        uploadedAt: new Date().toISOString(),
        photoType,
        userId,
        rentalId,
      },
    };
  },

  // 보관함 사진 업로드 (수령 후/반납 후)
  async uploadLockboxPhoto(
    file: File,
    rentalId: string,
    userId: string,
    photoType: "lockbox_post_pickup" | "lockbox_post_return",
    onProgress?: (progress: UploadProgress) => void
  ): Promise<PhotoUploadResult> {
    // 파일 검증
    if (!this.validateLockboxPhoto(file)) {
      throw new Error(
        "보관함 사진 파일이 유효하지 않습니다. (JPG, PNG, 최대 8MB)"
      );
    }

    const timestamp = Date.now();
    const fileName = `${timestamp}_${photoType}.${file.name.split(".").pop()}`;
    const path = `lockbox-photos/${rentalId}`;

    const uploadResult = await this.uploadImageWithProgress(
      file,
      path,
      fileName,
      1000, // 보관함 상태가 명확히 보이도록
      0.8,
      onProgress
    );

    return {
      ...uploadResult,
      metadata: {
        uploadedAt: new Date().toISOString(),
        photoType,
        userId,
        rentalId,
      },
    };
  },

  // 통합 대여 시스템 사진 업로드 함수
  async uploadRentalSystemPhoto(
    file: File,
    photoType: PhotoType,
    userId: string,
    rentalId?: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<PhotoUploadResult> {
    switch (photoType) {
      case "student_id":
        return this.uploadStudentIdPhoto(file, userId, onProgress);

      case "item_pre_pickup":
      case "item_pre_return":
        if (!rentalId)
          throw new Error("물품 사진 업로드에는 rentalId가 필요합니다.");
        return this.uploadItemPhoto(
          file,
          rentalId,
          userId,
          photoType,
          onProgress
        );

      case "lockbox_post_pickup":
      case "lockbox_post_return":
        if (!rentalId)
          throw new Error("보관함 사진 업로드에는 rentalId가 필요합니다.");
        return this.uploadLockboxPhoto(
          file,
          rentalId,
          userId,
          photoType,
          onProgress
        );

      default:
        throw new Error(`지원하지 않는 사진 타입입니다: ${photoType}`);
    }
  },

  // 이미지 업로드 (진행 상황 추적 포함, 리사이징 포함)
  uploadImageWithProgress(
    file: File,
    path: string,
    fileName: string,
    maxWidth: number = 1200,
    quality: number = 0.8,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<UploadResult> {
    return new Promise(async (resolve, reject) => {
      try {
        // 이미지 리사이징
        const resizedFile = await this.resizeImage(file, maxWidth, quality);
        const storageRef = ref(storage, `${path}/${fileName}`);

        const uploadTask = uploadBytesResumable(storageRef, resizedFile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = {
              bytesTransferred: snapshot.bytesTransferred,
              totalBytes: snapshot.totalBytes,
              progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
            };

            if (onProgress) {
              onProgress(progress);
            }
          },
          (error) => {
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              const metadata = uploadTask.snapshot.metadata;

              resolve({
                url: downloadURL,
                path: uploadTask.snapshot.ref.fullPath,
                name: fileName,
                size: metadata.size,
                contentType: metadata.contentType || resizedFile.type,
              });
            } catch (error) {
              reject(error);
            }
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  },

  // 🎯 대여 시스템 전용 검증 함수들

  // 학생증 사진 검증
  validateStudentIdPhoto(file: File): boolean {
    const allowedTypes = ["image/jpeg", "image/png"];
    const maxSizeMB = 5;

    if (!this.validateFileType(file, allowedTypes)) {
      return false;
    }

    if (!this.validateFileSize(file, maxSizeMB)) {
      return false;
    }

    return true;
  },

  // 물품 사진 검증
  validateItemPhoto(file: File): boolean {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSizeMB = 10;

    return (
      this.validateFileType(file, allowedTypes) &&
      this.validateFileSize(file, maxSizeMB)
    );
  },

  // 보관함 사진 검증
  validateLockboxPhoto(file: File): boolean {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSizeMB = 8;

    return (
      this.validateFileType(file, allowedTypes) &&
      this.validateFileSize(file, maxSizeMB)
    );
  },

  // 대여 시스템 사진 타입별 검증
  validateRentalSystemPhoto(file: File, photoType: PhotoType): boolean {
    switch (photoType) {
      case "student_id":
        return this.validateStudentIdPhoto(file);
      case "item_pre_pickup":
      case "item_pre_return":
        return this.validateItemPhoto(file);
      case "lockbox_post_pickup":
      case "lockbox_post_return":
        return this.validateLockboxPhoto(file);
      default:
        return false;
    }
  },

  // 🎯 대여 시스템 전용 관리 함수들

  // 사용자별 학생증 사진 삭제
  async deleteStudentIdPhotos(userId: string): Promise<void> {
    const path = `student-ids/${userId}`;
    const files = await this.listFiles(path);

    for (const file of files) {
      await deleteObject(file);
    }
  },

  // 대여 신청별 모든 사진 삭제
  async deleteRentalPhotos(rentalId: string): Promise<void> {
    const paths = [`item-photos/${rentalId}`, `lockbox-photos/${rentalId}`];

    for (const path of paths) {
      try {
        const files = await this.listFiles(path);
        for (const file of files) {
          await deleteObject(file);
        }
      } catch (error) {
        // 폴더가 존재하지 않을 수 있으므로 에러 무시
        console.warn(`Failed to delete photos in path: ${path}`, error);
      }
    }
  },

  // 대여 시스템 사진 목록 조회
  async getRentalSystemPhotos(rentalId: string): Promise<{
    itemPhotos: StorageReference[];
    lockboxPhotos: StorageReference[];
  }> {
    try {
      const [itemPhotos, lockboxPhotos] = await Promise.all([
        this.listFiles(`item-photos/${rentalId}`),
        this.listFiles(`lockbox-photos/${rentalId}`),
      ]);

      return { itemPhotos, lockboxPhotos };
    } catch {
      return { itemPhotos: [], lockboxPhotos: [] };
    }
  },

  // 사용자별 학생증 사진 목록 조회
  async getStudentIdPhotos(userId: string): Promise<StorageReference[]> {
    try {
      return await this.listFiles(`student-ids/${userId}`);
    } catch {
      return [];
    }
  },

  // 대여 시스템 사진 경로 생성 헬퍼
  generatePhotoPath(
    photoType: PhotoType,
    userId: string,
    rentalId?: string
  ): string {
    switch (photoType) {
      case "student_id":
        return `student-ids/${userId}`;
      case "item_pre_pickup":
      case "item_pre_return":
        return `item-photos/${rentalId}/${photoType}`;
      case "lockbox_post_pickup":
      case "lockbox_post_return":
        return `lockbox-photos/${rentalId}`;
      default:
        throw new Error(`지원하지 않는 사진 타입입니다: ${photoType}`);
    }
  },

  // 압축된 썸네일 생성 (관리자 페이지 미리보기용)
  async createThumbnail(file: File, maxWidth: number = 300): Promise<File> {
    return this.resizeImage(file, maxWidth, 0.7);
  },

  // 배치 사진 업로드 (여러 사진 동시 업로드)
  async uploadMultiplePhotos(
    files: File[],
    photoType: PhotoType,
    userId: string,
    rentalId?: string,
    onProgress?: (totalProgress: number, fileIndex: number) => void
  ): Promise<PhotoUploadResult[]> {
    const results: PhotoUploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const result = await this.uploadRentalSystemPhoto(
        file,
        photoType,
        userId,
        rentalId,
        (progress) => {
          const totalProgress =
            ((i + progress.progress / 100) / files.length) * 100;
          if (onProgress) {
            onProgress(totalProgress, i);
          }
        }
      );

      results.push(result);
    }

    return results;
  },
};

// 🎯 대여 시스템 전용 사진 업로드 서비스 (편리한 인터페이스)
export const photoUploadService = {
  // 학생증 사진 업로드 (간편 인터페이스)
  async uploadStudentId(
    file: File,
    userId: string,
    onProgress?: (progress: number) => void
  ): Promise<PhotoUploadResult> {
    return storageService.uploadStudentIdPhoto(file, userId, (progress) => {
      if (onProgress) onProgress(progress.progress);
    });
  },

  // 물품 수령 전 사진 업로드
  async uploadItemPrePickup(
    file: File,
    rentalId: string,
    userId: string,
    onProgress?: (progress: number) => void
  ): Promise<PhotoUploadResult> {
    return storageService.uploadItemPhoto(
      file,
      rentalId,
      userId,
      "item_pre_pickup",
      (progress) => {
        if (onProgress) onProgress(progress.progress);
      }
    );
  },

  // 보관함 수령 후 사진 업로드
  async uploadLockboxPostPickup(
    file: File,
    rentalId: string,
    userId: string,
    onProgress?: (progress: number) => void
  ): Promise<PhotoUploadResult> {
    return storageService.uploadLockboxPhoto(
      file,
      rentalId,
      userId,
      "lockbox_post_pickup",
      (progress) => {
        if (onProgress) onProgress(progress.progress);
      }
    );
  },

  // 물품 반납 전 사진 업로드
  async uploadItemPreReturn(
    file: File,
    rentalId: string,
    userId: string,
    onProgress?: (progress: number) => void
  ): Promise<PhotoUploadResult> {
    return storageService.uploadItemPhoto(
      file,
      rentalId,
      userId,
      "item_pre_return",
      (progress) => {
        if (onProgress) onProgress(progress.progress);
      }
    );
  },

  // 보관함 반납 후 사진 업로드
  async uploadLockboxPostReturn(
    file: File,
    rentalId: string,
    userId: string,
    onProgress?: (progress: number) => void
  ): Promise<PhotoUploadResult> {
    return storageService.uploadLockboxPhoto(
      file,
      rentalId,
      userId,
      "lockbox_post_return",
      (progress) => {
        if (onProgress) onProgress(progress.progress);
      }
    );
  },

  // 파일 검증 (통합)
  validatePhoto(
    file: File,
    photoType: PhotoType
  ): { isValid: boolean; message?: string } {
    if (!storageService.validateRentalSystemPhoto(file, photoType)) {
      switch (photoType) {
        case "student_id":
          return {
            isValid: false,
            message:
              "학생증 사진은 JPG 또는 PNG 형식이어야 하며, 5MB 이하여야 합니다.",
          };
        case "item_pre_pickup":
        case "item_pre_return":
          return {
            isValid: false,
            message:
              "물품 사진은 JPG, PNG, WebP 형식이어야 하며, 10MB 이하여야 합니다.",
          };
        case "lockbox_post_pickup":
        case "lockbox_post_return":
          return {
            isValid: false,
            message:
              "보관함 사진은 JPG, PNG, WebP 형식이어야 하며, 8MB 이하여야 합니다.",
          };
        default:
          return {
            isValid: false,
            message: "지원하지 않는 사진 타입입니다.",
          };
      }
    }

    return { isValid: true };
  },

  // 모든 대여 관련 사진 삭제
  async deleteAllRentalPhotos(rentalId: string): Promise<void> {
    return storageService.deleteRentalPhotos(rentalId);
  },

  // 사용자의 학생증 사진 삭제
  async deleteUserStudentIdPhotos(userId: string): Promise<void> {
    return storageService.deleteStudentIdPhotos(userId);
  },
};
