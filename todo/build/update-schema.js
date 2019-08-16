const fs = require('fs')
const path = require('path')
const { schema } = require('../data/schema')
const { printSchema } = require('graphql')

const schemaPath = path.resolve(__dirname, '../data/schema.graphql')

fs.writeFileSync(schemaPath, printSchema(schema))

console.log('Wrote ' + schemaPath)
