import React from 'react';

export interface UserTimelineLogoProps {
  color?: string;
  className?: string;
}

const UserTimelineLogo: React.FC<UserTimelineLogoProps> = props => {
  const color = props.color ?? 'currentcolor';
  return (
    <svg className={props.className} viewBox="0 0 100 100">
      <g fill="none" stroke={color} strokeWidth="12">
        <line x1="50" x2="50" y1="0" y2="25" />
        <circle cx="50" cy="50" r="22" />
        <line x1="50" x2="50" y1="75" y2="100" />
      </g>
      <g fill={color}>
        <circle cx="85" cy="75" r="10" />
        <path d="m70,100c0,0 15,-30 30,0.25" />
      </g>
    </svg>
  );
};

export default UserTimelineLogo;