import type { Model } from '@beelzebub/types'
import gql from 'graphql-tag'

export type GetLinksRes = {
  links: Model.Link[]
}

const LINK_FIELDS = gql`
  fragment LinkFields on LinkModel {
    id
    url
    alias
    title
    image
    description
    scrapeStatus
    __typename
  }
`

export const GET_LINKS = gql`
  ${LINK_FIELDS}
  query GetLinks {
    links {
      ...LinkFields
    }
  }
`

export const CREATE_LINK = gql`
  ${LINK_FIELDS}
  mutation CreateLink($dto: CreateLinkDto!) {
    createLink(dto: $dto) {
      ...LinkFields
    }
  }
`

export const UPDATE_LINK = gql`
  ${LINK_FIELDS}
  mutation UpdateLink($id: String!, $dto: UpdateLinkDto!) {
    updateLink(id: $id, dto: $dto) {
      ...LinkFields
    }
  }
`

export const DELETE_LINK = gql`
  ${LINK_FIELDS}
  mutation DeleteLink($id: String!) {
    deleteLink(id: $id) {
      ...LinkFields
    }
  }
`

export const IMPORT_LINK = gql`
  ${LINK_FIELDS}
  mutation ImportLink($source: String!, $file: Upload!) {
    importLinks(source: $source, dto: { file: $file }) {
      ...LinkFields
    }
  }
`
