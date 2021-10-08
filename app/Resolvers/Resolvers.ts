import Day from 'App/Models/Day'
import User from 'App/Models/User'

const resolvers = {
  Query: {
    user(parent, args, context, info) {
      return User.query().preload('days').where(args).first()
    },
    users(parent, args, context, info) {
      return User.query().preload('days').where(args)
    },
    day(parent, args, context, info) {
      return Day.query().where(args).first()
    },
    days(parent, args, context, info) {
      return Day.query().where(args)
    },
  },
}

export default resolvers
