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

      if (user?.admin) {
        return User.query().preload('days').where(args).first()
      } else {
        return user?.load('days')
      }
    },
    async users(parent, args, context, info) {
      const user = await getUser(context)
      return user?.admin ? User.query().preload('days').where(args) : user?.load('days')
    },
    async day(parent, args, context, info) {
      const user = await getUser(context)
      if (user?.admin) {
        if (parent) {
          return Day.query()
            .where({ ...args, userId: parent.id })
            .first()
        } else {
          return Day.query().where(args).first()
        }
      } else {
        return user?.related('days').query().where(args).first()
      }
    },
    async days(parent, args, context, info) {
      const user = await getUser(context)
      if (user?.admin) {
        if (parent) {
          return Day.query().where({ ...args, userId: parent.id })
        } else {
          return Day.query().where(args)
        }
      } else {
        return user?.related('days').query().where(args)
      }
    },
  },
  Mutation: {
    async addUser(parent, args, context, info) {
      if (args?.email && args?.password) {
        return User.create(args)
      } else throw new Error('User cannot be created without username and password arguments')
    },
    async addDay(parent, args, context, info) {
      const user = await getUser(context)
      if (user?.admin) {
        const options = { ...args }
        const dayUser = await User.find(options.userId)
        delete options.userId
        return dayUser?.related('days').create(options)
      } else {
        const options = { ...args }
        if (options.userId) {
          delete options.userId
        }
        return user?.related('days').create(options)
      }
    },
  },
}

export default resolvers
