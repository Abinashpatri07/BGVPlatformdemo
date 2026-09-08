import React, { useState, useRef } from "react";

const GlowCard = ({ children, className = "" }) => {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => {
    setOpacity(1);
  };

  const handleMouseLeave = () => {
    setOpacity(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden rounded-2xl border border-theme-border p-[1px] shadow-sm transition-all duration-300 hover:shadow-md ${className}`}
    >
      {/* Background Glow tracking mouse */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-in-out"
        style={{
          opacity,
          background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, var(--theme-primary), transparent 40%)`,
        }}
      />
      
      {/* Card Content Background (Mask) */}
      <div className="relative h-full w-full rounded-[15px] bg-theme-surface-soft z-10 flex flex-col">
        {children}
      </div>
    </div>
  );
};

export default GlowCard;
