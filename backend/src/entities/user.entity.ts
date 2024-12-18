import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { EventInvite } from './eventInvite.entity';
import { Event } from './event.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Event, (event) => event.creator)
  created_events: Event[];

  @OneToMany(() => EventInvite, (invite) => invite.user)
  invites: EventInvite[];
}
