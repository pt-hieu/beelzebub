import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import 'dotenv/config'
// @ts-ignore
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js'

import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.use(graphqlUploadExpress())
  app.enableCors({
    origin: process.env.FRONT_END_URL.split(','),
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )

  await app.listen(8000)
}

bootstrap()
