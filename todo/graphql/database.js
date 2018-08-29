class Todo {}
class User {}

// Mock authenticated ID
const VIEWER_ID = 'me'

// Mock user data
const viewer = new User()
viewer.id = VIEWER_ID
const usersById = {
  [VIEWER_ID]: viewer
}

// Mock todo data
const todosById = {}
const todoIdsByUser = {
  [VIEWER_ID]: []
}
let nextTodoId = 0
addTodo('Taste JavaScript', true)
addTodo('Buy a unicorn', false)

function addTodo (title, complete) {
  const todo = new Todo()
  todo.complete = !!complete
  todo.id = `${nextTodoId++}`
  todo.title = title
  todosById[todo.id] = todo
  todoIdsByUser[VIEWER_ID].push(todo.id)
  return todo.id
}

function changeTodoStatus (id, complete) {
  const todo = getTodo(id)
  todo.complete = complete
}

function getTodo (id) {
  return todosById[id]
}

function getTodos (status = 'any') {
  const todos = todoIdsByUser[VIEWER_ID].map(id => todosById[id])
  if (status === 'any') {
    return todos
  }
  return todos.filter(todo => todo.complete === (status === 'completed'))
}

function getUser (id) {
  return usersById[id]
}

function getViewer () {
  return getUser(VIEWER_ID)
}

function markAllTodos (complete) {
  const changedTodos = []
  getTodos().forEach(todo => {
    if (todo.complete !== complete) {
      todo.complete = complete
      changedTodos.push(todo)
    }
  })
  return changedTodos.map(todo => todo.id)
}

function removeTodo (id) {
  const todoIndex = todoIdsByUser[VIEWER_ID].indexOf(id)
  if (todoIndex !== -1) {
    todoIdsByUser[VIEWER_ID].splice(todoIndex, 1)
  }
  delete todosById[id]
}

function removeCompletedTodos () {
  const todosToRemove = getTodos().filter(todo => todo.complete)
  todosToRemove.forEach(todo => removeTodo(todo.id))
  return todosToRemove.map(todo => todo.id)
}

function renameTodo (id, title) {
  const todo = getTodo(id)
  todo.title = title
}

module.exports = {
  Todo,
  User,
  addTodo,
  changeTodoStatus,
  getTodo,
  getTodos,
  getUser,
  getViewer,
  markAllTodos,
  removeTodo,
  removeCompletedTodos,
  renameTodo
}
