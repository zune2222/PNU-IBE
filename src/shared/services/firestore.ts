import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  where,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config/firebase";

// 공지사항 타입
export interface FirestoreNotice {
  id?: string;
  title: string;
  category: string;
  content: string;
  preview: string;
  important: boolean;
  views: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 행사 타입
export interface FirestoreEvent {
  id?: string;
  title: string;
  category: string;
  description: string;
  content?: string;
  date: string;
  time: string;
  location: string;
  image: string;
  status: "upcoming" | "ongoing" | "completed";
  organizer?: string;
  contact?: string;
  registrationRequired?: boolean;
  registrationDeadline?: string;
  featured?: boolean;
  gradient?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 대여 물품 타입 (확장)
export interface FirestoreRentalItem {
  id?: string;
  name: string;
  category: string;
  description: string;
  image: string;
  available: boolean;
  condition: string;
  location: string;
  contact: string;
  campus: "yangsan" | "jangjeom"; // 캠퍼스 구분
  uniqueId: string; // 물품 고유 ID (스티커)
  totalQuantity: number; // 전체 수량
  availableQuantity: number; // 현재 대여 가능 수량
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 사용자 타입
export interface FirestoreUser {
  id?: string;
  uid: string; // Firebase Auth UID
  name: string;
  studentId: string;
  email: string;
  phone: string;
  campus: "yangsan" | "jangjeom";
  department: string;
  role: UserRole;
  isActive: boolean; // 계정 활성화 상태
  penaltyPoints: number; // 누적 벌점
  studentIdPhotoUrl?: string; // 학생증 사진 URL
  studentIdVerified: boolean; // 학생증 인증 상태

  // 제재 관련 필드
  sanctionType?: string | null; // warning, suspension_1_month, suspension_3_months, permanent_ban
  sanctionEndDate?: string | null; // 제재 종료일
  sanctionAppliedAt?: string | null; // 제재 적용일

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 사용자 역할
export type UserRole = "student" | "admin" | "manager";

// 대여 신청 상태
export type RentalStatus =
  | "pending" // 신청됨 (학생증 확인 대기)
  | "approved" // 승인됨 (비밀번호 안내)
  | "picked_up" // 수령 완료
  | "return_requested" // 반납 신청
  | "returned" // 반납 완료
  | "overdue" // 연체
  | "rejected" // 거부됨
  | "cancelled"; // 취소됨

// 대여 신청 타입
export interface FirestoreRentalApplication {
  id?: string;
  userId: string;
  itemId: string;
  itemUniqueId: string; // 실제 대여한 물품의 고유 ID
  status: RentalStatus;
  startDate: string; // 대여 시작일
  endDate: string; // 반납 예정일
  actualReturnDate?: string; // 실제 반납일
  purpose: string; // 대여 목적

  // 학생증 정보
  studentIdPhotoUrl: string;
  studentIdVerified: boolean;

  // 사진 업로드 관련
  prePickupPhotoUrl?: string; // 수령 전 물품 사진
  postPickupLockboxPhotoUrl?: string; // 수령 후 보관함 사진
  preReturnPhotoUrl?: string; // 반납 전 물품 사진
  postReturnLockboxPhotoUrl?: string; // 반납 후 보관함 사진

  // 관리자 확인
  approvedBy?: string; // 승인한 관리자 ID
  approvedAt?: Timestamp;
  rejectedReason?: string; // 거부 사유

  // 만족도 조사
  rating?: number; // 1-5 점
  feedback?: string;

