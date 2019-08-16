import { graphql } from 'vue-relay'

export default graphql`
  query AppQuery($userId: String) {
    user(id: $userId) {
      ...Todos_user
    }
  }
`
