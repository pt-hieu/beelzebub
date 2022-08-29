import { Injectable } from '@nestjs/common'
import { graphql } from '@octokit/graphql'

import { ConfigService } from '../config/config.service.js'

@Injectable()
export class GitHubGraphService {
  constructor(private configService: ConfigService) {}

  async unarchiveRepository(node_id: string) {
    const token = (await this.configService.get()).github_token

    return graphql(
      `
        mutation UnarchiveRepository($input: UnarchiveRepositoryInput!) {
          unarchiveRepository(input: $input) {
            repository {
              isArchived
            }
          }
        }
      `,
      {
        input: {
          repositoryId: node_id,
        },
        headers: {
          authorization: `token ${token}`,
        },
      },
    )
  }
}