  // 연체 및 벌점
  overdueDays?: number;
  penaltyPoints?: number;
  lastOverdueCheck?: Date; // 마지막 연체 확인 시간

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 사진 업로드 타입
export type PhotoType =
  | "student_id" // 학생증
  | "item_pre_pickup" // 수령 전 물품
  | "lockbox_post_pickup" // 수령 후 보관함
  | "item_pre_return" // 반납 전 물품
  | "lockbox_post_return"; // 반납 후 보관함

export interface FirestorePhotoUpload {
  id?: string;
  rentalId: string;
  userId: string;
  type: PhotoType;
  url: string;
  verified: boolean; // 관리자 확인 여부
  verifiedBy?: string; // 확인한 관리자 ID
  verifiedAt?: Timestamp;
  notes?: string; // 관리자 메모
  createdAt: Timestamp;
}

// 보관함 비밀번호 관리
export interface FirestoreLockboxPassword {
  id?: string;
  campus: "yangsan" | "jangjeom";
  location: string; // 보관함 위치 (예: "정보대학 학생회실")
  currentPassword: string;
  previousPassword?: string;
  lastChangedBy: string; // 변경한 관리자 이름
  lastChangedAt: Timestamp;
  createdAt: Timestamp;
}

// 벌점 타입
export type PenaltyType =
  | "overdue"
  | "damage"
  | "loss"
  | "violation"
  | "OVERDUE"
  | "DAMAGE_MINOR"
  | "DAMAGE_MAJOR"
  | "LOSS"
  | "RETURN_DELAY"
  | "MULTIPLE_OVERDUE"
  | "REDUCTION";

// 벌점 기록
export interface FirestorePenaltyRecord {
  id?: string;
  userId: string;
  rentalId?: string; // 관련 대여 신청 ID
  type: PenaltyType;
  points: number;
  reason: string;
  appliedBy: string; // 부여한 관리자 ID
  status: string; // active, inactive 등
  createdAt: Timestamp;
}

// 알림 설정
export interface FirestoreNotificationSettings {
  id?: string;
  discordWebhookUrl: string;
  enableRentalNotifications: boolean;
  enableReturnNotifications: boolean;
  enableOverdueNotifications: boolean;
  enableDamageNotifications: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 공지사항 서비스
export const noticeService = {
  // 모든 공지사항 가져오기
  async getAll(): Promise<FirestoreNotice[]> {
    const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreNotice)
    );
  },

  // 특정 공지사항 가져오기
  async getById(id: string): Promise<FirestoreNotice | null> {
    const docRef = doc(db, "notices", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as FirestoreNotice;
    }
    return null;
  },

  // 공지사항 추가
  async add(
    notice: Omit<FirestoreNotice, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, "notices"), {
      ...notice,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  // 공지사항 수정
  async update(id: string, notice: Partial<FirestoreNotice>): Promise<void> {
    const docRef = doc(db, "notices", id);
    await updateDoc(docRef, {
      ...notice,
      updatedAt: Timestamp.now(),
    });
  },

  // 공지사항 삭제
  async delete(id: string): Promise<void> {
    const docRef = doc(db, "notices", id);
    await deleteDoc(docRef);
  },

  // 조회수 증가
  async incrementViews(id: string): Promise<void> {
    const docRef = doc(db, "notices", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const currentViews = docSnap.data().views || 0;
      await updateDoc(docRef, {
        views: currentViews + 1,
        updatedAt: Timestamp.now(),
      });
    }
  },

  // 중요 공지사항 가져오기
  async getImportant(): Promise<FirestoreNotice[]> {
    const q = query(
      collection(db, "notices"),
      where("important", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreNotice)
    );
  },
};

// 행사 서비스
export const eventService = {
  // 모든 행사 가져오기
  async getAll(): Promise<FirestoreEvent[]> {
    const q = query(collection(db, "events"), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreEvent)
    );
  },

  // 특정 행사 가져오기
  async getById(id: string): Promise<FirestoreEvent | null> {
    const docRef = doc(db, "events", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as FirestoreEvent;
    }
    return null;
  },

