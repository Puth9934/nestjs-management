import { Module } from '@nestjs/common';
import { AccessModule } from './access/access.module';
import { RigisterModule } from './access/UserRegister/users.module'

@Module({
  imports: [AccessModule,RigisterModule],
})
export class AdminModule {}
