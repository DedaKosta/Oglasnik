export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="fixed bottom-0 left-0 right-0">
      <div className="flex items-center justify-center py-3">
        <p className="text-sm text-gray-800">
          © {currentYear} Oglasnik™. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