  // 행사 추가
  async add(
    event: Omit<FirestoreEvent, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, "events"), {
      ...event,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  // 행사 수정
  async update(id: string, event: Partial<FirestoreEvent>): Promise<void> {
    const docRef = doc(db, "events", id);
    await updateDoc(docRef, {
      ...event,
      updatedAt: Timestamp.now(),
    });
  },

  // 행사 삭제
  async delete(id: string): Promise<void> {
    const docRef = doc(db, "events", id);
    await deleteDoc(docRef);
  },

  // 다가오는 행사 가져오기
  async getUpcoming(limitCount: number = 3): Promise<FirestoreEvent[]> {
    const q = query(
      collection(db, "events"),
      where("status", "in", ["upcoming", "ongoing"]),
      orderBy("date", "asc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreEvent)
    );
  },

  // 피처링된 행사 가져오기
  async getFeatured(): Promise<FirestoreEvent[]> {
    const q = query(
      collection(db, "events"),
      where("featured", "==", true),
      orderBy("date", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreEvent)
    );
  },
};

// 대여 물품 서비스 (확장된 버전)
export const rentalItemService = {
  // 모든 대여 물품 가져오기
  async getAll(): Promise<FirestoreRentalItem[]> {
    const q = query(collection(db, "rental_items"), orderBy("name", "asc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalItem)
    );
  },

  // 특정 대여 물품 가져오기
  async getById(id: string): Promise<FirestoreRentalItem | null> {
    const docRef = doc(db, "rental_items", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as FirestoreRentalItem;
    }
    return null;
  },

  // 고유 ID로 물품 조회
  async getByUniqueId(uniqueId: string): Promise<FirestoreRentalItem | null> {
    const q = query(
      collection(db, "rental_items"),
      where("uniqueId", "==", uniqueId),
      limit(1)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data(),
      } as FirestoreRentalItem;
    }
    return null;
  },

  // 대여 물품 추가
  async add(
    item: Omit<FirestoreRentalItem, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, "rental_items"), {
      ...item,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  // 대여 물품 수정
  async update(id: string, item: Partial<FirestoreRentalItem>): Promise<void> {
    const docRef = doc(db, "rental_items", id);
    await updateDoc(docRef, {
      ...item,
      updatedAt: Timestamp.now(),
    });
  },

  // 대여 물품 삭제
  async delete(id: string): Promise<void> {
    const docRef = doc(db, "rental_items", id);
    await deleteDoc(docRef);
  },

  // 사용 가능한 물품만 가져오기
  async getAvailable(): Promise<FirestoreRentalItem[]> {
    const q = query(
      collection(db, "rental_items"),
      where("availableQuantity", ">", 0),
      orderBy("name", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalItem)
    );
  },

  // 카테고리별 물품 가져오기
  async getByCategory(category: string): Promise<FirestoreRentalItem[]> {
    const q = query(
      collection(db, "rental_items"),
      where("category", "==", category),
      orderBy("name", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalItem)
    );
  },

  // 캠퍼스별 물품 가져오기
  async getByCampus(
    campus: "yangsan" | "jangjeom"
  ): Promise<FirestoreRentalItem[]> {
    const q = query(
      collection(db, "rental_items"),
      where("campus", "==", campus),
      orderBy("name", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalItem)
    );
  },

  // 캠퍼스별 대여 가능한 물품 가져오기
  async getAvailableByCampus(
    campus: "yangsan" | "jangjeom"
  ): Promise<FirestoreRentalItem[]> {
    const q = query(
      collection(db, "rental_items"),
      where("campus", "==", campus),
      where("availableQuantity", ">", 0),
      orderBy("name", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalItem)
    );
  },

  // 물품 대여 처리 (수량 감소)
  async rentItem(id: string): Promise<boolean> {
    const itemDoc = await getDoc(doc(db, "rental_items", id));
    if (itemDoc.exists()) {
      const currentQuantity = itemDoc.data().availableQuantity || 0;
      if (currentQuantity > 0) {
        await updateDoc(doc(db, "rental_items", id), {
          availableQuantity: currentQuantity - 1,
          available: currentQuantity - 1 > 0,
          updatedAt: Timestamp.now(),
        });
        return true;
      }
    }
    return false;
  },

  // 물품 반납 처리 (수량 증가)
  async returnItem(id: string): Promise<boolean> {
    const itemDoc = await getDoc(doc(db, "rental_items", id));
    if (itemDoc.exists()) {
      const currentQuantity = itemDoc.data().availableQuantity || 0;
      const totalQuantity = itemDoc.data().totalQuantity || 0;

      if (currentQuantity < totalQuantity) {
        await updateDoc(doc(db, "rental_items", id), {
          availableQuantity: currentQuantity + 1,
          available: true,
          updatedAt: Timestamp.now(),
        });
        return true;
      }
    }
    return false;
  },

  // 물품 상태 업데이트 (손상, 분실 등)
  async updateItemStatus(
    id: string,
    condition: string,
    availableQuantity?: number
  ): Promise<void> {
    const updateData: Partial<FirestoreRentalItem> = {
      condition,
      updatedAt: Timestamp.now(),
    };

    if (availableQuantity !== undefined) {
      updateData.availableQuantity = availableQuantity;
      updateData.available = availableQuantity > 0;
    }

    const docRef = doc(db, "rental_items", id);
    await updateDoc(docRef, updateData);
  },

  // 검색 기능 (이름, 설명, 카테고리로 검색)
  async search(
    searchTerm: string,
    campus?: "yangsan" | "jangjeom"
  ): Promise<FirestoreRentalItem[]> {
    // Firestore는 복잡한 텍스트 검색을 지원하지 않으므로 클라이언트 사이드에서 필터링
    let items: FirestoreRentalItem[];

    if (campus) {
      items = await this.getByCampus(campus);
    } else {
      items = await this.getAll();
    }

    const lowercaseSearchTerm = searchTerm.toLowerCase();
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(lowercaseSearchTerm) ||
        item.description.toLowerCase().includes(lowercaseSearchTerm) ||
        item.category.toLowerCase().includes(lowercaseSearchTerm)
    );
  },

  // 통계 데이터 가져오기
  async getStatistics(): Promise<{
    totalItems: number;
    availableItems: number;
    rentedItems: number;
    yangSanItems: number;
    jangJeomItems: number;
  }> {
    const allItems = await this.getAll();

    const totalItems = allItems.length;
    const availableItems = allItems.filter(
      (item) => item.availableQuantity > 0
    ).length;
    const rentedItems = allItems.reduce(
      (sum, item) => sum + (item.totalQuantity - item.availableQuantity),
      0
    );
    const yangSanItems = allItems.filter(
      (item) => item.campus === "yangsan"
    ).length;
    const jangJeomItems = allItems.filter(
      (item) => item.campus === "jangjeom"
    ).length;

    return {
      totalItems,
      availableItems,
      rentedItems,
      yangSanItems,
      jangJeomItems,
    };
  },

  // 인기 물품 조회 (대여 횟수 기준)
  async getPopularItems(
    limitCount: number = 5
  ): Promise<FirestoreRentalItem[]> {
    // 실제로는 대여 기록을 기반으로 계산해야 하지만, 여기서는 기본 구조만 제공
    const q = query(
      collection(db, "rental_items"),
      orderBy("name", "asc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalItem)
    );
  },
};

// 사용자 서비스
export const userService = {
  // 사용자 생성
  async createUser(
    user: Omit<FirestoreUser, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, "users"), {
      ...user,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  // UID로 사용자 조회
  async getByUid(uid: string): Promise<FirestoreUser | null> {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as FirestoreUser;
    }
    return null;
  },

  // ID로 사용자 조회
  async getById(uid: string): Promise<FirestoreUser | null> {
    return this.getByUid(uid);
  },

  // 학번으로 사용자 조회
  async getByStudentId(studentId: string): Promise<FirestoreUser | null> {
    const q = query(
      collection(db, "users"),
      where("studentId", "==", studentId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as FirestoreUser;
    }
    return null;
  },

  // 사용자 정보 업데이트
  async update(uid: string, updates: Partial<FirestoreUser>): Promise<void> {
    // uid로 문서 찾기
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      const docRef = doc(db, "users", userDoc.id);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    }
  },

  // 사용자 삭제
  async delete(uid: string): Promise<void> {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      await deleteDoc(doc(db, "users", userDoc.id));
    }
  },

  // 모든 사용자 조회
  async getAllUsers(): Promise<FirestoreUser[]> {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreUser)
    );
  },
};

// 대여 신청 서비스
export const rentalApplicationService = {
  // 대여 신청 생성
  async createApplication(
    application: Omit<
      FirestoreRentalApplication,
      "id" | "createdAt" | "updatedAt"
    >
  ): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, "rental_applications"), {
      ...application,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  // 신청 ID로 조회
  async getById(id: string): Promise<FirestoreRentalApplication | null> {
    const docRef = doc(db, "rental_applications", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as FirestoreRentalApplication;
    }
    return null;
  },

  // 사용자별 대여 신청 조회
  async getByUserId(userId: string): Promise<FirestoreRentalApplication[]> {
    const q = query(
      collection(db, "rental_applications"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalApplication)
    );
  },

  // 상태별 신청 조회
  async getByStatus(
    status: RentalStatus
  ): Promise<FirestoreRentalApplication[]> {
    const q = query(
      collection(db, "rental_applications"),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalApplication)
    );
  },

