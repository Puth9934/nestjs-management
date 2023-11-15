import { Module } from '@nestjs/common';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { UsersModule } from './users/users.module';
import { companyModule } from './company/company.module';

@Module({
  imports: [RolesModule, PermissionsModule, UsersModule ,companyModule],
})
export class AccessModule {}
