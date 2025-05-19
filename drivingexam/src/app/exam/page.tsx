'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Module } from '@/app/types/Module'

export default function ExamStartPage() {
  const [modules, setModules] = useState<Module[]>([])

  useEffect(() => {
    fetch('http://localhost:5080/api/modules')
      .then((res) => res.json())
      .then((data) => setModules(data))
      .catch((err) => console.error('Fehler beim Laden der Module:', err))
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">📝 Prüfungssimulation</h1>
      <p className="mb-6">Wähle ein Modul, um die Prüfung zu starten:</p>

      <ul className="space-y-2">
        {modules.map((m) => (
          <li key={m.guid}>
            <Link
              href={`/exam/${m.guid}`}
              className="block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
            >
              {m.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
