import { promises } from 'fs';
import { PermissionEntity } from '../permissions/permission.entity';
import { PermissionMapper } from '../permissions/permission.mapper';
import { CompanyEntity } from '../company/company.entity';
import { RoleEntity } from '../roles/role.entity';
import { RoleMapper } from '../roles/role.mapper';
import { CreateUserRequestDto, UserResponseDto, UpdateUserRequestDto } from './dtos';
import { UserStatus, approveBy } from './user-status.enum';
import { UserEntity } from './user.entity';
import { CompanyMapper } from '../company/company.mapper';

export class UserMapper {
  public static async toDto(entity: UserEntity): Promise<UserResponseDto> {
    const dto = new UserResponseDto();

    dto.id = entity.id;
    dto.username = entity.username;
    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.companyId = entity.companyId;
    dto.status = entity.status;
    dto.isSuperUser = entity.isSuperUser;
    dto.approvedBy = entity.approveBy;
    dto.parentId = entity.parentId;
    return dto;
  }

  public static async toDtoWithRelations(entity: UserEntity): Promise<UserResponseDto> {
    const dto = new UserResponseDto();

    dto.id = entity.id;
    dto.username = entity.username;
    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.companyId = entity.companyId;
    dto.permissions = await Promise.all((await entity.permissions).map(PermissionMapper.toDto));
    dto.roles = await Promise.all((await entity.roles).map(RoleMapper.toDtoWithRelations));
    dto.isSuperUser = entity.isSuperUser;
    dto.status = entity.status;
    dto.approvedBy = entity.approveBy;
    dto.parentId = entity.parentId;
    return dto;
  }

  public static toCreateEntity(dto: CreateUserRequestDto): UserEntity {
    const entity = new UserEntity();
    entity.username = dto.username;
    entity.firstName = dto.firstName;
    entity.lastName = dto.lastName;
    // entity.companyId = dto.companyId;
    entity.password = dto.password; 
    entity.companyId = dto.companyId;
    entity.permissions = Promise.resolve(dto.permissions.map((id) => new PermissionEntity({ id })));
    entity.roles = Promise.resolve(dto.roles.map((id) => new RoleEntity({ id })));
    entity.status = UserStatus.Inactive;
    entity.isSuperUser = false;
    entity.approveBy = approveBy.Null;
    entity.parentId =dto.parentId;
    return entity;
  }

  public static toUpdateEntity(entity: UserEntity, dto: UpdateUserRequestDto): UserEntity {
    entity.username = dto.username;
    entity.firstName = dto.firstName;
    entity.lastName = dto.lastName;
    entity.companyId = dto.companyId;
    entity.permissions = Promise.resolve(dto.permissions.map((id) => new PermissionEntity({ id })));
    entity.roles = Promise.resolve(dto.roles.map((id) => new RoleEntity({ id })));
    entity.status = dto.status;
    entity.approveBy = dto.approveBy;
    entity.parentId = dto.parentId;
    return entity;
  }
}
