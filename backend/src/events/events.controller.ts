import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateEventDto } from './createEvent.dto';
import { EventsService } from './events.service';
import { RespondInviteDto } from './respondInvite.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))  
  async createEvent(@Body() createEventDto: CreateEventDto, @Req() req) {
    console.log(createEventDto.invitedUsersEmails)
    return this.eventsService.createEvent(createEventDto, req.user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getEvents(@Query('invited') invited: string, @Req() req) {
    return this.eventsService.getUserEvents(req.user.userId, invited);
  }

  @Patch('/invite/respond')
  @UseGuards(AuthGuard('jwt'))
  async respondInvite(@Body() respondInviteDto: RespondInviteDto, @Req() req) {
    const userId = req.user.userId;

    if (!userId) {
      throw new UnauthorizedException('Usuário não autenticado');
    }

    return this.eventsService.respondInvite(
      userId,
      respondInviteDto.inviteId,
      respondInviteDto.status,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async deleteEvent(@Param('id') eventId: string, @Req() req) {
    const userId = req.user.userId;

    return this.eventsService.deleteEvent(eventId, userId);
  }
}
