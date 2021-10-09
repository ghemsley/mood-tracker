import { gql } from 'apollo-server'

const schema = gql`
  scalar PositiveInt

  type Day {
    id: Int
    userId: Int
    rating: Int
    mood: String
    meals: Int
    exercise: Boolean
    meds: Boolean
  }

  type User {
    id: Int
    username: String
    admin: Boolean
    createdAt: PositiveInt
    updatedAt: PositiveInt
    days: [Day]
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    user(id: Int, username: String, admin: Boolean, createdAt: Int, updatedAt: Int): User
    users(id: Int, username: String, admin: Boolean, createdAt: Int, updatedAt: Int): [User]
    day(
      id: Int
      userId: Int
      rating: Int
      mood: String
      meals: Int
      exercise: Boolean
      meds: Boolean
    ): Day
    days(
      id: Int
      userId: Int
      rating: Int
      mood: String
      meals: Int
      exercise: Boolean
      meds: Boolean
    ): [Day]
  }
`

export default schema
