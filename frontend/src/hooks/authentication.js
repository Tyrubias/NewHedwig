import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import firebase from 'firebase/app'
import 'firebase/auth'
import moment from 'moment'

function useInitialAuthentication () {
  const navigate = useNavigate()
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function handleAuthFlow () {
      await handleLogin()
      checkLoggedIn()
    }

    async function handleLogin () {
      const redirectResult = await firebase.auth().getRedirectResult()

      if (redirectResult.user && redirectResult.additionalUserInfo) {
        const idTokenResult = await redirectResult.user.getIdTokenResult()

        window.localStorage.setItem('token', idTokenResult.token)
        window.localStorage.setItem(
          'expirationTime',
          moment(idTokenResult.expirationTime).format()
        )
      } else {
        setLoading(false)
      }
    }

    function checkLoggedIn () {
      return firebase.auth().onAuthStateChanged(user => {
        if (user) {
          setLoggedIn(true)
        }
      })
    }

    handleAuthFlow()
  }, [])

  return { loggedIn, loading }
}
