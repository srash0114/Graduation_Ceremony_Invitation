import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue, remove, onDisconnect } from "firebase/database";
import { useState, useEffect } from "react";

// 1. Cấu hình Firebase
// TẠO PROJECT FIREBASE MỚI VÀ THAY THẾ CONFIG NÀY BẰNG CONFIG CỦA BẠN.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Khởi tạo app (kiểm tra window để tránh lỗi SSR)
const app = typeof window !== "undefined" ? initializeApp(firebaseConfig) : null;
export const database = app ? getDatabase(app) : null;

/**
 * Hàm cập nhật vị trí của bạn lên Firebase
 * Dành riêng cho người chủ (Host)
 */
export const updateLiveLocation = (lat: number, lng: number) => {
  if (!database) return;
  const locationRef = ref(database, 'liveLocation/myPosition');
  
  // Tự động xóa vị trí trên database nếu người dùng đóng tab trình duyệt hoặc mất kết nối mạng
  onDisconnect(locationRef).remove();

  set(locationRef, {
    lat,
    lng,
    timestamp: Date.now()
  });
};

/**
 * Hàm xóa vị trí khi người chủ tắt GPS
 */
export const stopLiveLocation = () => {
  if (!database) return;
  const locationRef = ref(database, 'liveLocation/myPosition');
  remove(locationRef);
};

/**
 * Hook tùy chỉnh để khách mời lắng nghe vị trí của chủ nhân thiệp từ Firebase
 * Khách mời sẽ thấy icon di chuyển trên bản đồ.
 */
export const useGuestLiveLocation = () => {
  const [hostLocation, setHostLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (!database) return;
    const locationRef = ref(database, 'liveLocation/myPosition');
    
    // Lắng nghe sự thay đổi dữ liệu realtime
    const unsubscribe = onValue(locationRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.lat && data.lng) {
        // Nếu vị trí không được cập nhật trong vòng 2 phút (do tắt máy, mất mạng, v.v.), tự động coi như đã TẮT (Offline)
        const isStale = Date.now() - data.timestamp > 2 * 60 * 1000;
        if (!isStale) {
          setHostLocation({ lat: data.lat, lng: data.lng });
        } else {
          setHostLocation(null);
        }
      } else {
        // Nếu không có data (chủ nhân đã tắt GPS)
        setHostLocation(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return hostLocation;
};
