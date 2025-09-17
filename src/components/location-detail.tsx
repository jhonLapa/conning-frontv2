import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Location } from "@/interfaces";
import { useReverseGeocoding } from "@/hooks";

interface LocationDetailsProps {
  location: Location | null;
  onAddressResolved?: (address: string | null) => void;
}

export const LocationDetails: React.FC<LocationDetailsProps> = ({
  location,
  onAddressResolved,
}) => {
  const { locationDetails, loading, error } = useReverseGeocoding(location);

  useEffect(() => {
    if (locationDetails && onAddressResolved) {
      onAddressResolved(locationDetails.formattedAddress || null);
    }
  }, [locationDetails, onAddressResolved]);

  if (!location) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Detalles de la ubicación</CardTitle>
        <hr />
      </CardHeader>
      <CardContent>
        {loading && <div className="text-gray-500">Cargando detalles...</div>}

        {error && <div className="text-[#efa159]">{error}</div>}

        {locationDetails && (
          <div className="space-y-2">
            <div className="grid grid-cols-1 gap-2">
              {locationDetails.formattedAddress && (
                <div className="flex flex-col lg:flex-row">
                  <span className="font-semibold">Dirección completa: </span>
                  <span>{locationDetails.formattedAddress}</span>
                </div>
              )}

              {locationDetails.neighborhood && (
                <div>
                  <span className="font-semibold">Barrio/Zona: </span>
                  <span>{locationDetails.neighborhood}</span>
                </div>
              )}

              {locationDetails.locality && (
                <div>
                  <span className="font-semibold">Localidad: </span>
                  <span>{locationDetails.locality}</span>
                </div>
              )}

              {locationDetails.city && (
                <div>
                  <span className="font-semibold">Ciudad: </span>
                  <span>{locationDetails.city}</span>
                </div>
              )}

              {locationDetails.state && (
                <div>
                  <span className="font-semibold">Estado/Provincia: </span>
                  <span>{locationDetails.state}</span>
                </div>
              )}

              {locationDetails.country && (
                <div>
                  <span className="font-semibold">País: </span>
                  <span>{locationDetails.country}</span>
                </div>
              )}

              {locationDetails.postalCode && (
                <div>
                  <span className="font-semibold">Código postal: </span>
                  <span>{locationDetails.postalCode}</span>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-1">
                <span className="font-semibold">Coordenadas: </span>
                <span>{location.lat}</span>
                <span>{location.lng}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
