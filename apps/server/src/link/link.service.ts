import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeepPartial, Repository } from 'typeorm'

import { LinkModel } from './link.model.js'

type LinkModelWithoutMethod = Omit<LinkModel, 'generateId'>

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(LinkModel) private linkRepo: Repository<LinkModel>,
  ) {}

  getAll(): Promise<LinkModel[]>
  getAll(url: string): Promise<LinkModel[]>
  getAll(url?: string) {
    return this.linkRepo.find({
      where: {
        ...(url && { url }),
      },
      order: { created_at: 'desc' },
    })
  }

  getOne(id: string) {
    return this.linkRepo.findOne({ where: { id } })
  }

  getByAlias(alias: string) {
    return this.linkRepo.findOne({ where: { alias } })
  }

  create(url: string, alias?: string) {
    return this.linkRepo.save({ alias, url })
  }

  update(datas: LinkModelWithoutMethod[]): Promise<LinkModel[]>
  update(data: LinkModelWithoutMethod): Promise<LinkModel>
  update(data: LinkModelWithoutMethod | LinkModelWithoutMethod[]) {
    if (Array.isArray(data)) {
      return this.linkRepo.save(data)
    }

    if (!Array.isArray(data)) {
      return this.linkRepo.save(data)
    }
  }

  del(data: LinkModelWithoutMethod) {
    return this.linkRepo.remove(data as unknown as LinkModel)
  }
}
