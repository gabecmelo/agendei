import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Event } from '../entities/event.entity';
import { CreateEventDto } from './createEvent.dto';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { EventInvite } from '../entities/eventInvite.entity';
import { User } from 'src/entities/user.entity';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @InjectRepository(EventInvite)
    private readonly eventInviteRepository: Repository<EventInvite>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createEvent(
    createEventDto: CreateEventDto,
    creator: any,
  ): Promise<Event> {
    const { description, start_time, end_time, invitedUsersEmails } =
      createEventDto;

    // Criar o evento com o criador associado
    const event = this.eventRepository.create({
      description,
      start_time: new Date(start_time),
      end_time: new Date(end_time),
      creator: { id: creator.userId },
    });

    const savedEvent = await this.eventRepository.save(event);

    // Processar convites, se houver
    if (invitedUsersEmails && invitedUsersEmails.length > 0) {
      // Buscar usuários convidados pelo e-mail
      const users = await this.userRepository.findBy({
        email: In(invitedUsersEmails),
      });

      const invites = users.map((user) =>
        this.eventInviteRepository.create({
          event: savedEvent,
          user,
          status: 'PENDING',
        }),
      );

      // Salvar convites
      await this.eventInviteRepository.save(invites);
    }

    // Retornar o evento completo com relações carregadas
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

  async getUserEvents(
    userId: string,
    invited?: string,
  ): Promise<Event[] | EventInvite[]> {
    if (invited) {
      return this.eventInviteRepository.find({
        where: { user: { id: userId } },
        relations: ['user', 'event'],
      });
    }
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

    await this.eventRepository.remove(event);
    return {message: 'Evento deletado com sucesso'}
  }
  
}
