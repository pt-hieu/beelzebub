import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule } from './config/config.module'
import { isDev } from './misc/env'
import { TodoModule } from './todo/todo.module'
import { RepoModule } from './repository/repo.module'
import { HttpModule } from './http/http.module.'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { AppController } from './app.controller'
import { AppSubscription } from './app.subscription'

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
    EventEmitterModule.forRoot(),
    ConfigModule,
    HttpModule,
    TodoModule,
    RepoModule,
  ],
  providers: [AppSubscription],
  controllers: [AppController],
})
export class AppModule {}
