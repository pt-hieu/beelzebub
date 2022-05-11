import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModel } from './config.model';
import { ConfigResolver } from './config.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([ConfigModel])],
  providers: [ConfigResolver],
})
export class ConfigModule {}
