import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'

import { ConfigModule } from './config/config.module.js'
import { HttpModule } from './http/http.module.js'
import { LinkModule } from './link/link.module.js'
import { isDev } from './misc/env.js'
import { RepoModule } from './repository/repo.module.js'
import { SseModule } from './sse/sse.module.js'
import { TodoModule } from './todo/todo.module.js'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: `schema.gql`,
      debug: isDev(),
      playground: isDev(),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [],
      synchronize: isDev(),
      autoLoadEntities: true,
      logging: ['error', 'migration', 'schema'],
    }),
    EventEmitterModule.forRoot({
      global: true,
    }),
    ConfigModule,
    HttpModule,
    TodoModule,
    RepoModule,
    LinkModule,
    SseModule,
  ],
})
export class AppModule {}
