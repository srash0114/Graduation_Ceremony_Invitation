import Hero from "@/components/Hero";
import LocationMap from "@/components/LocationMap";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Hero />
      <LocationMap />

      {/* Footer */}
      <footer className="w-full py-8 text-center bg-white border-t border-slate-200">
        <p className="text-slate-500 text-sm">
          Rất mong sự hiện diện của bạn tại buổi lễ!
        </p>
        <p className="text-slate-400 text-xs mt-2">
          © {new Date().getFullYear()} Lâm Xuân Thái
        </p>
      </footer>
    </main>
  );
}
