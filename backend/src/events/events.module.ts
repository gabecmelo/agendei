import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventInvite } from 'src/entities/eventInvite.entity';
import { Event } from 'src/entities/event.entity';
import { User } from 'src/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Event, EventInvite, User])],
  providers: [EventsService],
  controllers: [EventsController]
})
export class EventsModule {}
