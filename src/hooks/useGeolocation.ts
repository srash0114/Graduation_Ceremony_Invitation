import { useState, useEffect } from "react";

interface LocationData {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
}

export const useGeolocation = (options?: PositionOptions) => {
  const [location, setLocation] = useState<LocationData>({
    latitude: null,
    longitude: null,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation((prev) => ({
        ...prev,
        error: "Trình duyệt của bạn không hỗ trợ Geolocation.",
      }));
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      setLocation((prev) => ({
        ...prev,
        error: error.message,
      }));
    };

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      options || { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [options]);

  return location;
};
