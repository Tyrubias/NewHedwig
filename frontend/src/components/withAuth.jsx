import { useAuth } from '../hooks/authentication'

import { LoadingPage } from './LoadingComponents'

import Login from '../pages/Login'

/**
 *
 * @param {JSX.Element} InnerComponent the authenticated component
 * @returns {JSX.Element} the login page if we're not authenticated,
 * or
 */
function withAuth (InnerComponent) {
  return props => {
    const { loading, loggedIn } = useAuth()

    if (loading) {
      return <LoadingPage />
    } else if (!loading && !loggedIn) {
      return <Login />
    }

    return <InnerComponent {...props} />
  }
}

export default withAuth
