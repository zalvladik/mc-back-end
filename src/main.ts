import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import type { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import cookieParser from 'cookie-parser'
import { join } from 'path'

import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const config = app.get(ConfigService)

  app.enableCors({
    origin: [
      config.get('CLIENT_URL'),
      'http://localhost:3001',
      'http://localhost:25565',
    ],
    credentials: true,
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
