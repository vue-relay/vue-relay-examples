module.exports = {
  devServer: {
    proxy: {
      '/graphql': {
        target: `http://localhost:${process.env.GRAPHQL_PORT}`
      }
    }
  }
}
