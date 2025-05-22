"use server"

import { Question } from "@/app/types/Question"
import { CheckAnswerPayload } from "@/app/types/CheckAnswerPayload"
import { CheckAnswerResult } from "@/app/types/CheckAnswerResult"
import { Module } from "@/app/types/Module"
import { Topic } from "@/app/types/Topic"

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5080/api"

export async function getModules(): Promise<Module[]> {
  const res = await fetch(`${BASE_URL}/modules`, { cache: "no-store" })
  if (!res.ok) throw new Error("Fehler beim Laden der Module")
  console.log(res);
  return res.json()
}

export async function getTopics(moduleId: string): Promise<Topic[]> {
  const res = await fetch(`${BASE_URL}/topics?assignedModule=${moduleId}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Fehler beim Laden der Topics")
    console.log(res);
  return res.json()
}

export async function getQuestions(moduleId: string, topicId: string): Promise<Question[]> {
  const res = await fetch(`${BASE_URL}/questions?moduleGuid=${moduleId}&topicGuid=${topicId}`, { cache: "no-store" })
  if (!res.ok) throw new Error("Fehler beim Laden der Fragen")
  return res.json()
}

export async function getExamQuestions(moduleId: string): Promise<Question[]> {
  const res = await fetch(`${BASE_URL}/questions/exam/${moduleId}?count=20`, { cache: "no-store" })
  if (!res.ok) throw new Error("Fehler beim Laden der Prüfungsfragen")
  return res.json()
}

export async function checkAnswers(questionGuid: string, payload: CheckAnswerPayload): Promise<CheckAnswerResult> {
  const res = await fetch(`${BASE_URL}/questions/${questionGuid}/checkanswers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error("Fehler beim Überprüfen der Antworten")
  return res.json()
}
