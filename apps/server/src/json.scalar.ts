import { Kind, print, GraphQLScalarType } from 'graphql'

function identity(value: any) {
  return value
}

function parseObject(typeName, ast, variables) {
  const value = Object.create(null)
  ast.fields.forEach((field) => {
    value[field.name.value] = parseLiteral(typeName, field.value, variables)
  })

  return value
}

function parseLiteral(typeName, ast, variables) {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value)
    case Kind.OBJECT:
      return parseObject(typeName, ast, variables)
    case Kind.LIST:
      return ast.values.map((n) => parseLiteral(typeName, n, variables))
    case Kind.NULL:
      return null
    case Kind.VARIABLE:
      return variables ? variables[ast.name.value] : undefined
    default:
      throw new TypeError(`${typeName} cannot represent value: ${print(ast)}`)
  }
}

export const GraphQLJSON = new GraphQLScalarType({
  name: 'JSON',
  description:
    'The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).',
  serialize: identity,
  parseValue: identity,
  parseLiteral: (ast, variables) => parseLiteral('JSON', ast, variables),
})
