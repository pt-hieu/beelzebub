module.exports = {
  client: {
    service: {
      name: 'server',
      // url: 'http://localhost:8000/graphql',
      localSchemaFile: require('path').resolve(
        __dirname,
        '/black/apps/server/schema.gql',
      ),
    },
    includes: ['**/*.vue', './src/queries/**/*.ts'],
  },
}
