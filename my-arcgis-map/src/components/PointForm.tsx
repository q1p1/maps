import React from "react";

interface PointFormProps {
  inputData: { name: string, longitude: number, latitude: number };
  setInputData: React.Dispatch<React.SetStateAction<{ name: string, longitude: number, latitude: number }>>;
  handleAddPoint: () => void;
}

const PointForm: React.FC<PointFormProps> = ({ inputData, setInputData, handleAddPoint }) => {
  return (
    <div style={{ position: 'absolute', top: 10, left: 10, backgroundColor: 'white', padding: '10px', zIndex: 1000 }}>
      <label>
        Place Name:
        <input
          type="text"
          value={inputData.name}
          onChange={(e) => setInputData({ ...inputData, name: e.target.value })}
        />
      </label>
      <button onClick={handleAddPoint}>Add Point</button>
    </div>
  );
};

export default PointForm;
