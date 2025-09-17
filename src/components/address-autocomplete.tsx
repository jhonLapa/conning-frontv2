import React, { useState, useCallback } from "react";
import { Autocomplete } from "@react-google-maps/api";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { LocationComponentProps } from "@/interfaces";

interface AddressAutocompleteProps
  extends Omit<LocationComponentProps, "location"> {
  label?: string;
  placeholder?: string;
}

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  onLocationChange,
  label = "Buscar dirección",
  placeholder = "Ingresa una dirección",
}) => {
  const [address, setAddress] = useState<string>("");
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  const onLoad = useCallback(
    (autocomplete: google.maps.places.Autocomplete) => {
      setAutocomplete(autocomplete);
    },
    []
  );

  const onPlaceSelected = useCallback(() => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        onLocationChange({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        if (place.formatted_address) {
          setAddress(place.formatted_address);
        }
      }
    }
  }, [autocomplete, onLocationChange]);

  return (
    <div>
      <Label htmlFor="address">{label}</Label>
      <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceSelected}>
        <Input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder={placeholder}
          className="w-full"
        />
      </Autocomplete>
    </div>
  );
};
