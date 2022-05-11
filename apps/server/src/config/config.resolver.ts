import { OnApplicationBootstrap } from '@nestjs/common'
import { Query, Resolver } from '@nestjs/graphql'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ConfigModel } from './config.model'

@Resolver(() => ConfigModel)
export class ConfigResolver implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(ConfigModel)
    private readonly repo: Repository<ConfigModel>,
  ) {}

  async onApplicationBootstrap() {
    const config = await this.repo.find()
    if (config.length) return

    await this.repo.save({
      display_name: 'Hieu',
      avatar: '',
    })
  }

  @Query(() => ConfigModel)
  config() {
    return this.repo.findOne({ where: { unique: true } })
  }
}
