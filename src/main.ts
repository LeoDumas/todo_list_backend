import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5173', // Temporary, authorize requests from vitejs
    methods: 'GET,PUT,POST,DELETE',
    credentials: true,
  });

  // Needed to store the jwt in a httponly, secure, same-site cookie later
  app.use(cookieParser());

  await app.listen(3000);

  // Dev only, display all routes
  const server = app.getHttpServer();
  const router = server._events.request._router;
  const availableRoutes: { path: string; method: string }[] = router.stack
    .map((layer) => {
      if (layer.route) {
        return {
          path: layer.route?.path,
          method: layer.route?.stack[0].method,
        };
      }
    })
    .filter((item) => item !== undefined);

  Logger.log('Available Routes:', availableRoutes);
}
bootstrap();
