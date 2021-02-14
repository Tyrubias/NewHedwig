import gql from 'graphql-tag.macro'

const AUTHENTICATE_USER = gql`
  mutation AuthenticateMutation($idToken: String!) {
    authenticateUser(idToken: $idToken) {
      _id
      token
      netid
      recentUpdate
      vendor
      phone
      name
      isAdmin
      studentId
      type
      studentId
    }
  }
`

export { AUTHENTICATE_USER }
