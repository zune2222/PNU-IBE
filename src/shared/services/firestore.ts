import {
  collection,
  doc,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
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

// 물품 타입 (개별 물품 기준)
export interface FirestoreRentalItem {
  id?: string; // 컬렉션 문서 ID
  uniqueId: string; // 물품 고유 ID (스티커/라벨에 적힌 번호)
  name: string; // 물품명 (예: "우산")
  category: string; // 카테고리
  description: string; // 상세 설명
  image: string; // 대표 이미지
  condition: string; // 물품 상태 (양호, 보통, 불량)
  status: "available" | "rented" | "maintenance" | "lost" | "damaged"; // 현재 상태
  location: string; // 보관 위치
  contact: string; // 담당자 연락처
  campus: "yangsan" | "jangjeom"; // 캠퍼스 구분
  lockboxPassword?: string; // 보관함 자물쇠 비밀번호

  // 대여 정보
  currentRentalId?: string; // 현재 대여 중인 신청 ID (있을 경우)
  lastRentedDate?: string; // 마지막 대여일
  totalRentCount: number; // 총 대여 횟수

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 물품 그룹 (같은 종류의 물품들을 묶어서 관리)
export interface FirestoreItemGroup {
  id?: string;
  name: string; // 물품명 (예: "우산")
  category: string;
  description: string;
  image: string;
  campus: "yangsan" | "jangjeom";
  location: string;
  contact: string;

  // 그룹 통계
  totalCount: number; // 전체 개수
  availableCount: number; // 대여 가능 개수
  rentedCount: number; // 대여 중 개수
  maintenanceCount: number; // 정비 중 개수

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
  
  // 경고 시스템 (반납 지연용)
  warningCount?: number; // 경고 누적 횟수 (30분 이내 지연)
  lastWarningDate?: string; // 마지막 경고 부여일

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 학번 기반 제재 기록 (회원가입 없는 서비스용)
export interface FirestoreStudentSanction {
  id?: string;
  studentId: string; // 학번
  studentName: string; // 학생 이름
  
  // 제재 정보
  sanctionType: "warning" | "suspension_1_week" | "suspension_1_month" | "permanent_ban";
  sanctionReason: string; // 제재 사유
  sanctionStartDate: string; // 제재 시작일
  sanctionEndDate?: string; // 제재 종료일 (영구제재시 null)
  
  // 경고 누적 (30분 이내 지연용)
  warningCount: number; // 현재 경고 누적 횟수
  totalWarnings: number; // 전체 경고 누적 횟수
  lastWarningDate?: string; // 마지막 경고 부여일
  
  // 관련 대여 신청
  relatedRentalId?: string; // 제재 원인이 된 대여 신청 ID
  
  // 상태
  isActive: boolean; // 현재 제재 활성 상태
  
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 사용자 역할
export type UserRole = "student" | "admin" | "manager";

// 대여 신청 상태 (셀프 서비스 방식)
export type RentalStatus =
  | "rented" // 대여 중 (즉시 대여됨)
  | "returned" // 반납 완료
  | "overdue" // 연체
  | "lost" // 분실
  | "damaged"; // 파손

// 대여 신청 타입 (셀프 서비스 방식)
export interface FirestoreRentalApplication {
  id?: string;
  userId: string;
  itemId: string; // 물품 그룹 ID
  itemUniqueId: string; // 실제 대여한 개별 물품의 고유 ID
  status: RentalStatus;
  rentDate: string; // 실제 대여일 (서버 시간 기준 자동 설정)
  dueDate: string; // 반납 마감일 (대여일 + 24시간 자동 계산)
  actualReturnDate?: string; // 실제 반납일
  purpose: string; // 대여 목적

  // 학생 정보 (학생증 인증 필수)
  studentId: string;
  studentName: string;
  department: string;
  campus: "yangsan" | "jangjeom";
  phoneNumber: string; // 휴대폰 번호 (필수)

  // 학생증 정보
  studentIdPhotoUrl: string;
  studentIdVerified: boolean;

  // 대여 시 촬영 사진들 (필수)
  itemConditionPhotoUrl: string; // 물품 상태 확인 사진
  itemLabelPhotoUrl: string; // 물품 라벨 확인 사진
  lockboxSecuredPhotoUrl: string; // 자물쇠 잠금 확인 사진

  // 반납 시 촬영 사진들 (반납 시에만)
  returnItemConditionPhotoUrl?: string; // 반납 시 물품 상태 사진
  returnLockboxSecuredPhotoUrl?: string; // 반납 시 자물쇠 잠금 확인 사진

  // 만족도 조사 (반납 후 선택사항)
  rating?: number; // 1-5 점
  feedback?: string;

  // 연체 및 벌점
  overdueDays?: number;
  penaltyPoints?: number;
  lastOverdueCheck?: Date; // 마지막 연체 확인 시간

  // 분실/파손 사유
  lostReason?: string; // 분실 사유
  damageReason?: string; // 파손 사유

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
    const querySnapshot = await getDocs(collection(db, "notices"));
    const notices = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreNotice)
    );
    return notices.sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
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
    const q = query(collection(db, "notices"), where("important", "==", true));
    const querySnapshot = await getDocs(q);
    const notices = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreNotice)
    );
    // 클라이언트에서 정렬하고 제한
    return notices
      .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
      .slice(0, 5);
  },
};

