'use client'

import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Question } from '@/app/types/Question'
import { CheckAnswerPayload } from '@/app/types/CheckAnswerPayload'
import { CheckAnswerResult } from '@/app/types/CheckAnswerResult'
import { Module } from '@/app/types/Module'
import styles from './ExamPage.module.css'

export default function ExamPage() {
  const { moduleId } = useParams()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<{ [id: string]: boolean }>({})
  const [result, setResult] = useState<CheckAnswerResult | null>(null)
  const [totalPoints, setTotalPoints] = useState(0)
  const [totalReachable, setTotalReachable] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [moduleName, setModuleName] = useState('')

  useEffect(() => {
    if (!moduleId) return

    fetch('http://localhost:5080/api/modules')
      .then(res => res.json())
      .then((modules: Module[]) => {
        const found = modules.find((m) => m.guid === moduleId)
        if (found) setModuleName(found.name)
      })
      .catch(err => console.error('Fehler beim Laden des Moduls:', err))

    fetch(`http://localhost:5080/api/questions/exam/${moduleId}?count=20`)
      .then((res) => {
        if (!res.ok) throw new Error('Serverantwort war fehlerhaft')
        return res.json()
      })
      .then((data) => setQuestions(data))
      .catch((err) => {
        console.error('Fehler beim Laden der Fragen:', err)
        setError('Fehler beim Laden der Fragen.')
      })
      .finally(() => setLoading(false))
  }, [moduleId])

  const current = questions[currentIndex]

  const handleCheck = (answerId: string) => {
    setSelected((prev) => ({
      ...prev,
      [answerId]: !prev[answerId],
    }))
  }

  const handleSubmit = async () => {
    if (!current) return

    const payload: CheckAnswerPayload = {
      checkedAnswers: current.answers.map((a) => ({
        guid: a.guid,
        isChecked: !!selected[a.guid],
      })),
    }

    const res = await fetch(`http://localhost:5080/api/questions/${current.guid}/checkanswers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data: CheckAnswerResult = await res.json()
    setResult(data)
    setTotalPoints((p) => p + data.pointsReached)
    setTotalReachable((p) => p + data.pointsReachable)
  }

  const handleNext = () => {
    setSelected({})
    setResult(null)
    setCurrentIndex((i) => i + 1)
  }

  const getFeedback = () => {
    if (totalReachable === 0) return ''
    const ratio = totalPoints / totalReachable
    if (ratio >= 0.9) return '🌟 Ausgezeichnet!'
    if (ratio >= 0.75) return '✅ Sehr gut gemacht!'
    if (ratio >= 0.6) return '🙂 Du bist auf dem richtigen Weg.'
    return '💡 Bitte nochmal üben!'
  }

  if (loading) return <p className="text-center mt-10">⏳ Fragen werden geladen...</p>
  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>

  if (!current) {
    return (
      <div className={styles.container}>
        <h2>🎉 Prüfung abgeschlossen!</h2>
        <p><strong>Modul:</strong> {moduleName || moduleId}</p>
        <p><strong>Deine Punkte:</strong> {totalPoints} / {totalReachable}</p>
        <p className="mt-2 text-xl">{getFeedback()}</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Frage {currentIndex + 1} von {questions.length}</h2>
      <p className={styles.question}>{current.number}. {current.text}</p>
      {current.imageUrl && (
        <Image
          src={current.imageUrl}
          alt="Fragenbild"
          width={300}
          height={200}
          className={styles.image}
        />
      )}

      <form className={styles.answers} onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
        {current.answers.map((a) => {
          const isChecked = !!selected[a.guid]
          const isCorrect = result?.checkResult[a.guid]
          const highlight = result
            ? isCorrect
              ? styles.correct
              : styles.wrong
            : ''
          return (
            <div key={a.guid} className={`${styles.answerRow} ${highlight}`}>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => handleCheck(a.guid)}
                disabled={!!result}
              />
              <label>{a.text}</label>
            </div>
          )
        })}
      </form>

      {!result && (
        <button onClick={handleSubmit} className={styles.checkBtn}>Antwort überprüfen</button>
      )}

      {result && (
        <button onClick={handleNext} className={styles.nextBtn}>Nächste Frage</button>
      )}
    </div>
  )
}
