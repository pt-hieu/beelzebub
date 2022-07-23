import { OnApplicationBootstrap } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UpdateConfig } from './config.input'
import { ConfigModel } from './config.model'
import { ConfigService } from './config.service'

@Resolver(() => ConfigModel)
export class ConfigResolver implements OnApplicationBootstrap {
  constructor(private configService: ConfigService) {}

  async onApplicationBootstrap() {
    const configs = await this.configService.getMany()
    if (configs.length) return

    await this.configService.save({
      display_name: 'Hieu',
      avatar: '',
    })
  }

  @Query(() => ConfigModel)
  config() {
    return this.configService.get()
  }

  @Mutation(() => ConfigModel)
  async updateConfig(@Args('updateData') dto: UpdateConfig) {
    const config = await this.configService.get()
    return this.configService.save({ ...config, ...dto })
  }
}
