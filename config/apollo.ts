import { ApolloConfig, ApolloBaseContext } from '@ioc:Zakodium/Apollo/Server'

interface ApolloContext extends ApolloBaseContext {
  // Define here what will be available in the GraphQL context
  userId: number
}

const apolloConfig: ApolloConfig<ApolloContext> = {
  schemas: 'app/Schemas',
  resolvers: 'app/Resolvers',
  path: '/graphql',
  apolloServer: {
    context({ ctx }) {
      const auth = ctx.request.headers().authorization
      const array = auth && auth.split(' ')
      // let token
      let userId
      if (typeof array !== 'undefined' && array !== null) {
        // token = array[1]
        userId = array[2]
      }
      return { ctx, userId }
    },
  },
  executableSchema: {
    inheritResolversFromInterfaces: true,
  },
}

export default apolloConfig
