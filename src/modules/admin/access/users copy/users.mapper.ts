import { PermissionEntity } from '../permissions/permission.entity';
import { PermissionMapper } from '../permissions/permission.mapper';
import { RoleEntity } from '../roles/role.entity';
import { RoleMapper } from '../roles/role.mapper';
import { CreateUserRequestDto, UserResponseDto, UpdateUserRequestDto } from './dtos';
import { UserStatus } from './user-status.enum';
import { UserEntity } from './user.entity';

export class RigisterMapper {
  public static async tooDto(entity: UserEntity): Promise<UserResponseDto> {
    const dto = new UserResponseDto();

    dto.id = entity.id;
    dto.username = entity.username;
    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.company = entity.company;
    dto.status = entity.status;
    dto.isSuperUser = entity.isSuperUser;
    dto.approvedBy = entity.approveBy;
    return dto;
  }

  public static async tooDtoWithRelations(entity: UserEntity): Promise<UserResponseDto> {
    const dto = new UserResponseDto();

    dto.id = entity.id;
    dto.username = entity.username;
    dto.firstName = entity.firstName;
    dto.lastName = entity.lastName;
    dto.company = entity.company;
    dto.permissions = await Promise.all((await entity.permissions).map(PermissionMapper.toDto));
    dto.roles = await Promise.all((await entity.roles).map(RoleMapper.toDtoWithRelations));
    dto.isSuperUser = entity.isSuperUser;
    dto.status = entity.status;
    dto.approvedBy = entity.approveBy;
    return dto;
  }

  public static tooCreateEntity(dto: CreateUserRequestDto): UserEntity {
    const entity = new UserEntity();
    entity.username = dto.username;
    entity.firstName = dto.firstName;
    entity.lastName = dto.lastName;
    entity.company = dto.company;
    entity.password = dto.password;
    entity.permissions = Promise.resolve(dto.permissions.map((id) => new PermissionEntity({ id })));
    entity.roles = Promise.resolve(dto.roles.map((id) => new RoleEntity({ id })));
    entity.status = UserStatus.Blocked;
    entity.isSuperUser = false;
    entity.approveBy = dto.approveBy;
    return entity;
  }
  // public static toCreateGuest(dto: CreateUserRequestDto): UserEntity {
  //   const entity = new UserEntity();
  //   entity.username = dto.username;
  //   entity.firstName = dto.firstName;
  //   entity.lastName = dto.lastName;
  //   entity.company = dto.company;
  //   entity.password = dto.password;
  //   // entity.permissions = Promise.resolve(dto.permissions.map((id) => new PermissionEntity({ id })));
  //   // entity.roles = Promise.resolve(dto.roles.map((id) => new RoleEntity({ id })));
  //   entity.status = UserStatus.Inactive;
  //   entity.isSuperUser = false;
  //   entity.approveBy = dto.approveBy;
  //   return entity;
  // }

  public static tooUpdateEntity(entity: UserEntity, dto: UpdateUserRequestDto): UserEntity {
    entity.username = dto.username;
    entity.firstName = dto.firstName;
    entity.lastName = dto.lastName;
    entity.company = dto.company;
    entity.permissions = Promise.resolve(dto.permissions.map((id) => new PermissionEntity({ id })));
    entity.roles = Promise.resolve(dto.roles.map((id) => new RoleEntity({ id })));
    entity.status = dto.status;
    entity.approveBy = dto.approveBy;
    return entity;
  }
}
