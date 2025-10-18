export default function FlagMontenegro({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      {/* Red background */}
      <rect width="640" height="480" fill="#C40308"/>

      {/* Gold border */}
      <rect width="640" height="480" fill="none" stroke="#D4AF37" strokeWidth="20"/>

      {/* Simplified coat of arms (golden eagle) */}
      <g transform="translate(320,240)">
        {/* Shield */}
        <path d="M -50,-60 L 50,-60 L 50,40 L 0,80 L -50,40 Z" fill="#C40308" stroke="#D4AF37" strokeWidth="4"/>

        {/* Golden double-headed eagle simplified */}
        <ellipse cx="0" cy="-10" rx="35" ry="45" fill="#D4AF37"/>

        {/* Crown */}
        <rect x="-25" y="-65" width="50" height="15" fill="#D4AF37"/>
        <polygon points="-20,-65 -10,-80 0,-65" fill="#D4AF37"/>
        <polygon points="0,-65 10,-80 20,-65" fill="#D4AF37"/>
      </g>
    </svg>
  )
}
