"use client";

import { motion } from "framer-motion";
import { CalendarDays, MapPin, Clock, ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/bg.png"
          alt="Graduation Background"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#001f3f]/80 via-[#001f3f]/60 to-[#001f3f]/90" />
      </div>

      <div className="z-10 text-center px-4 max-w-3xl mx-auto flex flex-col items-center pt-12 pb-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="inline-block px-6 py-2 rounded-full border border-yellow-500/30 bg-white/5 backdrop-blur-md mb-8 shadow-[0_0_15px_rgba(242,169,0,0.2)]"
        >
          <p className="text-xs md:text-sm uppercase tracking-[0.3em] text-yellow-400 font-semibold">
            Trân trọng kính mời
          </p>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-playfair text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-400 to-yellow-200 mb-2 drop-shadow-lg py-4 leading-normal"
        >
          Lễ Tốt Nghiệp
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="text-3xl md:text-5xl text-white font-medium mb-8 font-playfair tracking-wide"
        >
          Lê Võ Hoàng Nghi
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: "100px" }}
          transition={{ duration: 1, delay: 0.6 }}
          className="h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent mb-8"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-blue-100 mb-12 leading-relaxed max-w-lg mx-auto text-lg font-light"
        >
          Đã vượt qua chặng đường dài đầy thử thách, mình rất mong bạn sẽ có mặt để cùng chia sẻ khoảnh khắc đáng nhớ này.
        </motion.p>

        {/* Glassmorphism Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="relative group w-full"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-600 to-blue-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-[#001f3f]/40 backdrop-blur-xl shadow-2xl rounded-2xl p-6 md:p-10 w-full border border-white/10 flex flex-col gap-6 text-left">

            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
                <CalendarDays className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-blue-200 font-light uppercase tracking-wider mb-1">Ngày diễn ra</p>
                <p className="font-medium text-white text-lg">Thứ Sáu, 12 Tháng 6, 2026</p>
              </div>
            </div>

            <div className="w-full h-px bg-white/10 my-1"></div>

            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-blue-200 font-light uppercase tracking-wider mb-1">Thời gian</p>
                <p className="font-medium text-white text-lg">08:00 Sáng - 11:30 Trưa</p>
              </div>
            </div>

            <div className="w-full h-px bg-white/10 my-1"></div>

            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
                <MapPin className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-blue-200 font-light uppercase tracking-wider mb-1">Địa điểm</p>
                <p className="font-medium text-white text-lg leading-tight">Trường Đại học Công nghệ Thông tin<br />ĐHQG TP.HCM</p>
                <p className="text-sm text-blue-300 mt-1">Hội trường A, Tòa nhà A</p>
              </div>
            </div>

          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-16 flex flex-col items-center cursor-pointer"
          onClick={() => {
            document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <p className="text-xs text-blue-300 uppercase tracking-widest mb-3">Xem bản đồ</p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center bg-white/5 backdrop-blur-sm"
          >
            <ArrowDown className="w-4 h-4 text-white" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
