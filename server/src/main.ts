import {
  DocumentBuilder,
  SwaggerCustomOptions,
  SwaggerModule
} from '@nestjs/swagger'
import { Logger, ValidationPipe } from '@nestjs/common'
import { HttpAdapterHost, NestFactory } from '@nestjs/core'

import { AppModule } from '@/module/app/app.module'
import { AllExceptionsFilter } from '@/filter/all-exception.filter'

async function bootstrap() {
  const logger = new Logger('Main')

  const app = await NestFactory.create(AppModule)

  const { httpAdapter } = app.get(HttpAdapterHost)

  // Set VAldation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true
      }
    })
  )

  // Set Exception Filter
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter))

  // Enable CORS
  app.enableCors()

  // Create Swagger Document
  const documentConfig = new DocumentBuilder()
    .setTitle('Anonymous Post Server')
    .addBasicAuth({
      type: 'apiKey',
      name: 'Authorization',
      in: 'header',
      bearerFormat: ''
    })
    .addTag('Post', '게시글')
    .build()

  // Create Swagger Options
  const documentOptions: SwaggerCustomOptions = {
    swaggerOptions: {
      docExpansion: 'none',
      persistAuthorization: true,
      tagsSorter: 'alpha'
    },
    customSiteTitle: 'Anonymous Post Server Docs'
  }

  // Set Swagger
  const document = SwaggerModule.createDocument(app, documentConfig)
  SwaggerModule.setup('docs', app, document, documentOptions)

  const port = 3000

  await app.listen(port)

  logger.log(`Server Running in ${port} Port`)
}

bootstrap()
