import { Module } from '@nestjs/common';
import { RigisterService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RigisterController } from './users.controller';
import { RigisterRepository } from './users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RigisterRepository])],
  controllers: [RigisterController],
  providers: [RigisterService],
})
export class RigisterModule {}
