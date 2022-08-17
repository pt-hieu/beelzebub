import type { Model } from '@beelzebub/types'
import gql from 'graphql-tag'

export type GetRepoesRes = {
  repoes: Model.Repo[]
}

const GETMANY_REPO_FIELDS = gql`
  fragment RepoFields on RepoModel {
    id
    name
    outdated
  }
`

const GETONE_REPO_FIELDS = gql`
  fragment GetOneRepoFields on RepoModel {
    id
    name
    data
    outdated
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
