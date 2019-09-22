import React from "react";
import './Loading.css';

interface LoadingProps {
  size?: string | number;
}

const Loading: React.FC<LoadingProps> = (props: LoadingProps) => {
  let style : React.CSSProperties = {};
  if (props.size) {
    style.width = props.size;
    style.height = props.size;
  }
  return (
    <div className="loading-animation-container" style={style}>
      <svg className="loading-animation-part loading-animation-part-1" viewBox="0 0 100 100">
        <path fill="#009688" d="M50,50 L6.70,75 A50,50 120 0,1 50,0 z"></path>
      </svg>
      <svg className="loading-animation-part loading-animation-part-2" viewBox="0 0 100 100">
        <path fill="#ff9800" d="M50,50 L50,0 A50,50 120 0,1 93.3,75 z"></path>
      </svg>
      <svg className="loading-animation-part loading-animation-part-3" viewBox="0 0 100 100">
        <path fill="#673ab7" d="M50,50 L93.30,75 A50,50 120 0,1 6.70,75 z"></path>
      </svg>
    </div>
  );
};

export default Loading;
