import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import cookieParser from 'cookie-parser'
import { join } from 'path'

import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors({
    origin: true,
    credentials: true,
    exposedHeaders: ['access-token', 'x-refresh-vip'],
  })

  app.useStaticAssets(join(__dirname, '..', 'public'), { prefix: '/public/' })

  app.use(cookieParser())

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
    }),
  )

  const swagger = new DocumentBuilder()
    .setTitle('Faktastisch API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, swagger)
  SwaggerModule.setup('api', app, document)

  await app.listen(8080)
}
bootstrap()