// 행사 서비스
export const eventService = {
  // 모든 행사 가져오기
  async getAll(): Promise<FirestoreEvent[]> {
    const querySnapshot = await getDocs(collection(db, "events"));
    const events = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreEvent)
    );
    return events.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
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
    // 모든 행사를 가져온 후 클라이언트에서 필터링
    const allEvents = await this.getAll();
    return allEvents
      .filter(
        (event) => event.status === "upcoming" || event.status === "ongoing"
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, limitCount);
  },

  // 피처링된 행사 가져오기
  async getFeatured(): Promise<FirestoreEvent[]> {
    const q = query(collection(db, "events"), where("featured", "==", true));
    const querySnapshot = await getDocs(q);
    const events = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreEvent)
    );
    return events.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },
};

// 대여 물품 서비스 (확장된 버전)
export const rentalItemService = {
  // 모든 대여 물품 가져오기
  async getAll(): Promise<FirestoreRentalItem[]> {
    const querySnapshot = await getDocs(collection(db, "rental_items"));
    const items = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalItem)
    );
    return items.sort((a, b) => a.name.localeCompare(b.name));
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
      where("status", "==", "available")
    );
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalItem)
    );
    return items.sort((a, b) => a.name.localeCompare(b.name));
  },

  // 카테고리별 물품 가져오기
  async getByCategory(category: string): Promise<FirestoreRentalItem[]> {
    const q = query(
      collection(db, "rental_items"),
      where("category", "==", category)
    );
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalItem)
    );
    return items.sort((a, b) => a.name.localeCompare(b.name));
  },

  // 캠퍼스별 물품 가져오기
  async getByCampus(
    campus: "yangsan" | "jangjeom"
  ): Promise<FirestoreRentalItem[]> {
    const q = query(
      collection(db, "rental_items"),
      where("campus", "==", campus)
    );
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalItem)
    );
    return items.sort((a, b) => a.name.localeCompare(b.name));
  },

  // 캠퍼스별 대여 가능한 물품 가져오기
  async getAvailableByCampus(
    campus: "yangsan" | "jangjeom"
  ): Promise<FirestoreRentalItem[]> {
    const q = query(
      collection(db, "rental_items"),
      where("campus", "==", campus),
      where("status", "==", "available")
    );
    const querySnapshot = await getDocs(q);
    const items = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalItem)
    );
    return items.sort((a, b) => a.name.localeCompare(b.name));
  },

  // 물품 대여 처리 (상태 변경)
  async rentItem(itemId: string, rentalId: string): Promise<boolean> {
    try {
      const docRef = doc(db, "rental_items", itemId);

      // 문서 존재 여부 확인
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.error(`물품을 찾을 수 없습니다. itemId: ${itemId}`);
        return false;
      }

      const currentData = docSnap.data();
      await updateDoc(docRef, {
        status: "rented",
        currentRentalId: rentalId,
        lastRentedDate: new Date().toISOString().split("T")[0],
        totalRentCount: (currentData?.totalRentCount || 0) + 1,
        updatedAt: Timestamp.now(),
      });
      return true;
    } catch (error) {
      console.error("물품 대여 처리 오류:", error);
      return false;
    }
  },

  // 물품 반납 처리 (상태 변경)
  async returnItem(itemId: string): Promise<boolean> {
    try {
      const docRef = doc(db, "rental_items", itemId);
      await updateDoc(docRef, {
        status: "available",
        currentRentalId: null,
        updatedAt: Timestamp.now(),
      });
      return true;
    } catch (error) {
      console.error("물품 반납 처리 오류:", error);
      return false;
    }
  },

  // 물품 상태 업데이트 (손상, 분실 등)
  async updateItemStatus(
    id: string,
    status: "available" | "rented" | "maintenance" | "lost" | "damaged",
    condition?: string
  ): Promise<void> {
    const updateData: Partial<FirestoreRentalItem> = {
      status,
      updatedAt: Timestamp.now(),
    };

    if (condition !== undefined) {
      updateData.condition = condition;
    }

    const docRef = doc(db, "rental_items", id);
    await updateDoc(docRef, updateData);
  },

  // 검색 기능 (이름, 설명, 카테고리로 검색)
  async search(
    searchTerm: string,
    campus?: "yangsan" | "jangjeom"
  ): Promise<FirestoreRentalItem[]> {
    // 모든 아이템을 가져온 후 클라이언트에서 필터링
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
      (item) => item.status === "available"
    ).length;
    const rentedItems = allItems.filter(
      (item) => item.status === "rented"
    ).length;
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
    // 모든 아이템을 가져온 후 제한
    const allItems = await this.getAll();
    return allItems.slice(0, limitCount);
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
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreUser)
    );
    return users.sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
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
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const applications = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalApplication)
    );
    // 클라이언트에서 정렬
    return applications.sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
    );
  },

  // 상태별 신청 조회
  async getByStatus(
    status: RentalStatus
  ): Promise<FirestoreRentalApplication[]> {
    const q = query(
      collection(db, "rental_applications"),
      where("status", "==", status)
    );
    const querySnapshot = await getDocs(q);
    const applications = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalApplication)
    );
    // 클라이언트에서 정렬
    return applications.sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
    );
  },

  // 현재 대여중인 물품 조회 (사용자별)
  async getCurrentRentals(
    userId: string
  ): Promise<FirestoreRentalApplication[]> {
    // 사용자별로 먼저 조회한 후 클라이언트에서 상태 필터링
    const userApplications = await this.getByUserId(userId);
    return userApplications.filter((app) => app.status === "rented");
  },

  // 현재 활성 대여 조회 (모든 사용자)
  async getActiveRentals(): Promise<FirestoreRentalApplication[]> {
    // 모든 신청을 가져온 후 클라이언트에서 필터링
    const allApplications = await this.getAllApplications();
    return allApplications.filter(
      (app) => app.status === "rented" || app.status === "overdue"
    );
  },

  // 연체 대여 조회 (모든 사용자)
  async getOverdueRentals(): Promise<FirestoreRentalApplication[]> {
    const q = query(
      collection(db, "rental_applications"),
      where("status", "==", "overdue")
    );
    const querySnapshot = await getDocs(q);
    const applications = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalApplication)
    );
    return applications.sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
    );
  },

  // 사용자별 연체 대여 조회
  async getUserOverdueRentals(
    userId: string
  ): Promise<FirestoreRentalApplication[]> {
    // 사용자별로 먼저 조회한 후 클라이언트에서 상태 필터링
    const userApplications = await this.getByUserId(userId);
    return userApplications.filter((app) => app.status === "overdue");
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

  // 즉시 대여 처리 (셀프 서비스)
  async processRental(
    applicationData: Omit<
      FirestoreRentalApplication,
      "id" | "createdAt" | "updatedAt"
    >
  ): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, "rental_applications"), {
      ...applicationData,
      status: "rented",
      createdAt: now,
      updatedAt: now,
    });

    // 물품의 상태를 대여 중으로 변경 (itemId를 사용)
    const rentItemSuccess = await rentalItemService.rentItem(
      applicationData.itemId,
      docRef.id
    );

    if (!rentItemSuccess) {
      // 물품 상태 업데이트 실패 시 대여 신청도 삭제
      await deleteDoc(docRef);
      throw new Error(
        `물품을 찾을 수 없습니다. itemId: ${applicationData.itemId}`
      );
    }

    return docRef.id;
  },

  // 반납 처리
  async processReturn(
    id: string,
    returnPhotos: {
      returnItemConditionPhotoUrl: string;
      returnLockboxSecuredPhotoUrl: string;
    },
    rating?: number,
    feedback?: string
  ): Promise<void> {
    const rental = await this.getById(id);
    if (!rental) throw new Error("대여 신청을 찾을 수 없습니다.");

    const docRef = doc(db, "rental_applications", id);
    await updateDoc(docRef, {
      status: "returned",
      actualReturnDate: new Date().toISOString().split("T")[0],
      ...returnPhotos,
      rating,
      feedback,
      updatedAt: Timestamp.now(),
    });

    // 물품의 사용 가능 수량 증가
    await rentalItemService.returnItem(rental.itemId);
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
      lastOverdueCheck: new Date(),
      updatedAt: Timestamp.now(),
    });
  },

  // 분실 처리
  async markAsLost(id: string, reason: string): Promise<void> {
    const docRef = doc(db, "rental_applications", id);
    await updateDoc(docRef, {
      status: "lost",
      lostReason: reason,
      updatedAt: Timestamp.now(),
    });
  },

  // 파손 처리
  async markAsDamaged(id: string, reason: string): Promise<void> {
    const docRef = doc(db, "rental_applications", id);
    await updateDoc(docRef, {
      status: "damaged",
      damageReason: reason,
      updatedAt: Timestamp.now(),
    });
  },

  // 모든 신청 조회 (관리자용)
  async getAllApplications(): Promise<FirestoreRentalApplication[]> {
    const querySnapshot = await getDocs(collection(db, "rental_applications"));
    const applications = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreRentalApplication)
    );
    return applications.sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
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
      where("rentalId", "==", rentalId)
    );
    const querySnapshot = await getDocs(q);
    const photos = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestorePhotoUpload)
    );
    return photos.sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
    );
  },

  // 사진 타입별 조회
  async getByType(type: PhotoType): Promise<FirestorePhotoUpload[]> {
    const q = query(collection(db, "photo_uploads"), where("type", "==", type));
    const querySnapshot = await getDocs(q);
    const photos = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestorePhotoUpload)
    );
    return photos.sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
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
      where("verified", "==", false)
    );
    const querySnapshot = await getDocs(q);
    const photos = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestorePhotoUpload)
    );
    return photos.sort(
      (a, b) => a.createdAt.toMillis() - b.createdAt.toMillis()
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
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    const penalties = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestorePenaltyRecord)
    );
    return penalties.sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
    );
  },

  // 벌점 타입별 조회
  async getByType(type: PenaltyType): Promise<FirestorePenaltyRecord[]> {
    const q = query(
      collection(db, "penalty_records"),
      where("type", "==", type)
    );
    const querySnapshot = await getDocs(q);
    const penalties = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestorePenaltyRecord)
    );
    return penalties.sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
    );
  },

  // 모든 벌점 기록 조회
  async getAllPenaltyRecords(): Promise<FirestorePenaltyRecord[]> {
    const querySnapshot = await getDocs(collection(db, "penalty_records"));
    const penalties = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestorePenaltyRecord)
    );
    return penalties.sort(
      (a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()
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

  // 캠퍼스별 비밀번호 조회 (location 무관)
  async getCurrentPasswordByCampus(
    campus: "yangsan" | "jangjeom"
  ): Promise<FirestoreLockboxPassword | null> {
    const q = query(
      collection(db, "lockbox_passwords"),
      where("campus", "==", campus)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // 여러 개가 있을 경우 가장 최근에 변경된 것을 반환
      const passwords = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as FirestoreLockboxPassword)
      );

      // lastChangedAt 기준으로 내림차순 정렬하여 가장 최근 것 반환
      passwords.sort(
        (a, b) => b.lastChangedAt.toMillis() - a.lastChangedAt.toMillis()
      );
      return passwords[0];
    }
    return null;
  },

  // 모든 보관함 비밀번호 조회
  async getAllPasswords(): Promise<FirestoreLockboxPassword[]> {
    const querySnapshot = await getDocs(collection(db, "lockbox_passwords"));
    const passwords = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as FirestoreLockboxPassword)
    );
    return passwords.sort((a, b) => a.campus.localeCompare(b.campus));
  },
};

