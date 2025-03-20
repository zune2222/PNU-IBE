import React from "react";

interface LogoIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export default function LogoIcon({
  className,
  width = 40,
  height = 40,
}: LogoIconProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect width="40" height="40" rx="8" fill="#485493" />
      <path
        d="M8 20C8 13.3726 13.3726 8 20 8C26.6274 8 32 13.3726 32 20C32 26.6274 26.6274 32 20 32"
        stroke="#00BFFF"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="20" cy="20" r="6" fill="#87CEFA" />
      <path
        d="M20 32V26"
        stroke="#00BFFF"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M14 32H26"
        stroke="#00BFFF"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
