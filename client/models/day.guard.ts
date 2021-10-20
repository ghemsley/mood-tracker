/*
 * Generated type guards for "day.ts".
 * WARNING: Do not manually change this file.
 */
import { DayObject } from './day'

export function isDayObject(obj: any, _argumentName?: string): obj is DayObject {
  return (
    ((obj !== null && typeof obj === 'object') || typeof obj === 'function') &&
    (typeof obj.id === 'undefined' || obj.id === null || typeof obj.id === 'number') &&
    (typeof obj.userId === 'undefined' || obj.userId === null || typeof obj.userId === 'number') &&
    (typeof obj.rating === 'undefined' || obj.rating === null || typeof obj.rating === 'number') &&
    (typeof obj.mood === 'undefined' || obj.mood === null || typeof obj.mood === 'string') &&
    (typeof obj.meals === 'undefined' || obj.meals === null || typeof obj.meals === 'number') &&
    (typeof obj.water === 'undefined' || obj.water === null || typeof obj.water === 'number') &&
    (typeof obj.people === 'undefined' || obj.people === null || typeof obj.people === 'number') &&
    (typeof obj.activities === 'undefined' ||
      obj.activities === null ||
      typeof obj.activities === 'number') &&
    (typeof obj.meds === 'undefined' ||
      obj.meds === null ||
      obj.meds === false ||
      obj.meds === true) &&
    (typeof obj.exercise === 'undefined' ||
      obj.exercise === null ||
      obj.exercise === false ||
      obj.exercise === true) &&
    (typeof obj.journal === 'undefined' ||
      obj.journal === null ||
      typeof obj.journal === 'string') &&
    (typeof obj.createdAt === 'undefined' ||
      obj.createdAt === null ||
      typeof obj.createdAt === 'number') &&
    (typeof obj.updatedAt === 'undefined' ||
      obj.updatedAt === null ||
      typeof obj.updatedAt === 'number')
  )
}
