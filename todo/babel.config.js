process.env.VUE_CLI_BABEL_TRANSPILE_MODULES = 'true'

module.exports = {
  presets: [
    ['@vue/app', {
      polyfills: [
        'es6.array.iterator',
        'es6.promise'
      ]
    }]
  ],
  plugins: [
    'relay'
  ]
}
