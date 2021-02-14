// Apollo Client Setup
import { ApolloClient, HttpLink, InMemoryCache, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { setContext } from '@apollo/client/link/context'

// Apollo Subscriptions Setup
import { WebSocketLink } from '@apollo/client/link/ws'
import { GRAPHQL_URL, GRAPHQL_WS_URL } from '../config'

import firebase from 'firebase'
import 'firebase/auth'

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
      connectionParams: getWebSocketParams()
    }
  })
}

async function getWebSocketParams() {
  const token = await firebase.auth().currentUser.getIdToken()

  return {
    authToken: token
  }
}