  // 현재 대여중인 물품 조회 (사용자별)
  async getCurrentRentals(
    userId: string
  ): Promise<FirestoreRentalApplication[]> {
    const q = query(
      collection(db, "rental_applications"),
      where("userId", "==", userId),
      where("status", "in", ["approved", "picked_up"]),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalApplication)
    );
  },

  // 현재 활성 대여 조회 (모든 사용자)
  async getActiveRentals(): Promise<FirestoreRentalApplication[]> {
    const q = query(
      collection(db, "rental_applications"),
      where("status", "in", ["picked_up", "overdue"]),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalApplication)
    );
  },

  // 연체 대여 조회 (모든 사용자)
  async getOverdueRentals(): Promise<FirestoreRentalApplication[]> {
    const q = query(
      collection(db, "rental_applications"),
      where("status", "==", "overdue"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalApplication)
    );
  },

  // 사용자별 연체 대여 조회
  async getUserOverdueRentals(
    userId: string
  ): Promise<FirestoreRentalApplication[]> {
    const q = query(
      collection(db, "rental_applications"),
      where("userId", "==", userId),
      where("status", "==", "overdue"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalApplication)
    );
  },

  // 신청 상태 업데이트
  async updateStatus(
    id: string,
    status: RentalStatus,
    additionalData?: Partial<FirestoreRentalApplication>
  ): Promise<void> {
    const docRef = doc(db, "rental_applications", id);
    await updateDoc(docRef, {
      status,
      ...additionalData,
      updatedAt: Timestamp.now(),
    });
  },

