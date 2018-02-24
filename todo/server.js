import express from 'express'
import graphQLHTTP from 'express-graphql'
import { spawn } from 'child_process'

import { schema } from './data/schema'
import config from './config'
import portfinder from 'portfinder'

delete process.env.BABEL_ENV

const PORT = process.env.PORT && Number(process.env.PORT)

portfinder.basePort = (PORT || config.dev.port)
portfinder.getPort((err, APP_PORT) => {
  if (err) {
    reject(err)
  } else {
    const app = express()
    app.use('/graphql', graphQLHTTP({
      schema,
      graphiql: process.env.NODE_ENV !== 'production',
      pretty: true
    }))

    if (process.env.NODE_ENV !== 'production') {
      portfinder.basePort = APP_PORT + 1
      portfinder.getPort((err, GRAPHQL_PORT) => {
        if (err) {
          reject(err)
        } else {
          app.listen(GRAPHQL_PORT, () => {
            console.log(`GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}/graphql`)

            process.env.GRAPHQL_PORT = GRAPHQL_PORT

            spawn('webpack-dev-server', ['--inline', '--progress', '--config', 'build/webpack.dev.conf.js'], {
              stdio: 'inherit'
            })
          })
        }
      })
    } else {
      app.use(express.static('dist'))
      app.listen(APP_PORT, () => {
        console.log(`Your application is running here: http://localhost:${APP_PORT}`)
      })
    }
  }
})
