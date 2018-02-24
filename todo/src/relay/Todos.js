import { graphql } from 'vue-relay'

export default graphql`
  fragment Todos_viewer on User {
    id
    todos(
      first: 2147483647  # max GraphQLInt
    ) @connection(key: "Todos_todos") {
      edges {
        node {
          id
          complete
          ...Todo_todo
        }
      }
    }
    totalCount
    completedCount
    ...Todo_viewer
  }
`
