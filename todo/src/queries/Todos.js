import { graphql } from 'vue-relay'

export default {
  user: graphql`
    fragment Todos_user on User {
      id
      userId
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
      ...Todo_user
    }
  `
}
