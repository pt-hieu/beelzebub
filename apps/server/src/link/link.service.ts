import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'

import { LinkModel } from './link.model.js'

type LinkModelWithoutMethod = Omit<LinkModel, 'generateId'>
type CreateInput = (Pick<LinkModel, 'url'> &
  Partial<Pick<LinkModel, 'alias'>>)[]

@Injectable()
export class LinkService {
  constructor(
    @InjectRepository(LinkModel) private linkRepo: Repository<LinkModel>,
  ) {}

  getAll(): Promise<LinkModel[]>
  getAll(urls: string[]): Promise<LinkModel[]>
  getAll(url: string): Promise<LinkModel[]>
  getAll(url?: string | string[]) {
    return this.linkRepo.find({
      where: {
        ...(url && !Array.isArray(url) && { url }),
        ...(url && Array.isArray(url) && { url: In(url) }),
      },
      order: { tag: 'asc' },
    })
  }

  getOne(id: string) {
    return this.linkRepo.findOne({ where: { id } })
  }

  getByAlias(alias: string) {
    return this.linkRepo.findOne({ where: { alias } })
  }

  create(data: CreateInput): Promise<(CreateInput & LinkModel)[]>
  create(
    url: string,
    alias?: string,
  ): Promise<
    {
      alias: string
      url: string
    } & LinkModel
  >
  create(url: string | CreateInput, alias?: string) {
    if (Array.isArray(url)) {
      return this.linkRepo.save(url)
    }

    if (typeof url === 'string') {
      return this.linkRepo.save({ alias, url })
    }
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
