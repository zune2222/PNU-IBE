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
};
