import { graphql } from 'vue-relay'

export default graphql`
  query AppQuery {
    viewer {
      id
      ...Todos_viewer
    }
  }
`
