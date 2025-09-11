import React from "react";

const CircularLoader = ({
  size = 48,
  thickness = 6,
  gap = 3,
  message = "Loading...",
  outerColor = "border-gray-300",
  innerColor = "border-blue-500",
  textColor = "text-gray-600",
  className = "",
  showMessage = true,
}) => {
  const innerSize = size - 2 * gap;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer circle */}
        <div
          className={`rounded-full ${outerColor}`}
          style={{
            width: size,
            height: size,
            borderWidth: thickness,
          }}
        />
        {/* Inner spinning circle */}
        <div
          className={`absolute rounded-full ${innerColor} animate-spin`}
          style={{
            top: gap,
            left: gap,
            width: innerSize,
            height: innerSize,
            borderWidth: thickness,
            borderTopColor: "currentColor",
            borderRightColor: "currentColor",
          }}
        />
      </div>

      {/* Dynamic message */}
      {showMessage && (
        <p className={`text-sm font-medium ${textColor}`}>
          {message || "Loading data..."}
        </p>
      )}
    </div>
  );
};

export default CircularLoader;
