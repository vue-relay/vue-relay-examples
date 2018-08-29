const fs = require('fs')
const path = require('path')
const { schema } = require('../graphql/schema')
const { printSchema } = require('graphql')

const schemaPath = path.resolve(__dirname, '../graphql/schema.graphql')

fs.writeFileSync(schemaPath, printSchema(schema))

console.log('Wrote ' + schemaPath)
