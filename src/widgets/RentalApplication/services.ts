import { storage } from "../../shared/config/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { UploadedRentalPhotos } from "./types";

// 학생증 사진을 Firebase Storage에 업로드
export const uploadStudentIdPhoto = async (
  file: File,
  userId: string
): Promise<string> => {
  try {
    // 파일명 생성 (사용자ID_timestamp_studentid.확장자)
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    const fileName = `student-ids/${userId}_${timestamp}_studentid.${extension}`;

    // Firebase Storage 참조 생성
    const storageRef = ref(storage, fileName);

    // 파일 업로드
    const snapshot = await uploadBytes(storageRef, file);

    // 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error("학생증 사진 업로드 오류:", error);
    throw new Error("학생증 사진 업로드에 실패했습니다.");
  }
};

// 대여 관련 사진들을 Firebase Storage에 업로드
export const uploadRentalPhotos = async (
  photos: { itemCondition: File; itemLabel: File; lockboxSecured: File },
  userId: string,
  rentalId: string
): Promise<UploadedRentalPhotos> => {
  try {
    const timestamp = Date.now();

    // 각 사진 업로드
    const uploadPromises = [
      // 물품 상태 사진
      (async () => {
        const extension = photos.itemCondition.name.split(".").pop();
        const fileName = `rentals/${userId}/${rentalId}_${timestamp}_item_condition.${extension}`;
        const storageRef = ref(storage, fileName);
        const snapshot = await uploadBytes(storageRef, photos.itemCondition);
        return await getDownloadURL(snapshot.ref);
      })(),

      // 물품 라벨 사진
      (async () => {
        const extension = photos.itemLabel.name.split(".").pop();
        const fileName = `rentals/${userId}/${rentalId}_${timestamp}_item_label.${extension}`;
        const storageRef = ref(storage, fileName);
        const snapshot = await uploadBytes(storageRef, photos.itemLabel);
        return await getDownloadURL(snapshot.ref);
      })(),

      // 잠금함 보안 사진
      (async () => {
        const extension = photos.lockboxSecured.name.split(".").pop();
        const fileName = `rentals/${userId}/${rentalId}_${timestamp}_lockbox_secured.${extension}`;
        const storageRef = ref(storage, fileName);
        const snapshot = await uploadBytes(storageRef, photos.lockboxSecured);
        return await getDownloadURL(snapshot.ref);
      })(),
    ];

    const [itemConditionPhotoUrl, itemLabelPhotoUrl, lockboxSecuredPhotoUrl] =
      await Promise.all(uploadPromises);

    return {
      itemConditionPhotoUrl,
      itemLabelPhotoUrl,
      lockboxSecuredPhotoUrl,
    };
  } catch (error) {
    console.error("대여 사진 업로드 오류:", error);
    throw new Error("사진 업로드에 실패했습니다.");
  }
};
