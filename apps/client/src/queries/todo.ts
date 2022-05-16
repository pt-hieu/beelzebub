import type { Model } from '@black/share'
import gql from 'graphql-tag'

export type GetTodoesRes = {
  todoes: Model.Todo[]
}

export const GET_TODOES = gql`
  query GetTodo {
    todoes {
      id
      title
      content
      categorization
      deadline
      created_at
    }
  }
`

export const CREATE_TODO = gql`
  mutation CreateTodo($input: CreateTodo!) {
    createTodo(createTodo: $input) {
      id
      created_at
      title
      content
      categorization
      deadline
    }
  }
`
