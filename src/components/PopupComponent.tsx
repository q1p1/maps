import React, { useState } from "react";

interface PopupComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    name: string,
    longitude: number,
    latitude: number,
    color: string
  ) => void;
  longitude: number;
  latitude: number;
}

const PopupComponent: React.FC<PopupComponentProps> = ({
  isOpen,
  onClose,
  onSave,
  longitude,
  latitude,
}) => {
  const [pointName, setPointName] = useState("");
  const [selectedColor, setSelectedColor] = useState("black");

  const handleSave = () => {
    onSave(pointName, longitude, latitude, selectedColor);
    setPointName("");
    setSelectedColor("black");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Add New Point
        </h2>

         <input
          type="text"
          value={pointName}
          onChange={(e) => setPointName(e.target.value)}
          placeholder="Enter point name"
          className="mb-4 p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

         <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-700">
            Select Color:
          </label>
          <div className="flex space-x-3">
            {["red", "green", "yellow"].map((color) => (
              <button
                key={color}
                className={`w-10 h-10 rounded-full bg-${color}-500 hover:ring-4 hover:ring-${color}-300 ${
                  selectedColor === color && "ring-4 ring-black"
                }`}
                onClick={() => setSelectedColor(color)}
              >
                <span className="sr-only">{color}</span>
              </button>
            ))}

             <button
              className={`w-10 h-10 rounded-full bg-black border-2 border-gray-300 hover:ring-4 hover:ring-gray-300 ${
                selectedColor === "black" && "ring-4 ring-white"
              }`}
              onClick={() => setSelectedColor("black")}
            >
              <span className="sr-only">black</span>
            </button>
          </div>
        </div>

         <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupComponent;
