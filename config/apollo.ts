import { ApolloConfig, ApolloBaseContext } from '@ioc:Zakodium/Apollo/Server'

interface ApolloContext extends ApolloBaseContext {
  // Define here what will be available in the GraphQL context
  userId: number | null
}

const apolloConfig: ApolloConfig<ApolloContext> = {
  schemas: 'app/Schemas',
  resolvers: 'app/Resolvers',
  path: '/graphql',
  apolloServer: {
    context({ ctx }) {
      if (ctx.request.ip() !== '127.0.0.1') {
        return { ctx, userId: null }
      }
      const auth = ctx.request.headers().authorization
      const array = auth && auth.split(' ')
      // let token
      let userId
      if (typeof array !== 'undefined' && array !== null) {
        // token = array[1]
        userId = array[2]
      }
      return { ctx, userId: userId ? userId : null }
    },
  },
  executableSchema: {
    inheritResolversFromInterfaces: true,
  },
}

export default apolloConfig
