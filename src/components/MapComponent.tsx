import React, { useEffect, useRef, useState } from "react";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Point from "@arcgis/core/geometry/Point";
import Graphic from "@arcgis/core/Graphic";
import Polyline from "@arcgis/core/geometry/Polyline";
import TextSymbol from "@arcgis/core/symbols/TextSymbol";
import PointInfoWidget from "./PointInfoWidget";
import PointsWidget from "./PointsWidget";
import CurrentLocation from "./CurrentLocation";
import PopupComponent from "./PopupComponent";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";

interface PointData {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  color: string;
}

const MapComponent: React.FC = () => {
  const mapDiv = useRef<HTMLDivElement>(null);
  const viewRef = useRef<MapView | null>(null);
  const graphicsLayerRef = useRef<GraphicsLayer | null>(null);

  const [points, setPoints] = useState<PointData[]>([]);
  const [inputData, setInputData] = useState({ longitude: 0, latitude: 0 });
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<PointData | null>(
    null
  );
  const [selectedPoint, setSelectedPoint] = useState<PointData | null>(null);
  const [isLineVisible, setIsLineVisible] = useState(false);
  const [lineGraphic, setLineGraphic] = useState<Graphic | null>(null);

  useEffect(() => {
    if (mapDiv.current && !viewRef.current) {
      const map = new Map({ basemap: "hybrid" });
      const graphicsLayer = new GraphicsLayer();
      graphicsLayerRef.current = graphicsLayer;
      map.add(graphicsLayer);

      const view = new MapView({
        container: mapDiv.current,
        map: map,
        center: [55.2708, 25.2048],
        zoom: 10,
      });
      viewRef.current = view;

      view.on("click", (event) => {
        const { longitude, latitude } = event.mapPoint as __esri.Point;
        setInputData({ longitude, latitude });
        setIsPopupOpen(true);
      });
    }
  }, []);

  const updatePointOnMap = (
    longitude: number,
    latitude: number,
    color: string,
    action: "add" | "remove" | "update"
  ) => {
    if (!graphicsLayerRef.current) return;

    const existingGraphic = graphicsLayerRef.current.graphics.find(
      (graphic) => {
        const pointGeometry = graphic.geometry as __esri.Point;
        return (
          pointGeometry.longitude === longitude &&
          pointGeometry.latitude === latitude
        );
      }
    );

    if (action === "remove" && existingGraphic) {
      graphicsLayerRef.current.remove(existingGraphic);
    } else if (action === "add" && !existingGraphic) {
      const pointGraphic = new Graphic({
        geometry: new Point({ longitude, latitude }),
        symbol: new SimpleMarkerSymbol({
          color,
          size: "12px",
          outline: { color: [255, 255, 255], width: 2 },
        }),
      });
      graphicsLayerRef.current.add(pointGraphic);
    } else if (action === "update" && existingGraphic) {
      existingGraphic.symbol = new SimpleMarkerSymbol({
        color,
        size: "12px",
        outline: { color: [255, 255, 255], width: 2 },
      });
    }
  };

  const handlePointAction = (
    id: string | null,
    name: string,
    longitude: number,
    latitude: number,
    color: string,
    action: "add" | "edit" | "delete"
  ) => {
    if (action === "add") {
      const newPoint = {
        id: Date.now().toString(),
        name,
        longitude,
        latitude,
        color,
      };

      setPoints((prev) => [...prev, newPoint]);
      updatePointOnMap(longitude, latitude, color, "add");
    } else if (action === "edit") {
      setPoints((prev) =>
        prev.map((point) =>
          point.id === id ? { ...point, name, color } : point
        )
      );
      updatePointOnMap(longitude, latitude, color, "update");
    } else if (action === "delete") {
      setPoints((prev) => prev.filter((point) => point.id !== id));
      updatePointOnMap(longitude, latitude, color, "remove");
    }

    setIsPopupOpen(false);
  };

  const toggleLineToPoint = (longitude: number, latitude: number) => {
    if (!viewRef.current || !graphicsLayerRef.current || !currentLocation)
      return;

    if (isLineVisible && lineGraphic) {
      graphicsLayerRef.current.remove(lineGraphic);
      setLineGraphic(null);
      setIsLineVisible(false);
    } else if (currentLocation) {
      const polyline = new Polyline({
        paths: [
          [
            [currentLocation.longitude, currentLocation.latitude],
            [longitude, latitude],
          ],
        ],
      });

      const lineGraphic = new Graphic({
        geometry: polyline,
        symbol: new SimpleLineSymbol({
          color: [0, 0, 255],
          width: 2,
        }),
      });

      const distance = calculateDistance(currentLocation, {
        longitude,
        latitude,
      });

      const textGraphic = new Graphic({
        geometry: new Point({
          longitude: (currentLocation.longitude + longitude) / 2,
          latitude: (currentLocation.latitude + latitude) / 2,
        }),
        symbol: new TextSymbol({
          text: `${distance.toFixed(2)} km`,
          color: "black",
          haloColor: "white",
          haloSize: "1px",
          font: { size: 12 },
        }),
      });

      graphicsLayerRef.current.addMany([lineGraphic, textGraphic]);
      setLineGraphic(lineGraphic);
      setIsLineVisible(true);
    }
  };

  const calculateDistance = (
    pointA: { longitude: number; latitude: number },
    pointB: { longitude: number; latitude: number }
  ): number => {
    const dx = pointB.longitude - pointA.longitude;
    const dy = pointB.latitude - pointA.latitude;
    return Math.sqrt(dx * dx + dy * dy) * 111;
  };

  const handleFlyToPoint = (longitude: number, latitude: number) => {
    if (viewRef.current) {
      viewRef.current.goTo({ center: [longitude, latitude], zoom: 14 });

      const selected = points.find(
        (point) => point.longitude === longitude && point.latitude === latitude
      );
      if (selected) {
        setSelectedPoint(selected);
      }
    }
  };

  return (
    <div>
      <CurrentLocation
        view={viewRef.current}
        handleAddPoint={(name, longitude, latitude) =>
          setCurrentLocation({
            id: "current",
            name,
            longitude,
            latitude,
            color: "black",
          })
        }
      />

      <PointsWidget
        points={points}
        flyToPoint={handleFlyToPoint}
        handleDeletePoint={(id) => {
          const pointToRemove = points.find((point) => point.id === id);
          if (pointToRemove)
            handlePointAction(
              id,
              pointToRemove.name,
              pointToRemove.longitude,
              pointToRemove.latitude,
              pointToRemove.color,
              "delete"
            );
        }}
        handleEditPoint={(id, newName, newColor) => {
          const pointToEdit = points.find((point) => point.id === id);
          if (pointToEdit)
            handlePointAction(
              id,
              newName,
              pointToEdit.longitude,
              pointToEdit.latitude,
              newColor,
              "edit"
            );
        }}
        drawLineToPoint={toggleLineToPoint}
        goToCurrentLocation={() =>
          currentLocation &&
          viewRef.current?.goTo({
            center: [currentLocation.longitude, currentLocation.latitude],
            zoom: 14,
          })
        }
      />

      <PopupComponent
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSave={(name, longitude, latitude, color) =>
          handlePointAction(null, name, longitude, latitude, color, "add")
        }
        longitude={inputData.longitude}
        latitude={inputData.latitude}
      />

      {selectedPoint && currentLocation && (
        <PointInfoWidget
          selectedPoint={selectedPoint}
          currentLocation={currentLocation}
          onClose={() => setSelectedPoint(null)}
        />
      )}

      <div className="h-screen w-full" ref={mapDiv}></div>
    </div>
  );
};

export default MapComponent;
