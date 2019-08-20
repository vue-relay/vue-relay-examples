import {
  Environment,
  Network,
  RecordSource,
  Store
} from 'relay-runtime'
import { graphql } from 'graphql'
import { schema } from '../../data/schema/index'

const environment = new Environment({
  network: Network.create(function (operation, variables, cacheConfig, uploadables) {
    return graphql({
      schema,
      source: operation.text,
      variableValues: variables
    })
  }),
  store: new Store(new RecordSource())
})

export {
  environment
}

export default {
  environment
}
