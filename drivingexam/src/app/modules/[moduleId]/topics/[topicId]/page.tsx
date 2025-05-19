'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import styles from './QuestionsPage.module.css'

import { Question } from '@/app/types/Question'
import { CheckAnswerResult } from '@/app/types/CheckAnswerResult'
import { CheckAnswerPayload } from '@/app/types/CheckAnswerPayload'

export default function TopicQuestionsPage() {
  const { moduleId, topicId } = useParams()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<{ [answerId: string]: boolean }>({})
  const [result, setResult] = useState<CheckAnswerResult | null>(null)

  useEffect(() => {
    if (!moduleId || !topicId) return

    fetch(`http://localhost:5080/api/questions?moduleGuid=${moduleId}&topicGuid=${topicId}`)
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error('Fehler beim Laden der Fragen:', err))
  }, [moduleId, topicId])

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
  }

  const handleNext = () => {
    setSelected({})
    setResult(null)
    setCurrentIndex((i) => i + 1)
  }

  if (!current) {
    return <p>🎉 Alle Fragen abgeschlossen!</p>
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Frage {currentIndex + 1}</h2>
      <div className={styles.card}>
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
          <button onClick={handleSubmit} className={styles.checkBtn}>
            Antwort überprüfen
          </button>
        )}

        {result && (
          <button onClick={handleNext} className={styles.nextBtn}>
            Nächste Frage
          </button>
        )}
      </div>
    </div>
  )
}
