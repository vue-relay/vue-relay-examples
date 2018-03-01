<template>
  <div id="app">
    <query-renderer :environment="environment" :query="AppQuery">
      <template slot-scope="{ props, error, retry }">
        <section class="info" v-if="error">
          <h1>{{ error.message }}</h1>
          <p><router-link :to="$route.path" @click.native="retry()">Retry</router-link></p>
        </section>
        <todos-container v-bind="props" v-else-if="props"></todos-container>
        <section class="info" v-else>
          <h1>loading...</h1>
        </section>
      </template>
    </query-renderer>
    <footer class="info">
      <p>
        Double-click to edit a todo
      </p>
      <p>
        Created by the <a href="https://github.com/ntkme">
          @ntkme
        </a>
      </p>
      <p>
        Part of <a href="http://todomvc.com">TodoMVC</a>
      </p>
    </footer>
  </div>
</template>

<script>
import { QueryRenderer, createFragmentContainer } from 'vue-relay'
import { environment } from '@/relay'
import AppQuery from '@/relay/App'
import Todos from '@/components/Todos'
import TodosFragmentSpec from '@/relay/Todos'

export default {
  name: 'App',
  components: {
    QueryRenderer,
    TodosContainer: createFragmentContainer(Todos, TodosFragmentSpec)
  },
  data () {
    return {
      environment,
      AppQuery
    }
  }
}
</script>
