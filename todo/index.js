const express = require('express')
const graphQLHTTP = require('express-graphql')
const { spawn } = require('child_process')

const { schema } = require('./data/schema')

new Promise((resolve, reject) => {
  const portfinder = require('portfinder')

  portfinder.basePort = Number(process.env.PORT || (function () {
    try {
      return require('./vue.config').devServer.port
    } catch (_) {}
  })() || 8080)

  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      if (process.env.NODE_ENV === 'production') {
        resolve(port)
        return
      }

      portfinder.basePort = port + 1
      portfinder.getPort((err, port) => {
        if (err) {
          reject(err)
        } else {
          resolve(port)
        }
      })
    }
  })
})
  .then(port => {
    const url = `http://localhost:${port}`

    const app = express()

    app.use('/graphql', graphQLHTTP({
      schema,
      graphiql: process.env.NODE_ENV !== 'production',
      pretty: true
    }))

    app.use(express.static('dist'))

    app.listen(port, () => {
      if (process.env.NODE_ENV === 'production') {
        console.log(`Your application is running here: ${url}`)
      } else {
        console.log(`GraphQL Server is now running on ${url}/graphql`)

        process.env.GRAPHQL_PORT = port

        spawn('vue-cli-service', ['serve'], { stdio: 'inherit' })
      }
    })
  })
