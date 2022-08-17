module.exports = {
  client: {
    service: {
      name: 'server',
      // url: 'http://localhost:8000/graphql',
      localSchemaFile: require('path').resolve(
        __dirname,
        '/beelzebub/apps/server/schema.gql',
      ),
    },
    includes: ['**/*.vue', './src/queries/**/*.ts'],
  },
}
