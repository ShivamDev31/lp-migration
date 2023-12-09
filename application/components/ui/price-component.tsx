import React from "react";

interface PriceComponentProps {
  label: string;
  value: number;
  unit: string;
  onIncrease: () => void;
  onDecrease: () => void;
}

const PriceComponent: React.FC<PriceComponentProps> = ({
  label,
  value,
  unit,
  onIncrease,
  onDecrease,
}) => {
  const buttonStyle = "rounded-full border border-gray-500  p-1";
  const svgStyle = "h-4 w-4 ";
  return (
    <div className="bg-[#f7f7f7] rounded-lg p-2 flex items-center justify-between border border-1 border-white w-32">
      <div className=" flex flex-col items-center ">
        <div className="text-xs mb-1">{label}</div>
        <div className="flex items-baseline justify-between gap-x-3">
          <button className={buttonStyle} onClick={onDecrease}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={svgStyle}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 12H4"
              />
            </svg>
          </button>
          <span className="text-2xl font-semibold">{value}</span>

          <button className={buttonStyle} onClick={onIncrease}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={svgStyle}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
        <span className="text-sm ml-1">{unit}</span>
      </div>
    </div>
  );
};

export default PriceComponent;
