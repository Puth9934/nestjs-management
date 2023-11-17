import { InternalServerErrorException, RequestTimeoutException, NotFoundException, Injectable } from '@nestjs/common';
import { ChangePasswordRequestDto, CreateUserRequestDto, UpdateUserRequestDto, UserResponseDto } from './dtos';
import {
  InvalidCurrentPasswordException,
  ForeignKeyConflictException,
  UserExistsException,
} from '@common/http/exceptions';
import { Pagination, PaginationRequest, PaginationResponseDto } from '@libs/pagination';
import { RigisterRepository } from './users.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DBErrorCode } from '@common/enums';
import { RigisterMapper } from './users.mapper';
import { HashHelper } from '@helpers';
import { TimeoutError } from 'rxjs';

@Injectable()
export class RigisterService {
  constructor(
    @InjectRepository(RigisterRepository)
    private rigisterRepository: RigisterRepository,
  ) {}

  /**
   * Get a paginated user list
   * @param pagination {PaginationRequest}
   * @returns {Promise<PaginationResponseDto<UserResponseDto>>}
   */
  public async getUsers(pagination: PaginationRequest): Promise<PaginationResponseDto<UserResponseDto>> {
    try {
      const [userEntities, totalUsers] = await this.rigisterRepository.getUsersAndCount(pagination);

      const UserDtos = await Promise.all(userEntities.map(RigisterMapper.tooDtoWithRelations));
      return Pagination.of(pagination, totalUsers, UserDtos);
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
   * @returns {Promise<UserResponseDto>}
   */
  public async getUserById(id: string): Promise<UserResponseDto> {
    const userEntity = await this.rigisterRepository.findOne(id, {
      relations: ['permissions', 'roles'],
    });
    if (!userEntity) {
      throw new NotFoundException();
    }

    return RigisterMapper.tooDtoWithRelations(userEntity);
  }


  
/**
   * Create new user
   * @param userDto {CreateUserRequestDto}
   * @returns {Promise<UserResponseDto>}
   */
public async createUser(userDto: CreateUserRequestDto): Promise<UserResponseDto> {
  try {
    let userEntity = RigisterMapper.tooCreateEntity(userDto);
    userEntity.password = await HashHelper.encrypt(userEntity.password);
    userEntity = await this.rigisterRepository.save(userEntity);
    return RigisterMapper.tooDto(userEntity);
  } catch (error) {
    if (error.code == DBErrorCode.PgUniqueConstraintViolation) {
      throw new UserExistsException(userDto.username);
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
//    * Create new user
//    * @param userDto {CreateUserRequestDto}
//    * @returns {Promise<UserResponseDto>}
//    */
// public async createGuest(userDto: CreateUserRequestDto): Promise<UserResponseDto> {
//   try {
//     let userEntity = RigisterMapper.toCreateGuest(userDto);
//     userEntity.password = await HashHelper.encrypt(userEntity.password);
//     userEntity = await this.rigisterRepository.save(userEntity);
//     return RigisterMapper.toDto(userEntity);
//   } catch (error) {
//     if (error.code == DBErrorCode.PgUniqueConstraintViolation) {
//       throw new UserExistsException(userDto.username);
//     }
//     if (
//       error.code == DBErrorCode.PgForeignKeyConstraintViolation ||
//       error.code == DBErrorCode.PgNotNullConstraintViolation
//     ) {
//       throw new ForeignKeyConflictException();
//     }
//     if (error instanceof TimeoutError) {
//       throw new RequestTimeoutException();
//     } else {
//       throw new InternalServerErrorException();
//     }
//   }
// }
  

 
  /**
   * Update User by id
   * @param id {string}
   * @param userDto {UpdateUserRequestDto}
   * @returns {Promise<UserResponseDto>}
   */
  public async updateUser(id: string, userDto: UpdateUserRequestDto): Promise<UserResponseDto> {
    let userEntity = await this.rigisterRepository.findOne(id);
    if (!userEntity) {
      throw new NotFoundException();
    }

    try {
      userEntity = RigisterMapper.tooUpdateEntity(userEntity, userDto);
      userEntity = await this.rigisterRepository.save(userEntity);
      return RigisterMapper.tooDto(userEntity);
    } catch (error) {
      if (error.code == DBErrorCode.PgUniqueConstraintViolation) {
        throw new UserExistsException(userDto.username);
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
   * Change user password
   * @param changePassword {ChangePasswordRequestDto}
   * @param user {string}
   * @returns {Promise<UserResponseDto>}
   */
  public async changePassword(changePassword: ChangePasswordRequestDto, userId: string): Promise<UserResponseDto> {
    const { currentPassword, newPassword } = changePassword;

    const userEntity = await this.rigisterRepository.findOne({ id: userId });

    if (!userEntity) {
      throw new NotFoundException();
    }

    const passwordMatch = await HashHelper.compare(currentPassword, userEntity.password);

    if (!passwordMatch) {
      throw new InvalidCurrentPasswordException();
    }

    try {
      userEntity.password = await HashHelper.encrypt(newPassword);
      await this.rigisterRepository.save(userEntity);
      return RigisterMapper.tooDto(userEntity);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  
  /**
   * Delete user by id
   * @param id {string}
   * @returns {Promise<void>}
   */
  public async deleteUser(id: string): Promise<void> {
    const userEntity = await this.rigisterRepository.findOne(id);

    if (!userEntity) {
      throw new NotFoundException();
    }

    try {
      await this.rigisterRepository.remove(userEntity);
    } catch (error) {
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
