import { InternalServerErrorException, RequestTimeoutException, NotFoundException, Injectable } from '@nestjs/common';
import { CreateCompanyRequestDto, UpdatecompanyRequestDto, CompanyResponseDto } from './dtos';
import {
  InvalidCurrentPasswordException,
  ForeignKeyConflictException,
  UserExistsException,
} from '@common/http/exceptions';
import { Pagination, PaginationRequest, PaginationResponseDto } from '@libs/pagination';
import { CompanyRepository } from './company.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DBErrorCode } from '@common/enums';
import { CompanyMapper } from './company.mapper';
import { HashHelper } from '@helpers';
import { TimeoutError } from 'rxjs';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyRepository)
    private companyRepository: CompanyRepository,
  ) {}

  /**
   * Get a paginated user list
   * @param pagination {PaginationRequest}
   * @returns {Promise<PaginationResponseDto<CompanyResponseDto>>}
   */
  public async getCompany(pagination: PaginationRequest): Promise<PaginationResponseDto<CompanyResponseDto>> {
    try {
      const [CompanyEntity, totalCompany] = await this.companyRepository.getCompanyAndCount(pagination);

      const companyDtos = await Promise.all(CompanyEntity.map(CompanyMapper.toDtoWithRelations));
      return Pagination.of(pagination, totalCompany, companyDtos);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException();
      }
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * Get user by id
   * @param id {string}
   * @returns {Promise<CompanyResponseDto>}
   */
  public async getCompanyById(id: string): Promise<CompanyResponseDto> {
    const companyEntity = await this.companyRepository.findOne(id, {
      relations: ['permissions'],
    });
    if (!companyEntity) {
      throw new NotFoundException();
    }

    return CompanyMapper.toDtoWithRelations(companyEntity);
  }

  /**
   * Create new user
   /**
   * Create a new company.
   * @param companyDto The DTO containing company information.
   * @returns {Promise<CompanyResponseDto>} The created company.
   */
   public async createCompany(companyDto: CreateCompanyRequestDto): Promise<CompanyResponseDto> {
    try {
      let companyEntity = CompanyMapper.toCreateEntity(companyDto);
      // If your CompanyEntity has a password field and you want to encrypt it:
      // companyEntity.password = await HashHelper.encrypt(companyEntity.password);
      companyEntity = await this.companyRepository.save(companyEntity);
      return CompanyMapper.toDto(companyEntity);
    } catch (error) {
      // Handle specific errors based on their types or codes
      if (error.code == DBErrorCode.PgUniqueConstraintViolation) {
        throw new UserExistsException(companyDto.companyName);
      }
      if (
        error.code == DBErrorCode.PgForeignKeyConstraintViolation ||
        error.code == DBErrorCode.PgNotNullConstraintViolation
      ) {
        throw new ForeignKeyConflictException();
      }
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * Update User by id
   * @param id {string}
   * @param companyDto {UpdateUserRequestDto}
   * @returns {Promise<CompanyResponseDto>}
   */
  public async updateCompany(id: string, companyDto: UpdatecompanyRequestDto): Promise<CompanyResponseDto> {
    let companyEntity = await this.companyRepository.findOne(id);
    if (!companyEntity) {
      throw new NotFoundException();
    }

    try {
      companyEntity = CompanyMapper.toUpdateEntity(companyEntity, companyDto);
      companyEntity = await this.companyRepository.save(companyEntity);
      return CompanyMapper.toDto(companyEntity);
    } catch (error) {
      if (error.code == DBErrorCode.PgUniqueConstraintViolation) {
        throw new UserExistsException(companyDto.companyName);
      }
      if (
        error.code == DBErrorCode.PgForeignKeyConstraintViolation ||
        error.code == DBErrorCode.PgNotNullConstraintViolation
      ) {
        throw new ForeignKeyConflictException();
      }
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  // /**
  //  * Change user password
  //  * @param changePassword {ChangePasswordRequestDto}
  //  * @param user {string}
  //  * @returns {Promise<UserResponseDto>}
  //  */
  // public async changePassword(changePassword: ChangePasswordRequestDto, userId: string): Promise<UserResponseDto> {
  //   const { currentPassword, newPassword } = changePassword;

  //   const userEntity = await this.usersRepository.findOne({ id: userId });

  //   if (!userEntity) {
  //     throw new NotFoundException();
  //   }

  //   const passwordMatch = await HashHelper.compare(currentPassword, userEntity.password);

  //   if (!passwordMatch) {
  //     throw new InvalidCurrentPasswordException();
  //   }

  //   try {
  //     userEntity.password = await HashHelper.encrypt(newPassword);
  //     await this.usersRepository.save(userEntity);
  //     return UserMapper.toDto(userEntity);
  //   } catch (error) {
  //     if (error instanceof TimeoutError) {
  //       throw new RequestTimeoutException();
  //     } else {
  //       throw new InternalServerErrorException();
  //     }
  //   }
  // }
}
