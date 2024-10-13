import React, { useState } from "react";

import IconDelete from "../assets/delete.png";
import edit from "../assets/edit.png";
import Draw from "../assets/drow.png";
interface PointData {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  color: string;
}

interface PointsWidgetProps {
  points: PointData[];
  flyToPoint: (longitude: number, latitude: number) => void;
  handleDeletePoint: (id: string) => void;
  handleEditPoint: (id: string, newName: string, newColor: string) => void;
  goToCurrentLocation: () => void;
  drawLineToPoint: (longitude: number, latitude: number) => void;
}

const PointsWidget: React.FC<PointsWidgetProps> = ({
  points,
  flyToPoint,
  handleDeletePoint,
  handleEditPoint,
  goToCurrentLocation,
  drawLineToPoint,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [editMode, setEditMode] = useState<{ id: string | null }>({ id: null });
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("red");

  return (
    <div className="fixed top-0 left-0 w-full bg-white p-6 z-50 shadow-lg border-b border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-gray-800 mr-4">
            Points List
          </h3>
          <span
            className="text-lg font-semibold text-gray-600 bg-gray-200 px-3 py-1 rounded-full cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {points.length} Points
          </span>
        </div>

        <button
          onClick={goToCurrentLocation}
          className="text-gray-500 hover:text-gray-700 text-sm mr-4"
          style={{ fontStyle: "italic" }}
        >
          Go to Current Location
        </button>
      </div>

      {isOpen && (
        <ul className="mt-4 space-y-2 overflow-auto max-h-64">
          {points.map((point) => (
            <li
              key={point.id}
              className="p-4 flex justify-between items-center bg-gray-100 rounded"
            >
              {editMode.id === point.id ? (
                <div>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border rounded p-1"
                  />
                  <select
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="ml-2 p-1"
                  >
                    <option value="red">Red</option>
                    <option value="green">Green</option>
                    <option value="blue">Blue</option>
                    <option value="black">Black</option>
                  </select>
                  <button
                    onClick={() => {
                      handleEditPoint(point.id, newName, newColor);
                      setEditMode({ id: null });
                    }}
                    className="ml-2 bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <span
                    onClick={() => flyToPoint(point.longitude, point.latitude)}
                    className="cursor-pointer"
                  >
                    {point.name} - ({point.color})
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setNewName(point.name);
                        setNewColor(point.color);
                        setEditMode({ id: point.id });
                      }}
                      className="flex items-center bg-slate-400 hover:bg-slate-500 text-white px-4 py-2 rounded-full shadow-md transition-all duration-200 ease-in-out"
                    >
                      <img src={edit} alt="Edit" className="w-5 h-5 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePoint(point.id)}
                      className="flex items-center bg-slate-400 hover:bg-slate-500 text-white px-4 py-2 rounded-full shadow-md transition-all duration-200 ease-in-out"
                    >
                      <img
                        src={IconDelete}
                        alt="Delete"
                        className="w-5 h-5 mr-2"
                      />
                      Delete
                    </button>

                    <button
                      onClick={() =>
                        drawLineToPoint(point.longitude, point.latitude)
                      }
                      className="flex items-center bg-slate-400 hover:bg-slate-500 text-white px-4 py-2 rounded-full shadow-md transition-all duration-200 ease-in-out"
                    >
                      <img
                        src={Draw}
                        alt="Draw Line"
                        className="w-5 h-5 mr-2"
                      />
                      Draw Line
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PointsWidget;
