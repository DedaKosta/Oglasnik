export default function FlagSerbia({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      {/* Horizontal stripes */}
      <rect width="640" height="160" y="0" fill="#C6363C"/>
      <rect width="640" height="160" y="160" fill="#0C4076"/>
      <rect width="640" height="160" y="320" fill="#FFFFFF"/>

      {/* Coat of Arms */}
      <g transform="translate(100,120)">
        {/* Shield */}
        <path d="M 0,0 L 90,0 L 90,100 L 45,130 L 0,100 Z" fill="#C6363C" stroke="#FFD83D" strokeWidth="3"/>

        {/* White cross */}
        <rect x="10" y="10" width="70" height="20" fill="#FFFFFF"/>
        <rect x="35" y="10" width="20" height="90" fill="#FFFFFF"/>

        {/* Four Cyrillic C's (firesteels) */}
        <g fill="#C6363C">
          {/* Top-left C */}
          <path d="M 18,18 L 18,38 L 28,38 L 28,28 L 33,28 L 33,18 Z"/>
          {/* Top-right C */}
          <path d="M 72,18 L 62,18 L 62,28 L 57,28 L 57,38 L 72,38 Z"/>
          {/* Bottom-left C */}
          <path d="M 18,62 L 18,82 L 33,82 L 33,72 L 28,72 L 28,62 Z"/>
          {/* Bottom-right C */}
          <path d="M 72,62 L 62,62 L 62,72 L 57,72 L 57,82 L 72,82 Z"/>
        </g>

        {/* Crown */}
        <g transform="translate(0,-30)">
          <rect x="10" y="0" width="70" height="25" fill="#FFD83D" stroke="#C6363C" strokeWidth="1"/>
          <circle cx="20" cy="0" r="8" fill="#FFD83D"/>
          <circle cx="45" cy="-5" r="10" fill="#FFD83D"/>
          <circle cx="70" cy="0" r="8" fill="#FFD83D"/>
          {/* Crown details */}
          <rect x="15" y="8" width="10" height="15" fill="#C6363C"/>
          <rect x="40" y="8" width="10" height="15" fill="#C6363C"/>
          <rect x="65" y="8" width="10" height="15" fill="#C6363C"/>
        </g>
      </g>
    </svg>
  )
}
