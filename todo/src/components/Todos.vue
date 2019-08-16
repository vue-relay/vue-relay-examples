<template>
  <section class="todoapp">
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" type="text"
        autofocus="autofocus"
        autocomplete="off"
        placeholder="What needs to be done?"
        v-model="text"
        @keyup.enter="newTodo">
    </header>
    <section class="main">
      <input type="checkbox" id="toggle-all" class="toggle-all" :checked="numTodos === numCompletedTodos" @change="toggleAll">
      <label for="toggle-all">
        Mark all as complete
      </label>
      <ul class="todo-list">
        <todo-container :todo="edge.node" :user="user" v-for="edge in user.todos.edges" :key="edge.node.id"></todo-container>
      </ul>
    </section>
    <footer class="footer">
      <span class="todo-count">
        <strong>{{ numRemainingTodos }}</strong> item{{ numRemainingTodos === 1 ? '' : 's' }} left
      </span>
      <ul class="filters">
        <li><router-link to="/" exact active-class="selected">All</router-link></li>
        <li><router-link to="/active" exact active-class="selected">Active</router-link></li>
        <li><router-link to="/completed" exact active-class="selected">Completed</router-link></li>
      </ul>
      <button class="clear-completed" @click="clearCompleted" v-if="numCompletedTodos > 0">
        Clear completed
      </button>
    </footer>
  </section>
</template>

<script>
import { createFragmentContainer } from 'vue-relay'
import Todo from '@/components/Todo'
import TodoFragmentSpec from '@/relay/Todo'
import AddTodoMutation from '@/mutations/AddTodoMutation'
import MarkAllTodosMutation from '@/mutations/MarkAllTodosMutation'
import RemoveCompletedTodosMutation from '@/mutations/RemoveCompletedTodosMutation'

export default {
  name: 'todos',
  props: ['relay', 'user'],
  components: {
    TodoContainer: createFragmentContainer(Todo, TodoFragmentSpec)
  },
  data () {
    return {
      text: ''
    }
  },
  computed: {
    numTodos () {
      return this.user.totalCount
    },
    numCompletedTodos () {
      return this.user.completedCount
    },
    numRemainingTodos () {
      return this.user.totalCount - this.user.completedCount
    }
  },
  methods: {
    newTodo () {
      if (this.text !== '') {
        AddTodoMutation.commit(
          this.relay.environment,
          this.text,
          this.user
        )
        this.text = ''
      }
    },
    toggleAll () {
      MarkAllTodosMutation.commit(
        this.relay.environment,
        this.numTodos !== this.numCompletedTodos,
        this.user.todos,
        this.user
      )
    },
    clearCompleted () {
      const edges = this.user.todos.edges.filter(edge => edge.node.complete === true)
      RemoveCompletedTodosMutation.commit(
        this.relay.environment,
        {
          edges
        },
        this.user
      )
    }
  }
}
</script>
