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

// 대여 물품 타입
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

// 대여 물품 서비스
export const rentalService = {
  // 모든 대여 물품 가져오기
  async getAll(): Promise<FirestoreRentalItem[]> {
    const q = query(collection(db, "rentals"), orderBy("name", "asc"));
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
    const docRef = doc(db, "rentals", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as FirestoreRentalItem;
    }
    return null;
  },

  // 대여 물품 추가
  async add(
    item: Omit<FirestoreRentalItem, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, "rentals"), {
      ...item,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  // 대여 물품 수정
  async update(id: string, item: Partial<FirestoreRentalItem>): Promise<void> {
    const docRef = doc(db, "rentals", id);
    await updateDoc(docRef, {
      ...item,
      updatedAt: Timestamp.now(),
    });
  },

  // 대여 물품 삭제
  async delete(id: string): Promise<void> {
    const docRef = doc(db, "rentals", id);
    await deleteDoc(docRef);
  },

  // 사용 가능한 물품만 가져오기
  async getAvailable(): Promise<FirestoreRentalItem[]> {
    const q = query(
      collection(db, "rentals"),
      where("available", "==", true),
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
      collection(db, "rentals"),
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
};
