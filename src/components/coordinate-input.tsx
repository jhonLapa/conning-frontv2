import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LocationComponentProps } from "@/interfaces";

interface CoordinateInputProps extends LocationComponentProps {
  label?: string;
  placeholder?: string;
}

export const CoordinateInput: React.FC<CoordinateInputProps> = ({
  location,
  onLocationChange,
  label = "Coordenadas",
  placeholder = "Ej: -12.0464,-77.0428",
}) => {
  // Estado local para el valor del input
  const [inputValue, setInputValue] = useState<string>(
    location ? `${location.lat},${location.lng}` : ""
  );
  // Estado para el error de validación
  const [error, setError] = useState<string>("");

  // Validar si una cadena es una latitud válida (-90 a 90)
  const isValidLatitude = (lat: number): boolean => {
    return !isNaN(lat) && lat >= -90 && lat <= 90;
  };

  // Validar si una cadena es una longitud válida (-180 a 180)
  const isValidLongitude = (lng: number): boolean => {
    return !isNaN(lng) && lng >= -180 && lng <= 180;
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      // Limpiar error previo
      setError("");

      // Si el input está vacío, actualizar estado a null
      if (!value.trim()) {
        onLocationChange(null);
        return;
      }

      // Validar formato
      const coordinates = value.split(",").map((coord) => coord.trim());

      if (coordinates.length !== 2) {
        setError("Formato inválido. Use: latitud,longitud");
        return;
      }

      const [lat, lng] = coordinates.map(Number);

      // Validar cada coordenada
      if (!isValidLatitude(lat)) {
        setError("Latitud debe estar entre -90 y 90");
        return;
      }

      if (!isValidLongitude(lng)) {
        setError("Longitud debe estar entre -180 y 180");
        return;
      }

      // Si todo es válido, actualizar la ubicación
      onLocationChange({ lat, lng });
    },
    [onLocationChange]
  );

  // Actualizar el input cuando cambia la ubicación externamente
  React.useEffect(() => {
    if (location) {
      setInputValue(`${location.lat},${location.lng}`);
    } else {
      setInputValue("");
    }
  }, [location]);

  return (
    <Card>
      <CardContent className="p-4">
        <div>
          <Label htmlFor="coordinates">{label}</Label>
          <Input
            id="coordinates"
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={`w-full ${error ? "border-[#efa159]" : ""}`}
          />
          {error && <p className="text-sm text-[#efa159]">{error}</p>}
        </div>
      </CardContent>
    </Card>
  );
};
