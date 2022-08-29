import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigModel } from './config.model.js'
import { ConfigResolver } from './config.resolver.js'
import { ConfigService } from './config.service.js'

@Module({
  imports: [TypeOrmModule.forFeature([ConfigModel])],
  providers: [ConfigResolver, ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
