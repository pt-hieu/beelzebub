import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigModel } from './config.model.js'

@Injectable()
export class ConfigService {
  constructor(
    @InjectRepository(ConfigModel)
    private readonly repo: Repository<ConfigModel>,
  ) {}

  get() {
    return this.repo.findOne({ where: { unique: true } })
  }

  getMany() {
    return this.repo.find()
  }

  save(dto: Partial<ConfigModel>) {
    return this.repo.save(dto)
  }
}
