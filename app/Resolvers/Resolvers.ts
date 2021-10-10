import Day from 'App/Models/Day'
import User from 'App/Models/User'

const getUser = async (context) => {
  const { userId } = context
  return User.find(userId)
}

const resolvers = {
  Query: {
    async user(parent, args, context, info) {
      const user = await getUser(context)
      if (user && user.admin) {
        return User.query().preload('days').where(args).first()
      } else {
        return User.find(user)
      }
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
