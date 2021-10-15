import { DateTime } from 'luxon'

/** an object representing a day */
export type DayObject = {
  id?: number
  userId?: number
  rating?: number
  mood?: string
  meals?: number
  water?: number
  people?: number
  activities?: number
  meds?: boolean
  exercise?: boolean
  journal?: string
  createdAt?: number
  updatedAt?: number
}

/** a model for a single day */
class Day {
  constructor(args: DayObject) {
    this.id = args.id ? args.id : null
    this.userId = args.userId ? args.userId : null
    this.rating = args.rating ? args.rating : null
    this.mood = args.mood ? args.mood : null
    this.meals = args.meals ? args.meals : null
    this.water = args.water ? args.water : null
    this.people = args.people ? args.people : null
    this.activities = args.activities ? args.activities : null
    this.meds = args.meds ? args.meds : null
    this.exercise = args.exercise ? args.exercise : null
    this.journal = args.journal ? args.journal : null
    this.createdAt = args.createdAt ? args.createdAt : null
    this.updatedAt = args.updatedAt ? args.updatedAt : null
  }
  /** id of the day */
  public id: number | null
  /** user id associated with the day */
  public userId: number | null
  /** mood rating of the day */
  public rating: number | null
  /** the prevailing emotion for the day */
  public mood: string | null
  /** how many meals eaten this day */
  public meals: number | null
  /** glasses of water consumed on this day */
  public water: number | null
  /** how many friends/people were talked to on this day */
  public people: number | null
  /** how many fun activities were enjoyed on this day */
  public activities: number | null
  /** were user's meds all taken on this day */
  public meds: boolean | null
  /** did the user get exercise on this day */
  public exercise: boolean | null
  /** journal entry associated with this day */
  public journal: string | null
  /** date the day was created at in Date compatible millisecond format */
  public createdAt: number | null

  /** date the day was updated at in Date compatible millisecond format */
  public updatedAt: number | null

  /** map properties to a new plain object */
  public toObject() {
    return {
      id: this.id,
      userId: this.userId,
      rating: this.rating,
      mood: this.mood,
      meals: this.meals,
      water: this.water,
      people: this.people,
      activities: this.activities,
      meds: this.meds,
      exercise: this.exercise,
      journal: this.journal,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
  /** update this day instance from a plain object */
  public updateFromObject(object: DayObject) {
    for (const [key, value] of Object.entries(object))
      if (new Set(Object.keys(this)).has(key)) {
        typeof value === 'string'
          ? Function(`this.${key} = '${value}'`).call(this)
          : Function(`this.${key} = ${value}`).call(this)
      }
    return this
  }
}

export default Day
