import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventInvite } from 'src/entities/eventInvite.entity';
import { Event } from 'src/entities/event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventInvite])],
  providers: [EventsService],
  controllers: [EventsController]
})
export class EventsModule {}
