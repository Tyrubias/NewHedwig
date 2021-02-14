import {
  MainDiv,
  ElemDiv,
  Logo,
  Title,
  LoginButton
} from '../styles/Login.styles'
import logo from '../images/HedwigLogoFinal_02.svg'

import { LoadingPage } from '../components/LoadingComponents'

import { useInitAuth } from '../hooks/authentication'

import firebase from 'firebase'
import 'firebase/auth'

function Login () {
  const { loggedIn, loading } = useInitAuth()

  const signInSAML = () =>
    firebase
      .auth()
      .signInWithRedirect(
        new firebase.auth.SAMLAuthProvider('saml.rice-shibboleth')
      )

  return (
    <>
      {!loading && !loggedIn
        ? (
          <MainDiv>
            <ElemDiv>
              <Logo src={logo} />
              <Title>hedwig</Title>
              <LoginButton onClick={signInSAML}>Login with NetID</LoginButton>
            </ElemDiv>
          </MainDiv>
          )
        : (
          <LoadingPage />
          )}
    </>
  )
}

export default Login
