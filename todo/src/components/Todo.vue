<template>
  <li :class="{ completed: todo.complete, editing: isEditing }" v-if="show">
    <div class="view">
      <input type="checkbox" class="toggle" :checked="todo.complete" @change="toggle">
      <label @dblclick="edit">{{ todo.text }}</label>
      <button class="destroy" @click="destory"></button>
    </div>
    <input class="edit" type="text"
      v-todo-focus="isEditing"
      v-model="text"
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
  props: ['relay', 'todo', 'user'],
  directives: {
    'todo-focus': function (el, binding) {
      if (binding.value) {
        el.focus()
      }
    }
  },
  data () {
    return {
      text: '',
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
      this.text = this.todo.text
      this.isEditing = true
    },
    doneEdit () {
      if (!this.isEditing) {
        return
      }
      this.isEditing = false
      if (this.text === '') {
        this.destory()
      } else {
        RenameTodoMutation.commit(
          this.relay.environment,
          this.text,
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
        this.user
      )
    },
    destory () {
      RemoveTodoMutation.commit(
        this.relay.environment,
        this.todo,
        this.user
      )
    }
  }
}
</script>
