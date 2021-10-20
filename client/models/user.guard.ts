/*
 * Generated type guards for "user.ts".
 * WARNING: Do not manually change this file.
 */
import { UserObject } from './user'

export function isUserObject(obj: any, _argumentName?: string): obj is UserObject {
  return (
    ((obj !== null && typeof obj === 'object') || typeof obj === 'function') &&
    (typeof obj.id === 'undefined' || obj.id === null || typeof obj.id === 'number') &&
    (typeof obj.email === 'undefined' || obj.email === null || typeof obj.email === 'string') &&
    (typeof obj.admin === 'undefined' ||
      obj.admin === null ||
      obj.admin === false ||
      obj.admin === true) &&
    (typeof obj.enabled === 'undefined' ||
      obj.enabled === null ||
      typeof obj.enabled === 'string') &&
    (typeof obj.createdAt === 'undefined' ||
      obj.createdAt === null ||
      typeof obj.createdAt === 'number') &&
    (typeof obj.updatedAt === 'undefined' ||
      obj.updatedAt === null ||
      typeof obj.updatedAt === 'number')
  )
}
