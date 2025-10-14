import React from "react";

interface AnimatedPulseProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const AnimatedPulse: React.FC<AnimatedPulseProps> = ({
  children,
  className = "",
  delay = 0,
}) => {
  return (
    <div
      className={`animate-pulse ${className}`}
      style={{
        animationDelay: `${delay}ms`,
        animationDuration: "2s",
        animationIterationCount: "infinite",
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedPulse;
