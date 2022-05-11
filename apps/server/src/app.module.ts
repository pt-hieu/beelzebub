import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule } from './config/config.module'
import { isDev } from './misc/env'

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
    ConfigModule,
  ],
})
export class AppModule {}
