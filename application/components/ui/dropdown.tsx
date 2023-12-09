import React, { useEffect, useState } from "react";
import { Option } from "../../interfaces";

interface DropdownProps {
  options: Option[];
  onSelect: (value: string) => void;
  placeholder?: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  onSelect,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  useEffect(() => {
    // Set initial selected option based on whether a placeholder is provided
    if (!placeholder) {
      setSelectedOption(options[0]);
    }
  }, [options, placeholder]);

  const handleSelect = (option: Option | null) => {
    setSelectedOption(option);
    onSelect(option ? option.value : ""); // If option is null, send empty string
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left bg-[#f7f7f7]">
      <div>
        <button
          type="button"
          className="inline-flex justify-center w-full rounded-md border  border-gray-300 shadow-sm px-4 py-2 bg-[#f7f7f7] text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
          id="options-menu"
          aria-haspopup="true"
          aria-expanded="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedOption
            ? selectedOption.label
            : placeholder || options[0].label}

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
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-full rounded-md shadow-lg bg-[#f7f7f7] ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="options-menu"
        >
          <div className="py-1" role="none">
            {options.map((option) => (
              <a
                key={option.value} // Use value for key since it should be unique
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
                {option.label} {/* Display the label */}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
