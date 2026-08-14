import { ClassSession } from "@/types/domain";

/**
 * Converts "HH:MM" string to minutes from 00:00.
 */
export function timeToMinutes(timeStr: string): number {
  const parts = timeStr.split(":");
  const hours = parseInt(parts[0] ?? "0", 10);
  const minutes = parseInt(parts[1] ?? "0", 10);
  return hours * 60 + minutes;
}

/**
 * Checks if two class sessions overlap in time on the same day.
 * Adjacent sessions (e.g. 09:00-10:00 and 10:00-11:00) do NOT overlap.
 */
export function doSessionsOverlap(
  sessionA: ClassSession,
  sessionB: ClassSession
): boolean {
  if (sessionA.id === sessionB.id) return false;
  if (sessionA.dayOfWeek !== sessionB.dayOfWeek) return false;

  const startA = timeToMinutes(sessionA.startTime);
  const endA = timeToMinutes(sessionA.endTime);
  const startB = timeToMinutes(sessionB.startTime);
  const endB = timeToMinutes(sessionB.endTime);

  // Interval overlap condition: startA < endB && startB < endA
  return startA < endB && startB < endA;
}

/**
 * Finds all conflicting session IDs for a list of class sessions.
 */
export function detectTimetableConflicts(
  sessions: ClassSession[]
): Set<string> {
  const conflictingIds = new Set<string>();

  for (let i = 0; i < sessions.length; i++) {
    const sessionA = sessions[i];
    if (!sessionA) continue;

    for (let j = i + 1; j < sessions.length; j++) {
      const sessionB = sessions[j];
      if (!sessionB) continue;

      if (doSessionsOverlap(sessionA, sessionB)) {
        conflictingIds.add(sessionA.id);
        conflictingIds.add(sessionB.id);
      }
    }
  }

  return conflictingIds;
}
