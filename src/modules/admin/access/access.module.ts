import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { UsersModule } from './users/users.module';
import { companyModule } from './company/company.module';
import { RigisterModule } from './UserRegister/users.module'
// import { TodosModule } from '../../../test/test.module';

@Module({
  imports: [RolesModule, PermissionsModule, UsersModule ,companyModule,RigisterModule],
})
export class AccessModule {}
