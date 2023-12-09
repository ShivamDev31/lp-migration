import React, { useEffect, useRef, useState } from "react";
import { Option } from "../../interfaces";
import useOutsideClick from "../../hooks/useOutsideClick";

interface DropdownProps {
  options: Option[];
  onSelect: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  value?: string; // Optional: current value of the dropdown
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  onSelect,
  placeholder,
  disabled = false,
  value,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown

  useOutsideClick<HTMLDivElement>(dropdownRef, () => {
    if (isOpen) setIsOpen(false);
  });

  useEffect(() => {
    if (value) {
      // If a value is provided, find the corresponding option
      const foundOption = options.find((option) => option.value === value);
      setSelectedOption(foundOption || null);
    } else if (!placeholder && options.length > 0) {
      // Select the first option by default if there's no placeholder
      setSelectedOption(options[0]);
    }
  }, [options, placeholder, value]);

  const handleSelect = (option: Option) => {
    setSelectedOption(option);
    onSelect(option.value);
    setIsOpen(false);
  };

  return (
    <div
      className={`relative inline-block text-left ${
        disabled ? "opacity-50" : ""
      }`}
      ref={dropdownRef}
    >
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-[#f7f7f7] text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
        >
          {selectedOption
            ? selectedOption.label
            : placeholder || "Select an option"}

          {/* Conditional rendering for dropdown arrow */}
          {!disabled && (
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </div>

      {!disabled && isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-[#f7f7f7] ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {options.map((option) => (
              <a
                key={option.value}
                href="#"
                className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 ${
                  selectedOption && selectedOption.value === option.value
                    ? "bg-gray-100"
                    : ""
                }`}
                role="menuitem"
                tabIndex={-1}
                onClick={(e) => {
                  e.preventDefault();
                  handleSelect(option);
                }}
              >
                {option.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
