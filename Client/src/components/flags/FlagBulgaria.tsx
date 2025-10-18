export default function FlagBulgaria({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 640 480" xmlns="http://www.w3.org/2000/svg">
      {/* White stripe */}
      <rect width="640" height="160" y="0" fill="#FFFFFF"/>
      {/* Green stripe */}
      <rect width="640" height="160" y="160" fill="#00966E"/>
      {/* Red stripe */}
      <rect width="640" height="160" y="320" fill="#D62612"/>
    </svg>
  )
}
