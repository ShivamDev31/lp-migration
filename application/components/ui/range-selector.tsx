import React, { useState } from "react";

interface RangeValues {
  start: number;
  end: number;
}

const RangeSelector: React.FC = () => {
  const [rangeValues, setRangeValues] = useState<RangeValues>({
    start: 33,
    end: 82,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRangeValues((prev) => ({ ...prev, [name]: Number(value) }));
  };

  // This function can be used to calculate the position of the labels based on the slider value
  const calculatePosition = (value: number): string => {
    // Calculate position here; this is a simple linear conversion
    // Adjust as necessary to fit your specific design or histogram
    return `calc(${value}% + (${8 - value * 0.15}px))`;
  };

  return (
    <div className="relative p-4 bg-blue-900 text-white w-full max-w-xs mx-auto rounded-lg">
      {/* The histogram would be rendered here */}

      {/* Slider track */}
      <div className="absolute w-full h-1 bg-purple-600 top-1/2 transform -translate-y-1/2"></div>

      {/* Slider handles */}
      {["start", "end"].map((name) => (
        <React.Fragment key={name}>
          <input
            type="range"
            min="0"
            max="100"
            value={rangeValues[name as keyof RangeValues]}
            name={name}
            onChange={handleChange}
            className="absolute w-full -top-4 h-5 appearance-none pointer-events-none opacity-0"
            style={{ zIndex: name === "end" ? 2 : 1 }}
          />
          <div
            className="absolute bg-purple-700 h-6 w-6 rounded-full cursor-pointer"
            style={{
              top: "50%",
              left: calculatePosition(rangeValues[name as keyof RangeValues]),
              transform: "translate(-50%, -50%)",
            }}
          ></div>
          <span
            className="absolute -mt-8 text-xs font-bold"
            style={{
              left: calculatePosition(rangeValues[name as keyof RangeValues]),
              transform: "translateX(-50%)",
            }}
          >
            {`${rangeValues[name as keyof RangeValues]}%`}
          </span>
        </React.Fragment>
      ))}

      {/* Slider labels */}
      <div className="flex justify-between text-xs mt-8">
        <span>0</span>
        <span>50</span>
        <span>100</span>
        <span>150</span>
        <span>200</span>
        <span>250</span>
      </div>
    </div>
  );
};

export default RangeSelector;
