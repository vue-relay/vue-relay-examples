import {
  commitMutation,
  graphql
} from 'vue-relay'
import {ConnectionHandler} from 'relay-runtime'

const mutation = graphql`
  mutation RemoveCompletedTodosMutation($input: RemoveCompletedTodosInput!) {
    removeCompletedTodos(input: $input) {
      deletedTodoIds,
      viewer {
        completedCount
        totalCount
      }
    }
  }
`

function sharedUpdater (store, user, deletedIDs) {
  const userProxy = store.get(user.id)
  const conn = ConnectionHandler.getConnection(
    userProxy,
    'Todos_todos'
  )
  deletedIDs.forEach((deletedID) =>
    ConnectionHandler.deleteNode(conn, deletedID)
  )
}

function commit (
  environment,
  todos,
  user
) {
  return commitMutation(
    environment,
    {
      mutation,
      variables: {
        input: {}
      },
      updater: (store) => {
        const payload = store.getRootField('removeCompletedTodos')
        sharedUpdater(store, user, payload.getValue('deletedTodoIds'))
      },
      optimisticUpdater: (store) => {
        if (todos && todos.edges) {
          const deletedIDs = todos.edges
            .filter(edge => edge.node.complete)
            .map(edge => edge.node.id)
          sharedUpdater(store, user, deletedIDs)
        }
      }
    }
  )
}

export default {commit}
