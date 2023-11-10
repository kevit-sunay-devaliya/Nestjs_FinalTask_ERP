import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT);
  Logger.log('Server running on PORT: ', process.env.PORT);
  // console.log('server running on port: ', process.env.PORT);
}
bootstrap();
