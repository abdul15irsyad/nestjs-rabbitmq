import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: 'LEARN_SERVICE',
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) => {
            return {
              transport: Transport.RMQ,
              options: {
                urls: [configService.get<string>('RABBITMQ_LEARN_URL')],
                queue: configService.get<string>('RABBITMQ_LEARN_QUEUE'),
                queueOptions: {
                  durable: true,
                },
              },
            };
          },
        },
      ],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
