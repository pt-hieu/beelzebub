import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModel } from './config.model'
import { ConfigResolver } from './config.resolver'
import { ConfigService } from './config.service'

@Module({
  imports: [TypeOrmModule.forFeature([ConfigModel])],
  providers: [ConfigResolver, ConfigService],
  exports: [ConfigService],
})
export class ConfigModule {}
