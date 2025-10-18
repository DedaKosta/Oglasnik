export default function FlagGreece({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      {/* Blue stripes */}
      <rect width="640" height="53.33" y="0" fill="#0D5EAF"/>
      <rect width="640" height="53.33" y="106.67" fill="#0D5EAF"/>
      <rect width="640" height="53.33" y="213.33" fill="#0D5EAF"/>
      <rect width="640" height="53.33" y="320" fill="#0D5EAF"/>
      <rect width="640" height="53.33" y="426.67" fill="#0D5EAF"/>

      {/* White stripes */}
      <rect width="640" height="53.33" y="53.33" fill="#FFFFFF"/>
      <rect width="640" height="53.33" y="160" fill="#FFFFFF"/>
      <rect width="640" height="53.33" y="266.67" fill="#FFFFFF"/>
      <rect width="640" height="53.33" y="373.33" fill="#FFFFFF"/>

      {/* Canton (blue square) */}
      <rect width="266.67" height="266.67" y="0" fill="#0D5EAF"/>

      {/* White cross */}
      <rect width="266.67" height="53.33" y="106.67" fill="#FFFFFF"/>
      <rect width="53.33" height="266.67" x="106.67" y="0" fill="#FFFFFF"/>
    </svg>
  )
}
