import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Event } from '../entities/event.entity';
import { CreateEventDto } from './createEvent.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventInvite } from '../entities/eventInvite.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(EventInvite)
    private readonly eventInviteRepository: Repository<EventInvite>,
  ) {}

  async createEvent(
    createEventDto: CreateEventDto,
    creator: any,
  ): Promise<Event> {
    const { description, start_time, end_time, invitedUserIds } =
      createEventDto;

    const event = this.eventRepository.create({
      description,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      creator: { id: creator.userId },
    });

    const savedEvent = await this.eventRepository.save(event);

    if (invitedUserIds && invitedUserIds.length > 0) {
      const invites = invitedUserIds.map((userId) => {
        const invite = this.eventInviteRepository.create({
          event: savedEvent,
          user: { id: userId },
          status: 'PENDING',
        });
        return invite;
      });

      await this.eventInviteRepository.save(invites);
    }

    return this.eventRepository.findOne({
      where: { id: savedEvent.id },
      relations: ['creator', 'invites', 'invites.user'],
    });
  }

  async respondInvite(
    userId: string,
    inviteId: string,
    status: 'ACCEPTED' | 'DECLINED',
  ): Promise<{ message: string }> {
    const invite = await this.eventInviteRepository.findOne({
      where: { id: inviteId },
      relations: ['user'],
    });

    if (!invite) throw new ConflictException('Convite não encontrado');

    if (invite.user.id !== userId)
      throw new ConflictException(
        'Você não tem permissão para alterar esse convite.',
      );

    invite.status = status;
    this.eventInviteRepository.save(invite);
    return { message: 'Resposta alterada com sucesso' };
  }

  async getUserEvents(userId: string): Promise<Event[]> {
    return this.eventRepository.find({
      where: { creator: { id: userId } },
      relations: ['invites'],
    });
  }

  async deleteEvent(eventId: string, userId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['creator'],
    });

    if (!event) throw new NotFoundException('Evento não encontrado');

    if (event.creator.id !== userId)
      throw new UnauthorizedException(
        'Você não tem permissão para deletar este evento',
      );

    await this.eventRepository.remove(event)
  }
}
