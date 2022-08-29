import { GitHub } from '@beelzebub/types'

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, LessThan, Repository } from 'typeorm'

import { RepoModel } from './repo.model.js'

@Injectable()
export class RepoService {
  constructor(
    @InjectRepository(RepoModel) private repoRepo: Repository<RepoModel>,
  ) {}

  massSave(dtos: Array<Partial<RepoModel>>) {
    return this.repoRepo.save(dtos)
  }

  massDelete(dtos: Array<RepoModel>) {
    return this.repoRepo.remove(dtos)
  }

  getMany() {
    return this.repoRepo.find({ order: { name: 'asc', outdated: 'desc' } })
  }

  isExistedByName(name: string) {
    return this.repoRepo.findBy({ name }).then((r) => !!r.length)
  }

  updateGitHubRepository(
    repoId: string,
    data: GitHub.Repository,
  ): Promise<RepoModel>
  updateGitHubRepository(
    repo: RepoModel,
    data: GitHub.Repository,
  ): Promise<RepoModel>
  async updateGitHubRepository(
    repoData: RepoModel | string,
    data: GitHub.Repository,
  ) {
    if (typeof repoData === 'string') {
      repoData = await this.getOneById(repoData)
    }

    return this.repoRepo.save({
      ...repoData,
      name: data.full_name,
      data,
      outdated: false,
      synced_at: new Date(),
    })
  }

  async createGithubRepository(data: GitHub.Repository) {
    return this.repoRepo.save({
      name: data.full_name,
      data,
      outdated: false,
      synced_at: new Date(),
    })
  }

  delete(dto: RepoModel) {
    return this.repoRepo.remove(dto).then((r) => ({ ...r, id: dto.id }))
  }

  getOutdated(syncDate?: Date) {
    return this.repoRepo.find({
      where: {
        ...(syncDate && { synced_at: LessThan(syncDate) }),
        ...(!syncDate && { outdated: true }),
      },
    })
  }

  getOneById(id: string) {
    return this.repoRepo.findOne({ where: { id } })
  }

  async upsertOnName(dtos: Array<Partial<RepoModel>>) {
    await this.repoRepo.upsert(dtos, {
      conflictPaths: ['name'],
      skipUpdateIfNoValuesChanged: true,
    })

    return this.repoRepo.find({
      where: {
        name: In(dtos.map((dto) => dto.name)),
      },
    })
  }
}
