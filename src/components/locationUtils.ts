import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import MapView from "@arcgis/core/views/MapView";
import Point from "@arcgis/core/geometry/Point";
import * as geometryEngine from "@arcgis/core/geometry/geometryEngine";
import * as webMercatorUtils from "@arcgis/core/geometry/support/webMercatorUtils"; 

interface PointData {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
}

/**
 * @param view
 * @param points
 * @param setPoints
 * @param name
 * @param longitude
 * @param latitude
 */
export const handleAddPoint = (
  view: MapView,
  points: PointData[],
  setPoints: React.Dispatch<React.SetStateAction<PointData[]>>,
  name: string,
  longitude: number,
  latitude: number
) => {
  const graphicsLayer = view.map.layers.getItemAt(0) as GraphicsLayer;

  const point = new Point({
    longitude,
    latitude,
  });

  const markerSymbol = {
    type: "simple-marker",
    color: [226, 119, 40],
    outline: {
      color: [255, 255, 255],
      width: 2,
    },
  };

  const newId = `point-${Date.now()}`;

  const pointGraphic = new Graphic({
    geometry: point,
    symbol: markerSymbol,
    attributes: {
      id: newId,
      name,
    },
  });

  graphicsLayer.add(pointGraphic);

  setPoints([...points, { id: newId, name, longitude, latitude }]);
};

/**
 * @param view
 * @param _points
 * @param setPoints
 * @param id
 */
export const handleDeletePoint = (
  view: MapView,
  _points: PointData[],
  setPoints: React.Dispatch<React.SetStateAction<PointData[]>>,
  id: string
) => {
  setPoints((prevPoints) => prevPoints.filter((point) => point.id !== id));

  const graphicsLayer = view.map.layers.getItemAt(0) as GraphicsLayer;

  const graphicToRemove = graphicsLayer.graphics.find(
    (graphic) => graphic.attributes?.id === id
  );

  if (graphicToRemove) {
    graphicsLayer.remove(graphicToRemove);
  }
};

/**
 * @param pointA
 * @param pointB
 * @returns
 */
export const calculateDistance = (
  pointA: Point,
  pointB: Point
): number | null => {
  const webMercatorPointA = webMercatorUtils.geographicToWebMercator(pointA);
  const webMercatorPointB = webMercatorUtils.geographicToWebMercator(pointB);

  return geometryEngine.distance(
    webMercatorPointA,
    webMercatorPointB,
    "kilometers"
  );
};
