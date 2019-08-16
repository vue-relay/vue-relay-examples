import { graphql } from 'vue-relay'

export default {
  todo: graphql`
    fragment Todo_todo on Todo {
      complete
      id
      text
    }
  `,
  user: graphql`
    fragment Todo_user on User {
      id
      userId
      totalCount
      completedCount
    }
  `
}
