import {
  commitMutation,
  graphql
} from 'vue-relay'

const mutation = graphql`
  mutation RenameTodoMutation($input: RenameTodoInput!) {
    renameTodo(input: $input) {
      todo {
        id
        title
      }
    }
  }
`

function getOptimisticResponse (title, todo) {
  return {
    renameTodo: {
      todo: {
        id: todo.id,
        title: title
      }
    }
  }
}

function commit (
  environment,
  title,
  todo
) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {title, id: todo.id}
      },
      optimisticResponse: getOptimisticResponse(title, todo)
    }
  )
}

export default {commit}
