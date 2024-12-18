import { IsEnum, IsUUID } from 'class-validator';

export class RespondInviteDto {
  @IsUUID()
  inviteId: string;

  @IsEnum(['ACCEPTED', 'DECLINED'])
  status: 'ACCEPTED' | 'DECLINED';
}
