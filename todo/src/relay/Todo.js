import { graphql } from 'vue-relay'

export default {
  todo: graphql`
    fragment Todo_todo on Todo {
      complete
      id
      title
    }
  `,
  viewer: graphql`
    fragment Todo_viewer on User {
      id
      totalCount
      completedCount
    }
  `
}
