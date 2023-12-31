import { PermissionEntity } from '../permissions/permission.entity';
import { PermissionMapper } from '../permissions/permission.mapper';
import { RoleEntity } from '../roles/role.entity';
import { RoleMapper } from '../roles/role.mapper';
import { CreateCompanyRequestDto, UpdatecompanyRequestDto, CompanyResponseDto } from './dtos';
import { CompanyEntity } from './company.entity';

export class CompanyMapper {
  public static async toDto(entity: CompanyEntity): Promise<CompanyResponseDto> {
    const dto = new CompanyResponseDto();
    dto.id = entity.id;
    dto.companyName = entity.companyName;
    dto.companyLogo = entity.companyLogo;
    dto.companyDescription = entity.companyDescription;
    dto.companyServiceDetails = entity.companyServiceDetails;
    dto.companyAddress = entity.companyAddress;
    return dto;
  }

  public static async toDtoWithRelations(entity: CompanyEntity): Promise<CompanyResponseDto> {
    const dto = new CompanyResponseDto();
    dto.id = entity.id;
    dto.companyName = entity.companyName;
    dto.companyLogo = entity.companyLogo;
    dto.companyDescription = entity.companyDescription;
    dto.companyServiceDetails = entity.companyServiceDetails;
    
    // Uncomment the following lines based on your application's structure
    // dto.permissions = await Promise.all((await entity.permissions).map(PermissionMapper.toDto));
    // dto.roles = await Promise.all((await entity.roles).map(RoleMapper.toDtoWithRelations));
    
    dto.companyAddress = entity.companyAddress;
    return dto;
  }

  public static toCreateEntity(dto: CreateCompanyRequestDto): CompanyEntity {
    const entity = new CompanyEntity();
    entity.companyName = dto.companyName;
    entity.companyLogo = dto.companyLogo;
    entity.companyDescription = dto.companyDescription;
    entity.companyServiceDetails = dto.companyServiceDetails;
    entity.companyAddress = dto.companyAddress;
    // entity.permissions = Promise.resolve(dto.permissions.map((id) => new PermissionEntity({ id })));
    return entity;
  }

  public static toUpdateEntity(entity: CompanyEntity, dto: UpdatecompanyRequestDto): CompanyEntity {
    entity.companyName = dto.companyName;
    entity.companyLogo = dto.companyLogo;
    entity.companyDescription = dto.companyDescription;
    entity.companyServiceDetails = dto.companyServiceDetails;
    entity.companyAddress = dto.companyAddress;
    return entity;
  }
}
