import React from 'react';

export interface TimelineLogoProps {
  color?: string;
  className?: string;
}

const TimelineLogo: React.FC<TimelineLogoProps> = props => {
  const color = props.color ?? 'currentcolor';
  return (
    <svg
      className={props.className}
      viewBox="0 0 100 100"
      fill="none"
      strokeWidth="12"
      stroke={color}
    >
      <line x1="50" y1="0" x2="50" y2="25" />
      <circle cx="50" cy="50" r="22" />
      <line x1="50" y1="75" x2="50" y2="100" />
    </svg>
  );
};

export default TimelineLogo;
