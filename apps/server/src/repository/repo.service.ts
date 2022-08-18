import { GitHub } from '@beelzebub/types'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, LessThan, Repository } from 'typeorm'
import { RepoModel } from './repo.model'

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
    return this.repoRepo.find({ order: { outdated: 'desc' } })
  }

  async updateGitHubRepository(
    repo: RepoModel | string,
    data: GitHub.Repository,
  ) {
    if (typeof repo === 'string') {
      repo = await this.getOneById(repo)
    }

    return this.repoRepo.save({
      ...repo,
      name: data.full_name,
      data,
      outdated: false,
      synced_at: new Date(),
    })
  }

  delete(dto: RepoModel) {
    return this.repoRepo.remove(dto)
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
