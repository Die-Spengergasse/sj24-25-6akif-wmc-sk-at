'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import styles from './TopicsPage.module.css'
import { Topic } from '@/app/types/Topic'

export default function ModuleDetailPage() {
  const { moduleId } = useParams()
  const [topics, setTopics] = useState<Topic[]>([])

  useEffect(() => {
    if (!moduleId) return
    fetch(`http://localhost:5080/api/topics?assignedModule=${moduleId}`)
      .then((res) => res.json())
      .then((data) => setTopics(data))
      .catch((err) => console.error('Fehler beim Laden der Topics:', err))
  }, [moduleId])

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Themen</h2>
      <ul className={styles.list}>
        {topics.map((topic) => (
          <li key={topic.guid}>
            <Link
              href={`/modules/${moduleId}/topics/${topic.guid}`}
              className={styles.link}
            >
              {topic.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
