import User from 'App/Models/User'

const resolvers = {
  Query: {
    user(parent, args, context, info) {
      return User.find(args.id)
    },
    users(parent, args, context, info) {
      return User.all()
    },
  },
}

export default resolvers
