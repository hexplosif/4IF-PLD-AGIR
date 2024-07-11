import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GameIoAdapter } from './websocket/game-io.adapter';
import * as compression from 'compression';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //console.log('Should start compression')
  //app.use(compression()); 
  //console.log('Compression started')

  app.useWebSocketAdapter(new GameIoAdapter(app));


  app.enableCors({
    origin: process.env.CORS_ALLOW_ORIGIN,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