// 학번 기반 제재 관리 서비스
export const studentSanctionService = {
  // 학번으로 현재 활성 제재 조회
  async getActiveByStudentId(studentId: string): Promise<FirestoreStudentSanction | null> {
    const q = query(
      collection(db, "student_sanctions"),
      where("studentId", "==", studentId),
      where("isActive", "==", true)
    );
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      return {
        id: querySnapshot.docs[0].id,
        ...querySnapshot.docs[0].data(),
      } as FirestoreStudentSanction;
    }
    return null;
  },

  // 제재 기록 생성/업데이트
  async createOrUpdateSanction(
    studentId: string,
    studentName: string,
    sanctionType: "warning" | "suspension_1_week" | "suspension_1_month" | "permanent_ban",
    reason: string,
    relatedRentalId?: string
  ): Promise<string> {
    const now = Timestamp.now();
    const today = new Date().toISOString();
    
    // 기존 제재 확인
    const existingSanction = await this.getActiveByStudentId(studentId);
    
    if (existingSanction) {
      // 기존 제재 업데이트
      const sanctionRef = doc(db, "student_sanctions", existingSanction.id!);
      
      const updateData: Partial<FirestoreStudentSanction> = {
        sanctionType,
        sanctionReason: reason,
        sanctionStartDate: today,
        updatedAt: now,
      };
      
      // 경고인 경우 카운트 증가
      if (sanctionType === "warning") {
        updateData.warningCount = (existingSanction.warningCount || 0) + 1;
        updateData.totalWarnings = (existingSanction.totalWarnings || 0) + 1;
        updateData.lastWarningDate = today;
      } else {
        // 다른 제재인 경우 종료일 설정
        const endDate = new Date();
        if (sanctionType === "suspension_1_week") {
          endDate.setDate(endDate.getDate() + 7);
          updateData.sanctionEndDate = endDate.toISOString();
        } else if (sanctionType === "suspension_1_month") {
          endDate.setMonth(endDate.getMonth() + 1);
          updateData.sanctionEndDate = endDate.toISOString();
        }
        // permanent_ban은 종료일 없음
      }
      
      if (relatedRentalId) {
        updateData.relatedRentalId = relatedRentalId;
      }
      
      await updateDoc(sanctionRef, updateData);
      return existingSanction.id!;
    } else {
      // 새 제재 생성
      const sanctionData: Omit<FirestoreStudentSanction, "id"> = {
        studentId,
        studentName,
        sanctionType,
        sanctionReason: reason,
        sanctionStartDate: today,
        warningCount: sanctionType === "warning" ? 1 : 0,
        totalWarnings: sanctionType === "warning" ? 1 : 0,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };
      
      // 제재 종료일 설정
      if (sanctionType === "suspension_1_week") {
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + 7);
        sanctionData.sanctionEndDate = endDate.toISOString();
      } else if (sanctionType === "suspension_1_month") {
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1);
        sanctionData.sanctionEndDate = endDate.toISOString();
      }
      
      if (sanctionType === "warning") {
        sanctionData.lastWarningDate = today;
      }
      
      if (relatedRentalId) {
        sanctionData.relatedRentalId = relatedRentalId;
      }
      
      const docRef = await addDoc(collection(db, "student_sanctions"), sanctionData);
      return docRef.id;
    }
  },

  // 제재 해제
  async deactivateSanction(studentId: string): Promise<void> {
    const activeSanction = await this.getActiveByStudentId(studentId);
    if (activeSanction) {
      const sanctionRef = doc(db, "student_sanctions", activeSanction.id!);
      await updateDoc(sanctionRef, {
        isActive: false,
        updatedAt: Timestamp.now(),
      });
    }
  },

  // 경고 3회 체크 후 1주일 제재 적용
  async checkWarningThreshold(studentId: string, studentName: string): Promise<boolean> {
    const activeSanction = await this.getActiveByStudentId(studentId);
    
    if (activeSanction && activeSanction.warningCount >= 3) {
      // 경고 3회 도달 시 1주일 제재로 변경
      await this.createOrUpdateSanction(
        studentId,
        studentName,
        "suspension_1_week",
        "경고 3회 누적으로 인한 1주일 대여 제한"
      );
      return true;
    }
    return false;
  },

  // 학번으로 대여 가능 여부 확인
  async checkEligibility(studentId: string): Promise<{
    eligible: boolean;
    reason?: string;
    sanctionEndDate?: string;
  }> {
    const activeSanction = await this.getActiveByStudentId(studentId);
    
    if (!activeSanction) {
      return { eligible: true };
    }
    
    // 제재 종료일 확인
    if (activeSanction.sanctionEndDate) {
      const endDate = new Date(activeSanction.sanctionEndDate);
      const now = new Date();
      
      if (now >= endDate) {
        // 제재 기간 만료 - 비활성화
        await this.deactivateSanction(studentId);
        return { eligible: true };
      }
      
      // 아직 제재 중
      const sanctionTypeMap: Record<string, string> = {
        "warning": "경고",
        "suspension_1_week": "1주일",
        "suspension_1_month": "1개월",
        "permanent_ban": "영구"
      };
      
      return {
        eligible: false,
        reason: `${sanctionTypeMap[activeSanction.sanctionType] || activeSanction.sanctionType} 대여 제한 중입니다. (해제일: ${endDate.toLocaleDateString()})`,
        sanctionEndDate: activeSanction.sanctionEndDate,
      };
    }
    
    // 영구 제재
    if (activeSanction.sanctionType === "permanent_ban") {
      return {
        eligible: false,
        reason: "영구 대여 제한 상태입니다. 학생회에 문의하세요.",
      };
    }
    
    // 경고는 대여 가능
    if (activeSanction.sanctionType === "warning") {
      return { eligible: true };
    }
    
    return { eligible: true };
  },

  // 모든 제재 기록 조회 (관리자용)
  async getAllSanctions(): Promise<FirestoreStudentSanction[]> {
    const querySnapshot = await getDocs(collection(db, "student_sanctions"));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as FirestoreStudentSanction));
  },

  // 학번별 제재 이력 조회
  async getSanctionHistory(studentId: string): Promise<FirestoreStudentSanction[]> {
    const q = query(
      collection(db, "student_sanctions"),
      where("studentId", "==", studentId)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as FirestoreStudentSanction));
  },
};
