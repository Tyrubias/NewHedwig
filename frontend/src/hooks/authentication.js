import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import firebase from 'firebase/app'
import 'firebase/auth'

import { useMutation } from '@apollo/client'

import getInitApolloClient from '../graphql/apollo'
import { AUTHENTICATE_USER } from '../graphql/Mutations'

function useInitAuth () {
  const navigate = useNavigate()

  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  const [authenticateUser, { data }] = useMutation(AUTHENTICATE_USER)

  useEffect(() => {
    async function handleAuthFlow () {
      await handleLogin()
      checkLoggedIn()
    }

    async function handleLogin () {
      const redirectResult = await firebase.auth().getRedirectResult()

      if (redirectResult.user && redirectResult.additionalUserInfo) {
        getInitApolloClient() // This will initialize Apollo

        await authenticateUser({
          variables: { idToken: await redirectResult.user.getIdToken() }
        })

        window.localStorage.setItem('userProfile', JSON.stringify(data))

        setLoggedIn(true)

        if (data.vendor) {
          navigate('/vendor_choice')
        }

        if (/^[0-9]{10}$/.test(data.phone)) {
          navigate('/eat')
        }

        navigate('/contact')
      } else {
        setLoading(false)
      }
    }

    function checkLoggedIn () {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          setLoggedIn(true)

          if (data.vendor) {
            navigate('/vendor_choice')
          }

          if (/^[0-9]{10}$/.test(data.phone)) {
            navigate('/eat')
          }

          navigate('/contact')
        }
      })
    }

    handleAuthFlow()
  }, [])

  return { loggedIn, loading }
}

function useAuth () {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLoggedIn = async () => {
      // Uses firebase's tool to check whether the user is logged in or not
      return firebase.auth().onAuthStateChanged(user => {
        if (user) {
          setLoggedIn(true)
        }
        setLoading(false)
      })
    }
    checkLoggedIn()
  }, [])

  return { loggedIn, loading }
}

export { useInitAuth, useAuth }
