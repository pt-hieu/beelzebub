import type { Model } from '@beelzebub/types'
import gql from 'graphql-tag'

export type GetRepoesRes = {
  repoes: Model.Repo[]
}

const GETMANY_REPO_FIELDS = gql`
  fragment RepoFields on RepoModel {
    id
    name
  }
`

const GETONE_REPO_FIELDS = gql`
  fragment GetOneRepoFields on RepoModel {
    id
    name
    data
    outdated
    collabs
    path
    synced_at
  }
`

export const GET_REPOES = gql`
  ${GETMANY_REPO_FIELDS}
  query GetManyRepoes {
    repoes {
      ...RepoFields
    }
  }
`

export const GET_REPO = gql`
  ${GETONE_REPO_FIELDS}
  query GetOneRepoes($id: String!) {
    repo(id: $id) {
      ...GetOneRepoFields
    }
  }
`

export const SYNC_REPO = gql`
  ${GETMANY_REPO_FIELDS}
  mutation SyncRepo {
    syncRepo {
      ...RepoFields
    }
  }
`

export const PURGE_OUTDATED_REPOES = gql`
  ${GETMANY_REPO_FIELDS}
  mutation PurgeOutdatedRepoes {
    purgeOutdatedRepos {
      ...RepoFields
    }
  }
`

export const FETCH_COLLABS = gql`
  ${GETONE_REPO_FIELDS}
  mutation FetchCollaborators($id: String!) {
    fetchCollaborators(id: $id) {
      ...GetOneRepoFields
    }
  }
`

export const UDPATE_REPO = gql`
  ${GETONE_REPO_FIELDS}
  mutation UpdateRepo($id: String!, $dto: UpdateRepositoryDto!) {
    updateRepo(id: $id, dto: $dto) {
      ...GetOneRepoFields
    }
  }
`

export const CREATE_REPO = gql`
  ${GETONE_REPO_FIELDS}
  mutation CreateRepo($dto: CreateRepositoryDto!) {
    createRepo(dto: $dto) {
      ...GetOneRepoFields
    }
  }
`
