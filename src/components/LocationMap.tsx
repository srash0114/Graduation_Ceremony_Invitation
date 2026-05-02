"use client";

import dynamic from "next/dynamic";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useState, useEffect, Suspense } from "react";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { updateLiveLocation, stopLiveLocation, useGuestLiveLocation } from "@/lib/live-tracking";

// Dynamically import Map with SSR disabled
const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center">
      <p className="text-slate-400">Đang tải bản đồ...</p>
    </div>
  ),
});

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // km
  const p = Math.PI / 180;
  const a = 0.5 - Math.cos((lat2 - lat1) * p)/2 + 
            Math.cos(lat1 * p) * Math.cos(lat2 * p) * 
            (1 - Math.cos((lon2 - lon1) * p))/2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

function LocationMapContent() {
  const searchParams = useSearchParams();
  const isHostView = searchParams.get("host") === "1"; // URL có ?host=1 thì là chủ nhân thiệp

  // State chung: Lấy vị trí thiết bị hiện tại (Dùng cho cả Host phát sóng và Guest xem mình ở đâu)
  const myLocation = useGeolocation();

  // State cho HOST
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // State cho GUEST (lắng nghe Firebase)
  const guestObservedHostLocation = useGuestLiveLocation();

  // Effect của HOST: Nếu đang bật phát sóng và có tọa độ -> Đẩy lên Firebase
  // Đồng thời liên tục cập nhật timestamp mỗi 30s (Heartbeat) để Guest biết Host vẫn online dù đang đứng yên (chờ đèn đỏ, v.v.)
  useEffect(() => {
    if (isHostView && isBroadcasting && myLocation.latitude && myLocation.longitude) {
      // Gửi ngay lập tức khi vị trí thay đổi
      updateLiveLocation(myLocation.latitude, myLocation.longitude);

      // Thiết lập vòng lặp gửi lại mỗi 30 giây để xác nhận "vẫn đang sống"
      const interval = setInterval(() => {
        updateLiveLocation(myLocation.latitude!, myLocation.longitude!);
      }, 30 * 1000);

      return () => clearInterval(interval);
    }
  }, [isHostView, isBroadcasting, myLocation.latitude, myLocation.longitude]);

  // Handle khi Host đóng tab/trình duyệt đột ngột
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isHostView && isBroadcasting) {
        stopLiveLocation();
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isHostView, isBroadcasting]);

  // Handle tắt phát sóng thủ công
  const toggleBroadcasting = () => {
    if (isBroadcasting) {
      setIsBroadcasting(false);
      stopLiveLocation();
    } else {
      setIsBroadcasting(true);
    }
  };

  // Xác định vị trí Host và Guest cho Map
  const hostLocationForMap = isHostView 
    ? (isBroadcasting && myLocation.latitude && myLocation.longitude ? { lat: myLocation.latitude, lng: myLocation.longitude } : null)
    : guestObservedHostLocation;

  const guestLocationForMap = !isHostView && myLocation.latitude && myLocation.longitude
    ? { lat: myLocation.latitude, lng: myLocation.longitude }
    : null;

  // Tính khoảng cách
  let distanceText = "";
  if (!isHostView && guestObservedHostLocation && guestLocationForMap) {
    const dist = calculateDistance(
      guestLocationForMap.lat, 
      guestLocationForMap.lng, 
      guestObservedHostLocation.lat, 
      guestObservedHostLocation.lng
    );
    distanceText = dist < 1 ? `${Math.round(dist * 1000)} mét` : `${dist.toFixed(1)} km`;
  }

  return (
    <section className="w-full py-24 px-4 bg-slate-50 relative" id="location">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
      
      <div className="max-w-3xl mx-auto flex flex-col gap-10">
        <div className="text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-playfair text-4xl md:text-5xl font-bold text-[#001f3f] mb-4"
          >
            Bản đồ & Chỉ đường
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: "64px" }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="h-1 bg-gradient-to-r from-yellow-300 to-yellow-500 mx-auto mb-6 rounded-full"
          />
          <p className="text-slate-500 text-lg md:text-xl font-light">
            Hẹn gặp bạn tại Trường Đại học Công nghệ Thông tin.<br className="hidden md:block"/> Dưới đây là bản đồ và hướng dẫn đường đi.
          </p>
        </div>

        {/* Cảnh báo cho GUEST nếu Host đang bật GPS */}
        {!isHostView && guestObservedHostLocation && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border-l-4 border-green-500 shadow-lg rounded-r-xl p-5 flex items-start gap-4 relative overflow-hidden"
          >
            <div className="absolute right-0 top-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl"></div>
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
              <span className="relative flex h-5 w-5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-green-500 border-2 border-white"></span>
              </span>
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-lg">Chủ nhân thiệp đang trực tuyến!</p>
              <p className="text-sm text-slate-500 mt-1">Vị trí của chủ nhân đang được chia sẻ trực tiếp (Live Location). Bạn sẽ thấy một chấm đỏ nhấp nháy di chuyển trên bản đồ.</p>
              {distanceText && (
                <div className="mt-3 inline-block bg-green-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-semibold">
                  Khoảng cách đến bạn: {distanceText}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Cảnh báo cho GUEST yêu cầu cấp quyền vị trí để xem khoảng cách */}
        {!isHostView && guestObservedHostLocation && !guestLocationForMap && !myLocation.error && (
          <p className="text-sm text-slate-500 text-center animate-pulse">Đang tìm vị trí của bạn để tính khoảng cách...</p>
        )}
        {!isHostView && myLocation.error && (
           <p className="text-sm text-amber-600 text-center bg-amber-50 py-2 rounded-lg border border-amber-100">Hãy cho phép trình duyệt truy cập vị trí để xem bạn đang cách chủ tiệc bao xa nhé!</p>
        )}

        {/* Map Container */}
        <div className="p-2 md:p-3 bg-white rounded-3xl shadow-xl border border-slate-100">
          <Map hostLocation={hostLocationForMap} guestLocation={guestLocationForMap} />
        </div>

        {/* Chỉ hiện phần điều khiển Live Location nếu là Host (?host=1) */}
        {isHostView && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#001f3f] to-[#003366] rounded-3xl p-8 border border-blue-800 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
            
            <div className="flex items-start gap-5 mb-8 relative z-10">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10 backdrop-blur-md">
                <MapPin className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-playfair font-bold text-white text-2xl tracking-wide">Phát sóng vị trí</h3>
                <p className="text-sm text-blue-200 font-light mt-2 leading-relaxed">
                  Bật tính năng này để chia sẻ vị trí thực của bạn lên bản đồ của khách mời. Dành riêng cho Chủ Tiệc.
                </p>
              </div>
            </div>

            <button
              onClick={toggleBroadcasting}
              className={`relative z-10 w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg ${
                isBroadcasting 
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30"
                  : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-slate-900 shadow-yellow-500/30"
              }`}
            >
              {isBroadcasting ? "Tắt chia sẻ vị trí" : "Bật định vị GPS của tôi"}
            </button>

            {isBroadcasting && myLocation.error && (
              <p className="text-red-300 text-sm mt-4 text-center font-medium">{myLocation.error}</p>
            )}
            {isBroadcasting && !myLocation.error && myLocation.latitude && (
               <p className="text-green-300 text-sm mt-4 text-center font-medium animate-pulse">Đang phát sóng vị trí trực tiếp tới khách mời...</p>
            )}
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default function LocationMap() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-slate-400">Đang tải bản đồ...</div>}>
      <LocationMapContent />
    </Suspense>
  );
}
