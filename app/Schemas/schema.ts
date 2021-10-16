import { gql } from 'apollo-server'

const schema = gql`
  scalar PositiveInt

  type Day {
    id: Int!
    userId: Int!
    rating: Int
    mood: String
    meals: Int
    water: Int
    people: Int
    activities: Int
    exercise: Boolean
    meds: Boolean
    journal: String
    createdAt: PositiveInt!
    updatedAt: PositiveInt!
  }

  type User {
    id: Int!
    email: String!
    admin: Boolean!
    enabled: String!
    createdAt: PositiveInt!
    updatedAt: PositiveInt!
    days: [Day]
  }

  type Query {
    user(
      id: Int
      email: String
      admin: Boolean
      enabled: String
      createdAt: Int
      updatedAt: Int
    ): User

    users(
      id: Int
      email: String
      admin: Boolean
      enabled: String
      createdAt: Int
      updatedAt: Int
    ): [User]

    day(
      id: Int
      userId: Int
      rating: Int
      mood: String
      meals: Int
      water: Int
      people: Int
      activities: Int
      exercise: Boolean
      meds: Boolean
      journal: String
      createdAt: PositiveInt
      updatedAt: PositiveInt
    ): Day

    days(
      id: Int
      userId: Int
      rating: Int
      mood: String
      meals: Int
      water: Int
      people: Int
      activities: Int
      exercise: Boolean
      meds: Boolean
      journal: String
      createdAt: PositiveInt
      updatedAt: PositiveInt
    ): [Day]
  }
  type Mutation {
    addDay(
      rating: Int
      mood: String
      meals: Int
      water: Int
      people: Int
      activities: Int
      exercise: Boolean
      meds: Boolean
      journal: String
    ): Day

    addUser(email: String!, password: String!, enabled: String): User
  }
`

export default schema
