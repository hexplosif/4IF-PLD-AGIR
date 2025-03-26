import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GameIoAdapter } from './websocket/game-io.adapter';
import * as compression from 'compression';
import { I18nService } from 'nestjs-i18n';
import { GlobalExceptionFilter } from './exceptions/globalExceptionFilter';
import { ExceptionTranslationFilter } from './exceptions/exceptionTranslationFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const i18nService = app.get(I18nService<Record<string, unknown>>);

  //console.log('Should start compression')
  //app.use(compression()); 
  //console.log('Compression started')

  app.useWebSocketAdapter(new GameIoAdapter(app));
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalFilters(new ExceptionTranslationFilter(i18nService));


  app.enableCors({
    origin: process.env.CORS_ALLOW_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
