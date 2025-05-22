import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-6">
      <h1 className="text-4xl font-bold">🚗 Führerschein Quiz</h1>
      <p className="text-lg text-gray-300 max-w-xl">
        Teste dein Wissen zur theoretischen Führerscheinprüfung.
        Wähle ein Modul, beantworte Fragen – und sieh sofort dein Ergebnis.
      </p>

      
      <Link
        href="/modules"
        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-lg transition"
      >
        ➕ Modul wählen
      </Link>

      
      <Link
        href="/exam"
        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded text-lg transition"
      >
        📝 Prüfungssimulation starten
      </Link>

    </div>
  )
}
