import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Event } from './event.entity';

@Entity('event_invites')
export class EventInvite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.invites, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Event, (event) => event.invites, { onDelete: 'CASCADE' })
  event: Event;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'ACCEPTED', 'DECLINED'],
    default: 'PENDING',
  })
  status: 'PENDING' | 'ACCEPTED' | 'DECLINED';
}
