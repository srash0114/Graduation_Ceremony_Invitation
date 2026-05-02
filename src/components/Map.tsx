"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Navigation } from "lucide-react";

// Fix for default marker icons in Next.js
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const hostIcon = new L.DivIcon({
  html: `<div class="relative flex h-5 w-5 items-center justify-center">
           <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
           <span class="relative inline-flex rounded-full h-3 w-3 bg-red-600 border border-white"></span>
         </div>`,
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -15],
});

const guestIcon = new L.DivIcon({
  html: `<div class="relative flex h-5 w-5 items-center justify-center">
           <span class="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20"></span>
           <span class="relative inline-flex rounded-full h-3 w-3 bg-blue-600 border border-white"></span>
         </div>`,
  className: "",
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -15],
});

// UIT Coordinates
const UIT_COORDS: [number, number] = [10.8700089, 106.8030541];

interface MapProps {
  hostLocation?: { lat: number; lng: number } | null;
  guestLocation?: { lat: number; lng: number } | null;
}

// Component to recenter map when location is active
function RecenterAutomatically({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

export default function Map({ hostLocation, guestLocation }: MapProps) {
  const handleDirections = () => {
    // Open Google Maps App on mobile or web with routing
    const url = `https://www.google.com/maps/dir/?api=1&destination=${UIT_COORDS[0]},${UIT_COORDS[1]}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 relative z-0">
        <MapContainer
          center={UIT_COORDS}
          zoom={16}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* UIT Location Marker */}
          <Marker position={UIT_COORDS} icon={customIcon}>
            <Popup>
              <strong>Đại học Công nghệ Thông tin</strong><br />
              Khu phố 6, P.Linh Trung, TP.Thủ Đức.
            </Popup>
          </Marker>

          {/* Host's Live Location Marker */}
          {hostLocation && (
            <>
              <Marker position={[hostLocation.lat, hostLocation.lng]} icon={hostIcon}>
                <Popup>
                  <strong>Vị trí của Chủ tiệc</strong>
                </Popup>
              </Marker>
            </>
          )}

          {/* Guest's Location Marker */}
          {guestLocation && (
            <>
              <Marker position={[guestLocation.lat, guestLocation.lng]} icon={guestIcon}>
                <Popup>
                  <strong>Vị trí của bạn</strong>
                </Popup>
              </Marker>
            </>
          )}

          {/* Recenter to Host if available, else Guest if available */}
          {hostLocation ? (
            <RecenterAutomatically lat={hostLocation.lat} lng={hostLocation.lng} />
          ) : guestLocation ? (
            <RecenterAutomatically lat={guestLocation.lat} lng={guestLocation.lng} />
          ) : null}
        </MapContainer>
      </div>

      <button
        onClick={handleDirections}
        className="w-full py-4 bg-uit-blue text-white rounded-xl font-medium text-lg flex items-center justify-center gap-2 shadow-md hover:bg-blue-900 transition-colors active:scale-95"
      >
        <Navigation className="w-5 h-5" />
        Chỉ đường tới trường
      </button>
    </div>
  );
}