  // 신청 승인
  async approveApplication(id: string, approvedBy: string): Promise<void> {
    const docRef = doc(db, "rental_applications", id);
    await updateDoc(docRef, {
      status: "approved",
      approvedBy,
      approvedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
  },

  // 신청 거부
  async rejectApplication(id: string, reason: string): Promise<void> {
    const docRef = doc(db, "rental_applications", id);
    await updateDoc(docRef, {
      status: "rejected",
      rejectedReason: reason,
      updatedAt: Timestamp.now(),
    });
  },

  // 연체 처리
  async markAsOverdue(
    id: string,
    overdueDays: number,
    penaltyPoints: number
  ): Promise<void> {
    const docRef = doc(db, "rental_applications", id);
    await updateDoc(docRef, {
      status: "overdue",
      overdueDays,
      penaltyPoints,
      updatedAt: Timestamp.now(),
    });
  },

  // 모든 신청 조회 (관리자용)
  async getAllApplications(): Promise<FirestoreRentalApplication[]> {
    const q = query(
      collection(db, "rental_applications"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalApplication)
    );
  },
};

// 사진 업로드 서비스
export const photoUploadService = {
  // 사진 업로드 기록 생성
  async createPhotoRecord(
    photo: Omit<FirestorePhotoUpload, "id" | "createdAt">
  ): Promise<string> {
    const docRef = await addDoc(collection(db, "photo_uploads"), {
      ...photo,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // 대여 신청별 사진 조회
  async getByRentalId(rentalId: string): Promise<FirestorePhotoUpload[]> {
    const q = query(
      collection(db, "photo_uploads"),
      where("rentalId", "==", rentalId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestorePhotoUpload)
    );
  },

  // 사진 타입별 조회
  async getByType(type: PhotoType): Promise<FirestorePhotoUpload[]> {
    const q = query(
      collection(db, "photo_uploads"),
      where("type", "==", type),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestorePhotoUpload)
    );
  },

  // 사진 검증 상태 업데이트
  async verifyPhoto(
    id: string,
    verified: boolean,
    verifiedBy: string,
    notes?: string
  ): Promise<void> {
    const docRef = doc(db, "photo_uploads", id);
    await updateDoc(docRef, {
      verified,
      verifiedBy,
      verifiedAt: Timestamp.now(),
      notes,
    });
  },

  // 미검증 사진 조회
  async getUnverifiedPhotos(): Promise<FirestorePhotoUpload[]> {
    const q = query(
      collection(db, "photo_uploads"),
      where("verified", "==", false),
      orderBy("createdAt", "asc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestorePhotoUpload)
    );
  },
};

// 보관함 비밀번호 서비스
export const lockboxPasswordService = {
  // 비밀번호 생성/업데이트
  async updatePassword(
    campus: "yangsan" | "jangjeom",
    location: string,
    newPassword: string,
    changedBy: string
  ): Promise<string> {
    // 기존 비밀번호 조회
    const q = query(
      collection(db, "lockbox_passwords"),
      where("campus", "==", campus),
      where("location", "==", location)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // 기존 비밀번호 업데이트
      const docRef = querySnapshot.docs[0].ref;
      const currentData = querySnapshot.docs[0].data();

      await updateDoc(docRef, {
        previousPassword: currentData.currentPassword,
        currentPassword: newPassword,
        lastChangedBy: changedBy,
        lastChangedAt: Timestamp.now(),
      });

      return querySnapshot.docs[0].id;
    } else {
      // 새 비밀번호 생성
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, "lockbox_passwords"), {
        campus,
        location,
        currentPassword: newPassword,
        lastChangedBy: changedBy,
        lastChangedAt: now,
        createdAt: now,
      });
      return docRef.id;
    }
  },

  // 현재 비밀번호 조회
  async getCurrentPassword(
    campus: "yangsan" | "jangjeom",
    location: string
  ): Promise<FirestoreLockboxPassword | null> {
    const q = query(
      collection(db, "lockbox_passwords"),
      where("campus", "==", campus),
      where("location", "==", location)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data(),
      } as FirestoreLockboxPassword;
    }
    return null;
  },

  // 모든 보관함 비밀번호 조회
  async getAllPasswords(): Promise<FirestoreLockboxPassword[]> {
    const q = query(collection(db, "lockbox_passwords"), orderBy("campus"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreLockboxPassword)
    );
  },
};

// 벌점 기록 서비스
export const penaltyRecordService = {
  // 벌점 기록 생성
  async createPenaltyRecord(
    penalty: Omit<FirestorePenaltyRecord, "id" | "createdAt">
  ): Promise<string> {
    const docRef = await addDoc(collection(db, "penalty_records"), {
      ...penalty,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // 벌점 기록 추가 (별칭)
  async add(
    penalty: Omit<FirestorePenaltyRecord, "id" | "createdAt">
  ): Promise<string> {
    return this.createPenaltyRecord(penalty);
  },

  // 사용자별 벌점 기록 조회
  async getByUserId(userId: string): Promise<FirestorePenaltyRecord[]> {
    const q = query(
      collection(db, "penalty_records"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestorePenaltyRecord)
    );
  },

  // 벌점 타입별 조회
  async getByType(type: PenaltyType): Promise<FirestorePenaltyRecord[]> {
    const q = query(
      collection(db, "penalty_records"),
      where("type", "==", type),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestorePenaltyRecord)
    );
  },

  // 모든 벌점 기록 조회
  async getAllPenaltyRecords(): Promise<FirestorePenaltyRecord[]> {
    const q = query(
      collection(db, "penalty_records"),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestorePenaltyRecord)
    );
  },
};

// 알림 설정 서비스
export const notificationSettingsService = {
  // 설정 업데이트
  async updateSettings(
    settings: Omit<
      FirestoreNotificationSettings,
      "id" | "createdAt" | "updatedAt"
    >
  ): Promise<string> {
    const q = query(collection(db, "notification_settings"));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // 기존 설정 업데이트
      const docRef = querySnapshot.docs[0].ref;
      await updateDoc(docRef, {
        ...settings,
        updatedAt: Timestamp.now(),
      });
      return querySnapshot.docs[0].id;
    } else {
      // 새 설정 생성
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, "notification_settings"), {
        ...settings,
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    }
  },

  // 현재 설정 조회
  async getSettings(): Promise<FirestoreNotificationSettings | null> {
    const q = query(collection(db, "notification_settings"));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data(),
      } as FirestoreNotificationSettings;
    }
    return null;
  },
};
