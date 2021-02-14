// Apollo Client Setup
import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from '@apollo/client/link/context'

// Apollo Subscriptions Setup
import { WebSocketLink } from '@apollo/client/link/ws'
import { GRAPHQL_URL, GRAPHQL_WS_URL } from '../config'

import firebase from 'firebase'
import 'firebase/auth'

let apolloClient

function createApolloClient () {
  const authLink = setContext(async (_, { headers }) => {
    const token = await firebase.auth().currentUser.getIdToken()

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  })

  const httpLink = new HttpLink({
    uri: GRAPHQL_URL
  })

  const wsLink = WebSocketLink({
    uri: GRAPHQL_WS_URL,
    options: {
      reconnect: true,
      connectionParams: (async () => ({
        authToken: await firebase.auth().currentUser.getIdToken()
      }))()
    }
  })

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query)
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink
  )

  const cache = new InMemoryCache({
    typePolicies: {
      Subscription: {
        fields: {
          orderUpdated: {
            merge (_existing, incoming) {
              return incoming
            }
          }
        }
      }
    }
  })

  return new ApolloClient({
    cache: cache,
    link: authLink.concat(splitLink)
  })
}

/**
 *
 * @returns {ApolloClient<import('@apollo/client').NormalizedCacheObject>}
 */
function getInitApolloClient () {
  if (!apolloClient) {
    apolloClient = createApolloClient()
  }

  return apolloClient
}

export default getInitApolloClient
