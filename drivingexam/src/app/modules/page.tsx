'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import styles from './ModulesPage.module.css'
import { Module } from '../types/Module'

export default function ModulesPage() {
  const [modules, setModules] = useState<Module[]>([])

  useEffect(() => {
    fetch('http://localhost:5080/api/modules')
      .then((res) => res.json())
      .then((data) => setModules(data))
      .catch((error) => console.error('Fehler beim Laden der Module:', error))
  }, [])

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Module</h2>
      <ul className={styles.list}>
        {modules.map((mod) => (
          <li key={mod.guid}>
            <Link href={`/modules/${mod.guid}`} className={styles.link}>
              {mod.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
