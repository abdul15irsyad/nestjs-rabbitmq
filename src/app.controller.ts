import { Controller, Inject, Logger, Post } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  private logger: Logger;
  constructor(
    @Inject('LEARN_SERVICE') private learnRabbitMQService: ClientProxy,
  ) {
    this.logger = new Logger(AppController.name);
  }

  @Post('insert-to-queue')
  async insertToQueue() {
    for (const item of 'ABCDEFGHIJ'.split('')) {
      this.learnRabbitMQService.emit('insert_to_queue', {
        message: `test payload ${item}`,
      });
      this.logger.log(`emitted ${item}`);
    }
    return {
      message: 'insert to queue',
    };
  }

  @EventPattern('insert_to_queue')
  async handleInsertToQueue(
    @Payload() payload: any,
    @Ctx() context: RmqContext,
  ) {
    this.logger.log('handleInsertToQueue start');
    const channel = context.getChannelRef();
    const originalMessage = context.getMessage();
    await new Promise((resolve) => setTimeout(() => resolve(true), 3000));
    this.logger.log({ payload });
    channel.ack(originalMessage);
    this.logger.log('handleInsertToQueue done');
  }
}
