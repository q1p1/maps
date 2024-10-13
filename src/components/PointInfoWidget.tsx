import React, { useEffect, useState } from "react";
import { distance } from "@arcgis/core/geometry/geometryEngine"; 
import Point from "@arcgis/core/geometry/Point";
import { geographicToWebMercator } from "@arcgis/core/geometry/support/webMercatorUtils"; 

interface PointData {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
}

interface PointInfoWidgetProps {
  selectedPoint: PointData;
  currentLocation: PointData;
  onClose: () => void;
}

const PointInfoWidget: React.FC<PointInfoWidgetProps> = ({
  selectedPoint,
  currentLocation,
  onClose,
}) => {
  const [distanceToPoint, setDistanceToPoint] = useState<number | null>(null);

  useEffect(() => {
    const calculateDistance = () => {
      const pointA = geographicToWebMercator(
        new Point({
          longitude: currentLocation.longitude,
          latitude: currentLocation.latitude,
        })
      );

      const pointB = geographicToWebMercator(
        new Point({
          longitude: selectedPoint.longitude,
          latitude: selectedPoint.latitude,
        })
      );

      const distanceMeters = distance(pointA, pointB, "meters");
      setDistanceToPoint(distanceMeters);
    };

    calculateDistance();
  }, [selectedPoint, currentLocation]);

  const jsonData = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          name: selectedPoint.name,
        },
        geometry: {
          type: "Point",
          coordinates: [selectedPoint.longitude, selectedPoint.latitude],
        },
      },
    ],
  };

  return (
    <div className="fixed top-0 right-0 w-1/3 bg-white p-6 shadow-lg border-l border-gray-200 z-50">
      <h3 className="text-xl font-bold mb-4">Point Information</h3>
      <p>
        <strong>Selected Point:</strong> {selectedPoint.name}
      </p>
      <p>
        <strong>Longitude:</strong> {selectedPoint.longitude}
      </p>
      <p>
        <strong>Latitude:</strong> {selectedPoint.latitude}
      </p>
      <p>
        <strong>Current Location:</strong> {currentLocation.name}
      </p>
      <p>
        <strong>Current Longitude:</strong> {currentLocation.longitude}
      </p>
      <p>
        <strong>Current Latitude:</strong> {currentLocation.latitude}
      </p>

      {distanceToPoint !== null && (
        <p>
          <strong>Distance to Point:</strong> {distanceToPoint.toFixed(2)} meters
        </p>
      )}

      <h4 className="text-lg font-semibold mt-4">Point Data (JSON):</h4>
      <pre className="bg-gray-100 p-4 rounded mt-2">
        {JSON.stringify(jsonData, null, 2)}
      </pre>

      <button
        onClick={onClose}
        className="mt-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
      >
        Close
      </button>
    </div>
  );
};

export default PointInfoWidget;
