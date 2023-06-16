import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma/prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors();
  app.setGlobalPrefix('api/v1');
  const config = new DocumentBuilder()
    .setTitle('KuluCash API')
    .setDescription('The kulucash API description')
    .setVersion('1.0')
    .addTag('kulucash')
    .addBearerAuth()
    .addServer('http://130.61.105.134:3000')
    .addServer('http://localhost:3005')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  await app.listen(3000);
}
bootstrap();
