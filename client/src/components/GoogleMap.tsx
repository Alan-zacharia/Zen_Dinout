import ReactMapGl, { Marker } from "react-map-gl";
import React, { useEffect, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import { HiLocationMarker } from "react-icons/hi";

export const TOKEN = import.meta.env.VITE_API_MAXBOX_TOKEN;

interface CustomMapProps {
  longitude: any;
  latitude: any;
  updateCoordinates?: (latitude: number, longitude: number) => void;
  isMarkerDraggable?: boolean;
}
const GoogleMap: React.FC<CustomMapProps> = ({
  longitude,
  latitude,
  updateCoordinates,
  isMarkerDraggable = true,
}) => {
  const [viewport, setViewport] = useState({
    latitude,
    longitude,
    zoom: 16,
  });

  useEffect(() => {
    setViewport((oldViewport) => ({
      ...oldViewport,
      latitude,
      longitude,
    }));
  }, [latitude, longitude]);

  const handleMarkerDrag = (event: any) => {
    const latitude = event.lngLat.lat;
    const longitude = event.lngLat.lng;
    if (updateCoordinates) updateCoordinates(latitude, longitude);
  };

  return (
    <div className="h-56 w-full">
      <ReactMapGl
        {...viewport}
        mapboxAccessToken={TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onMove={(event) => {
          setViewport(event.viewState);
        }}
      
      >
        <Marker
          latitude={latitude}
          longitude={longitude}
          draggable={isMarkerDraggable}
          onDragEnd={handleMarkerDrag}
        >
          <HiLocationMarker color="#ff0000"  size={30} strokeWidth={2.5} />
        </Marker>
      </ReactMapGl>
    </div>
  );
};

export default GoogleMap;
