const {
  GraphQLBoolean,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString
} = require('graphql')

const {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  toGlobalId
} = require('graphql-relay')

const {
  Todo,
  User,
  addTodo,
  changeTodoStatus,
  getTodo,
  getTodos,
  getUser,
  getViewer,
  markAllTodos,
  removeCompletedTodos,
  removeTodo,
  renameTodo
} = require('./database')

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId(globalId)
    if (type === 'Todo') {
      return getTodo(id)
    } else if (type === 'User') {
      return getUser(id)
    }
    return null
  },
  (obj) => {
    if (obj instanceof Todo) {
      return GraphQLTodo
    } else if (obj instanceof User) {
      return GraphQLUser
    }
    return null
  }
)

const GraphQLTodo = new GraphQLObjectType({
  name: 'Todo',
  fields: {
    id: globalIdField('Todo'),
    title: {
      type: GraphQLString,
      resolve: (obj) => obj.title
    },
    complete: {
      type: GraphQLBoolean,
      resolve: (obj) => obj.complete
    }
  },
  interfaces: [nodeInterface]
})

const {
  connectionType: TodosConnection,
  edgeType: GraphQLTodoEdge
} = connectionDefinitions({
  name: 'Todo',
  nodeType: GraphQLTodo
})

const GraphQLUser = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: globalIdField('User'),
    todos: {
      type: TodosConnection,
      args: {
        status: {
          type: GraphQLString,
          defaultValue: 'any'
        },
        ...connectionArgs
      },
      resolve: (obj, {status, ...args}) =>
        connectionFromArray(getTodos(status), args)
    },
    totalCount: {
      type: GraphQLInt,
      resolve: () => getTodos().length
    },
    completedCount: {
      type: GraphQLInt,
      resolve: () => getTodos('completed').length
    }
  },
  interfaces: [nodeInterface]
})

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer()
    },
    node: nodeField
  }
})

const GraphQLAddTodoMutation = mutationWithClientMutationId({
  name: 'AddTodo',
  inputFields: {
    title: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    todoEdge: {
      type: GraphQLTodoEdge,
      resolve: ({localTodoId}) => {
        const todo = getTodo(localTodoId)
        return {
          cursor: cursorForObjectInConnection(getTodos(), todo),
          node: todo
        }
      }
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer()
    }
  },
  mutateAndGetPayload: ({title}) => {
    const localTodoId = addTodo(title)
    return {localTodoId}
  }
})

const GraphQLChangeTodoStatusMutation = mutationWithClientMutationId({
  name: 'ChangeTodoStatus',
  inputFields: {
    complete: { type: new GraphQLNonNull(GraphQLBoolean) },
    id: { type: new GraphQLNonNull(GraphQLID) }
  },
  outputFields: {
    todo: {
      type: GraphQLTodo,
      resolve: ({localTodoId}) => getTodo(localTodoId)
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer()
    }
  },
  mutateAndGetPayload: ({id, complete}) => {
    const localTodoId = fromGlobalId(id).id
    changeTodoStatus(localTodoId, complete)
    return {localTodoId}
  }
})

const GraphQLMarkAllTodosMutation = mutationWithClientMutationId({
  name: 'MarkAllTodos',
  inputFields: {
    complete: { type: new GraphQLNonNull(GraphQLBoolean) }
  },
  outputFields: {
    changedTodos: {
      type: new GraphQLList(GraphQLTodo),
      resolve: ({changedTodoLocalIds}) => changedTodoLocalIds.map(getTodo)
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer()
    }
  },
  mutateAndGetPayload: ({complete}) => {
    const changedTodoLocalIds = markAllTodos(complete)
    return {changedTodoLocalIds}
  }
})

// TODO: Support plural deletes
const GraphQLRemoveCompletedTodosMutation = mutationWithClientMutationId({
  name: 'RemoveCompletedTodos',
  outputFields: {
    deletedTodoIds: {
      type: new GraphQLList(GraphQLString),
      resolve: ({deletedTodoIds}) => deletedTodoIds
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer()
    }
  },
  mutateAndGetPayload: () => {
    const deletedTodoLocalIds = removeCompletedTodos()
    const deletedTodoIds = deletedTodoLocalIds.map(toGlobalId.bind(null, 'Todo'))
    return {deletedTodoIds}
  }
})

const GraphQLRemoveTodoMutation = mutationWithClientMutationId({
  name: 'RemoveTodo',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) }
  },
  outputFields: {
    deletedTodoId: {
      type: GraphQLID,
      resolve: ({id}) => id
    },
    viewer: {
      type: GraphQLUser,
      resolve: () => getViewer()
    }
  },
  mutateAndGetPayload: ({id}) => {
    const localTodoId = fromGlobalId(id).id
    removeTodo(localTodoId)
    return {id}
  }
})

const GraphQLRenameTodoMutation = mutationWithClientMutationId({
  name: 'RenameTodo',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    title: { type: new GraphQLNonNull(GraphQLString) }
  },
  outputFields: {
    todo: {
      type: GraphQLTodo,
      resolve: ({localTodoId}) => getTodo(localTodoId)
    }
  },
  mutateAndGetPayload: ({id, title}) => {
    const localTodoId = fromGlobalId(id).id
    renameTodo(localTodoId, title)
    return {localTodoId}
  }
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addTodo: GraphQLAddTodoMutation,
    changeTodoStatus: GraphQLChangeTodoStatusMutation,
    markAllTodos: GraphQLMarkAllTodosMutation,
    removeCompletedTodos: GraphQLRemoveCompletedTodosMutation,
    removeTodo: GraphQLRemoveTodoMutation,
    renameTodo: GraphQLRenameTodoMutation
  }
})

const schema = new GraphQLSchema({
  query: Query,
  mutation: Mutation
})

module.exports = {
  schema
}
