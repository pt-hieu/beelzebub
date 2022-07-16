import type { Model } from '@black/share'
import gql from 'graphql-tag'

export type GetTodoesRes = {
  todoes: Model.Todo[]
}

const TODO_FIELDS = gql`
  fragment TodoFields on TodoModel {
    id
    title
    content
    categorization
    deadline
    created_at
  }
`

export const GET_TODOES = gql`
  ${TODO_FIELDS}
  query GetTodo {
    todoes {
      ...TodoFields
    }
  }
`

export const CREATE_TODO = gql`
  ${TODO_FIELDS}
  mutation CreateTodo($input: CreateTodo!) {
    createTodo(createTodo: $input) {
      ...TodoFields
    }
  }
`

export const UPDATE_TODO = gql`
  ${TODO_FIELDS}
  mutation UpdateTodo($input: UpdateTodo!, $id: String!) {
    updateTodo(updateTodo: $input, id: $id) {
      ...TodoFields
    }
  }
`

export const DELETE_TODO = gql`
  ${TODO_FIELDS}
  mutation DeleteTodo($id: String!) {
    deleteTodo(id: $id) {
      ...TodoFields
    }
  }
`
