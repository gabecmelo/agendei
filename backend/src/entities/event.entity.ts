import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { EventInvite } from './eventInvite.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column({ type: 'datetime'})
  start_time: Date;

  @Column({ type: 'datetime'})
  end_time: Date;

  @ManyToOne(() => User, (user) => user.created_events, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'creator_id' })
  creator: User;

  @OneToMany(() => EventInvite, (invite) => invite.event)
  invites: EventInvite[];
}
