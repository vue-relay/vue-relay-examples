<template>
  <li :class="{ completed: todo.complete, editing: isEditing }" v-if="show">
    <div class="view">
      <input type="checkbox" class="toggle" :checked="todo.complete" @change="toggle">
      <label @dblclick="edit">{{ todo.title }}</label>
      <button class="destroy" @click="destory"></button>
    </div>
    <input class="edit" type="text"
      v-todo-focus="isEditing"
      v-model="title"
      @blur="doneEdit"
      @keyup.enter="doneEdit"
      @keyup.esc="cancelEdit">
  </li>
</template>

<script>
import ChangeTodoStatusMutation from '@/mutations/ChangeTodoStatusMutation'
import RemoveTodoMutation from '@/mutations/RemoveTodoMutation'
import RenameTodoMutation from '@/mutations/RenameTodoMutation'

export default {
  name: 'todo',
  props: ['relay', 'todo', 'viewer'],
  directives: {
    'todo-focus': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  },
  data () {
    return {
      title: '',
      isEditing: false
    }
  },
  computed: {
    show () {
      switch (this.$route.name) {
        case 'active':
          return this.todo.complete === false
        case 'completed':
          return this.todo.complete === true
        default:
          return true
      }
    }
  },
  methods: {
    edit () {
      this.title = this.todo.title
      this.isEditing = true
    },
    doneEdit () {
      if (!this.isEditing) {
        return
      }
      this.isEditing = false
      if (this.title === '') {
        this.destory()
      } else {
        RenameTodoMutation.commit(
          this.relay.environment,
          this.title,
          this.todo
        )
      }
    },
    cancelEdit () {
      this.isEditing = false
    },
    toggle () {
      ChangeTodoStatusMutation.commit(
        this.relay.environment,
        !this.todo.complete,
        this.todo,
        this.viewer
      )
    },
    destory () {
      RemoveTodoMutation.commit(
        this.relay.environment,
        this.todo,
        this.viewer
      )
    }
  }
}
</script>
