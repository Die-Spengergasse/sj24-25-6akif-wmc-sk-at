export function getFeedbackText(pointsReached: number, pointsMax: number): string {
  if (pointsMax === 0) return "";

  const ratio = pointsReached / pointsMax;

  if (ratio >= 0.9) return "🌟 Ausgezeichnet!";
  if (ratio >= 0.75) return "✅ Sehr gut gemacht!";
  if (ratio >= 0.6) return "🙂 Du bist auf dem richtigen Weg.";
  return "💡 Bitte nochmal üben!";
}
