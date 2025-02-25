import React, { useState } from "react";

const CustomSelect = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div className="custom-select" onMouseLeave={() => setIsOpen(false)}>
      <div className="selected-option" onClick={() => setIsOpen(!isOpen)}>
        {value || placeholder}
      </div>
      {isOpen && (
        <div className="options">
          {options.map((option, index) => (
            <div
              key={index}
              className="option"
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "rgb(79, 214, 117)";
                e.target.style.padding = "10px";
                e.target.style.cursor = "pointer";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "";
              }}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
