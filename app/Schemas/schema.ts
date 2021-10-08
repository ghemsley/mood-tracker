import { gql } from 'apollo-server'

const types = gql`
  scalar DateTime

  type User {
    id: Int
    username: String
    admin: Boolean
    created: DateTime
    updated: DateTime
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    users: [User]
  }
`

export default types
