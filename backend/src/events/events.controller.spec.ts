import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { CreateEventDto } from './createEvent.dto';
import { RespondInviteDto } from './respondInvite.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('EventsController', () => {
  let eventsController: EventsController;
  let eventsService: EventsService;

  const mockEventsService = {
    createEvent: jest.fn(),
    getUserEvents: jest.fn(),
    respondInvite: jest.fn(),
    deleteEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService,
        },
      ],
    }).compile();

    eventsController = module.get<EventsController>(EventsController);
    eventsService = module.get<EventsService>(EventsService);

    jest.clearAllMocks();
  });

  it('deve ser definido', () => {
    expect(eventsController).toBeDefined();
  });

  describe('createEvent', () => {
    it('deve criar um evento', async () => {
      const mockUser = {
        id: '1',
        name: 'Gabriel',
        email: 'gabriel@example.com',
        password: 'senha123',
        invites: [],
        created_events: [],
      };
  
      const createEventDto: CreateEventDto = {
        description: 'Evento Teste',
        start_time: new Date('2024-12-20T10:00:00Z'),
        end_time: new Date('2024-12-20T12:00:00Z'),
        invitedUserIds: ['2', '3'],
      };
  
      const mockEvent = {
        id: '1',
        ...createEventDto,
        creator: mockUser, 
        invites: [],
      };
  
      jest.spyOn(eventsService, 'createEvent').mockResolvedValue(mockEvent);

      const result = await eventsController.createEvent(createEventDto, { user: mockUser });

      expect(result).toEqual(mockEvent);
      expect(eventsService.createEvent).toHaveBeenCalledWith(
        createEventDto,
        mockUser,
      );
    });
  });

  describe('getEvents', () => {
    it('deve retornar eventos do usuário', async () => {
      const mockUser = {
        id: '1',
        name: 'Gabriel',
        email: 'gabriel@example.com',
        password: 'senha123',
        invites: [],
        created_events: [],
      };
  
      const mockEvents = [
        {
          id: '1',
          description: 'Evento 1',
          start_time: new Date('2024-12-20T10:00:00Z'),
          end_time: new Date('2024-12-20T12:00:00Z'),
          creator: mockUser,
          invites: [],
        },
      ];
  
      jest.spyOn(eventsService, 'getUserEvents').mockResolvedValue(mockEvents);

      const result = await eventsController.getEvents({ user: mockUser });

      expect(result).toEqual(mockEvents);
      expect(eventsService.getUserEvents).toHaveBeenCalledWith(mockUser.id);
    });
  });

  describe('respondInvite', () => {
    it('deve responder um convite', async () => {
      const mockUser = { userId: '1', name: 'Gabriel' };
      const respondInviteDto: RespondInviteDto = {
        inviteId: '123',
        status: 'ACCEPTED',
      };

      const mockResponse = { message: 'Resposta alterada com sucesso' };

      jest.spyOn(eventsService, 'respondInvite').mockResolvedValue(mockResponse);

      const result = await eventsController.respondInvite(respondInviteDto, { user: mockUser });

      expect(result).toEqual(mockResponse);
      expect(eventsService.respondInvite).toHaveBeenCalledWith(
        mockUser.userId,
        respondInviteDto.inviteId,
        respondInviteDto.status,
      );
    });

    it('deve lançar UnauthorizedException para usuários não autenticados', async () => {
      const respondInviteDto: RespondInviteDto = {
        inviteId: '123',
        status: 'ACCEPTED',
      };

      await expect(
        eventsController.respondInvite(respondInviteDto, { user: { userId: null } }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('deleteEvent', () => {
    it('deve excluir um evento se o usuário for o criador', async () => {
      const mockUser = { userId: '1', name: 'Gabriel' };
      const mockEvent = { id: '1', creator: mockUser, description: 'Evento Teste' };
  
      jest.spyOn(eventsService, 'deleteEvent').mockResolvedValue();
  
      const result = await eventsController.deleteEvent('1', { user: mockUser });
  
      expect(result).toBeUndefined(); 
      expect(eventsService.deleteEvent).toHaveBeenCalledWith('1', mockUser.userId);
    });
  
    it('deve lançar UnauthorizedException se o usuário não for o criador do evento', async () => {
      const mockUser = { userId: '2', name: 'João' };
      const mockEvent = { id: '1', creator: { id: '1', name: 'Gabriel' }, description: 'Evento Teste' };
  
      jest.spyOn(eventsService, 'deleteEvent').mockRejectedValue(new UnauthorizedException());
  
      await expect(
        eventsController.deleteEvent('1', { user: mockUser })
      ).rejects.toThrow(UnauthorizedException);
    });
  
    it('deve lançar NotFoundException se o evento não existir', async () => {
      const mockUser = { userId: '1', name: 'Gabriel' };
  
      jest.spyOn(eventsService, 'deleteEvent').mockRejectedValue(new NotFoundException());
  
      await expect(
        eventsController.deleteEvent('id-nao-existente', { user: mockUser })
      ).rejects.toThrow(NotFoundException);
    });
  });
});
