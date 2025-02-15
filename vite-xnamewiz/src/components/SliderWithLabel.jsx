import React, { useState, useRef, useEffect } from "react";
import "./SliderWithLabel.css";

const SliderWithLabel = ({
  min = 1,
  max = 10,
  initial = 5,
  step = 1,
  onChange,
  id = crypto.randomUUID(), // Generate unique ID for each instance
}) => {
  const [value, setValue] = useState(initial);
  const [labelPosition, setLabelPosition] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const updateLabelPosition = () => {
      if (sliderRef.current) {
        const range = max - min;
        const percentage = ((value - min) / range) * 100;
        const sliderWidth = sliderRef.current.getBoundingClientRect().width;
        const position = (percentage * sliderWidth) / 100;
        setLabelPosition(position);
      }
    };

    updateLabelPosition();
    // Add resize listener to handle window size changes
    window.addEventListener("resize", updateLabelPosition);

    return () => {
      window.removeEventListener("resize", updateLabelPosition);
    };
  }, [value, min, max]);

  const handleChange = (event) => {
    const newValue = Number(event.target.value);
    setValue(newValue);
    if (onChange) {
      onChange(newValue); // Pass the numeric value directly
    }
  };

  // Function to format the value based on step
  const formatValue = (val) => {
    if (step >= 1) {
      return Math.round(val).toString();
    }
    // Calculate decimal places based on step
    const decimalPlaces = Math.max(0, -Math.floor(Math.log10(step)));
    return Number(val).toFixed(decimalPlaces);
  };

  return (
    <div className="slider-container">
      <div className="slider">
        <input
          ref={sliderRef}
          type="range"
          id={`slider-${id}`} // Use unique ID
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
        />
        <div
          className="slider-value"
          style={{
            left: `${labelPosition}px`,
            transform: "translateX(-50%)",
          }}
        >
          {/* Format dynamicaly number to decimal places */}
          {formatValue(value)}
        </div>
      </div>
    </div>
  );
};

export default SliderWithLabel;
