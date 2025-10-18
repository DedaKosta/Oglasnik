export default function FlagMacedonia({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      {/* Red background */}
      <rect width="640" height="480" fill="#D20000"/>

      {/* Yellow sun with 8 rays */}
      <g fill="#FFE600">
        {/* Center circle */}
        <circle cx="320" cy="240" r="77"/>

        {/* 8 rays radiating from center */}
        {/* Top ray */}
        <path d="M 290,240 L 320,0 L 350,240 Z"/>
        {/* Top-right ray */}
        <path d="M 320,240 L 565,60 L 350,270 Z"/>
        {/* Right ray */}
        <path d="M 320,210 L 640,240 L 320,270 Z"/>
        {/* Bottom-right ray */}
        <path d="M 320,240 L 565,420 L 290,270 Z"/>
        {/* Bottom ray */}
        <path d="M 290,240 L 320,480 L 350,240 Z"/>
        {/* Bottom-left ray */}
        <path d="M 320,240 L 75,420 L 350,210 Z"/>
        {/* Left ray */}
        <path d="M 320,210 L 0,240 L 320,270 Z"/>
        {/* Top-left ray */}
        <path d="M 320,240 L 75,60 L 290,210 Z"/>
      </g>
    </svg>
  )
}
