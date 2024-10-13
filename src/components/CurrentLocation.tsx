import React, { useEffect, useState } from "react";
import Graphic from "@arcgis/core/Graphic";
import Point from "@arcgis/core/geometry/Point";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import MapView from "@arcgis/core/views/MapView";

interface CurrentLocationProps {
  view: MapView | null;
  handleAddPoint: (name: string, longitude: number, latitude: number) => void;
}

const CurrentLocation: React.FC<CurrentLocationProps> = ({
  view,
  handleAddPoint,
}) => {
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationFetched, setLocationFetched] = useState(false);
  useEffect(() => {
    if (!view || locationFetched) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const point = new Point({
            latitude,
            longitude,
          });

          const markerSymbol = {
            type: "simple-marker",
            color: [0, 0, 255],
            outline: {
              color: [255, 255, 255],
              width: 2,
            },
          };

          const graphic = new Graphic({
            geometry: point,
            symbol: markerSymbol,
          });

          const graphicsLayer = view.map.layers.getItemAt(0) as GraphicsLayer;
          graphicsLayer.add(graphic);

          view.goTo({
            center: [longitude, latitude],
            zoom: 14,
          });

          handleAddPoint("My Location", longitude, latitude);

          setLocationFetched(true);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setLocationError("Location access was denied.");
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            setLocationError("Location information is unavailable.");
          } else {
            setLocationError("An unknown error occurred.");
          }
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
    }
  }, [view, handleAddPoint, locationFetched]);

  return (
    <div>
      {locationError && <p className="text-red-500">{locationError}</p>}
    </div>
  );
};

export default CurrentLocation;
