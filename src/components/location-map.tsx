import React, { useState, useEffect } from "react";
import { GoogleMap, Marker } from "@react-google-maps/api";
import { toast } from "sonner";
import { Location } from "@/interfaces";

interface MeetPoint {
  name: string;
  coordinates: Location;
}

interface LocationMapProps {
  location?: Location | null;
  height?: string;
  zoom?: number;
  defaultCenter?: Location;
  onSelectLocation?: (location: Location) => void;
  meetPoints?: MeetPoint[];
  autoDetectLocation?: boolean; // Nueva propiedad para activar detección automática
}

export const LocationMap: React.FC<LocationMapProps> = ({
  location,
  height = "h-96",
  zoom = 15,
  defaultCenter = { lat: 40.7128, lng: -74.006 },
  onSelectLocation,
  meetPoints,
  autoDetectLocation = false, // Por defecto está desactivado
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    location || null
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Este useEffect actualiza el estado local cuando cambian las coordenadas externas
  useEffect(() => {
    if (location) {
      setSelectedLocation(location);
    }
  }, [location]);

  const detectUserLocation = () => {
    setIsLoading(true);

    if (!navigator.geolocation) {
      toast.warning("La geolocalización no está soportada por tu navegador");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation: Location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setSelectedLocation(userLocation);
        if (onSelectLocation) {
          onSelectLocation(userLocation);
        }
        setIsLoading(false);
      },
      (err) => {
        let errorMessage = "Error desconocido al obtener la ubicación";
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = "Permiso de ubicación denegado";
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = "La información de ubicación no está disponible";
            break;
          case err.TIMEOUT:
            errorMessage = "Tiempo de espera agotado al obtener la ubicación";
            break;
        }
        toast.warning(errorMessage);
        setIsLoading(false);
        console.error("Error de geolocalización:", errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  useEffect(() => {
    if (autoDetectLocation) {
      detectUserLocation();
    }
  }, [autoDetectLocation]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const newLocation: Location = {
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      };

      // Actualiza el estado local
      setSelectedLocation(newLocation);

      // Envía las coordenadas al componente padre
      if (onSelectLocation) {
        onSelectLocation(newLocation);
      }
    }
  };

  // Determinar qué posición usar para el centro del mapa
  const mapCenter = location || selectedLocation || defaultCenter;

  return (
    <div className="relative">
      <GoogleMap
        mapContainerClassName={`w-full ${height}`}
        center={mapCenter}
        zoom={zoom}
        onClick={handleMapClick}
        options={{
          clickableIcons: true,
          zoomControl: true,
          mapTypeControl: true,
          scaleControl: true,
          streetViewControl: true,
          rotateControl: true,
          fullscreenControl: true,
        }}
      >
        {selectedLocation && <Marker position={selectedLocation} />}
        {meetPoints &&
          meetPoints.map((point, index) => (
            <Marker
              key={index}
              position={point.coordinates}
              title={point.name}
              icon={{
                url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
              }}
              onClick={() => {
                // Opcionalmente, puedes manejar el clic en un punto de encuentro
                // Por ejemplo, mostrando información o seleccionándolo
                if (onSelectLocation) {
                  onSelectLocation(point.coordinates);
                }
              }}
            />
          ))}
      </GoogleMap>

      {/* Botón para detectar ubicación */}
      <button
        type="button"
        onClick={detectUserLocation}
        disabled={isLoading}
        className="absolute top-16 right-2 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 focus:outline-none z-10"
        title="Detectar mi ubicación"
      >
        {isLoading ? (
          <span className="block w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></span>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};
