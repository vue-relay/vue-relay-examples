import {
  Environment,
  Network,
  RecordSource,
  Store
} from 'relay-runtime'
import 'whatwg-fetch'

const environment = new Environment({
  network: Network.create(function (operation, variables, cacheConfig, uploadables) {
    return fetch('/graphql', {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        query: operation.text,
        variables
      })
    }).then(response => {
      return response.json()
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
