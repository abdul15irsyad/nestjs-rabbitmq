import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [configService.get<string>('RABBITMQ_LEARN_URL')],
      queue: configService.get<string>('RABBITMQ_LEARN_QUEUE'),
      queueOptions: {
        durable: true,
      },
      prefetchCount: 1,
      noAck: false,
    },
  });

  await app.startAllMicroservices();
  await app.listen(configService.get<number>('APP_PORT') ?? 5000);
}
bootstrap();
