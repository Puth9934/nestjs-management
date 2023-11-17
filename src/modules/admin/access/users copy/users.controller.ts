import { ValidationPipe, ParseUUIDPipe, Controller, UseGuards, Param, Post, Body, Get, Put , Delete } from '@nestjs/common';
import { ApiPaginatedResponse, PaginationParams, PaginationRequest, PaginationResponseDto } from '@libs/pagination';
import { ChangePasswordRequestDto, CreateUserRequestDto, UpdateUserRequestDto, UserResponseDto } from '../users/dtos';
import { ApiConflictResponse, ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
// import { CurrentUser, Permissions, TOKEN_NAME } from '@auth';
import { ApiGlobalResponse } from '@common/decorators';
import { RigisterService } from './users.service';
import { UserEntity } from '../users/user.entity';

@ApiTags('Rigister')
// @ApiBearerAuth('stuff')
@Controller({
  path: 'access/register',
  version: '1',
})
export class registerController {
  constructor(private registerService: RigisterService) {}

  @ApiOperation({ description: 'Get a paginated user list' })
  @ApiPaginatedResponse(UserResponseDto)
  @ApiQuery({
    name: 'search',
    type: 'string',
    required: false,
    example: 'admin',
  })
//   @Permissions('admin.access.users.read', 'admin.access.users.create', 'admin.access.users.update')
  @Get()
  public getUsers(@PaginationParams() pagination: PaginationRequest): Promise<PaginationResponseDto<UserResponseDto>> {
    return this.registerService.getUsers(pagination);
  }

  @ApiOperation({ description: 'Get user by id' })
  @ApiGlobalResponse(UserResponseDto)
  // @Permissions('admin.access.users.read', 'admin.access.users.create', 'admin.access.users.update')
  @Get('/:id')
  public getUserById(@Param('id', ParseUUIDPipe) id: string): Promise<UserResponseDto> {
    return this.registerService.getUserById(id);
  }

  @ApiOperation({ description: 'Create new user' })
  @ApiGlobalResponse(UserResponseDto)
  @ApiConflictResponse({ description: 'User already exists' })
  // @ApiGlobalResponse(UserResponseDto)
  // @Permissions('admin.access.users.create')
  @Post()
  public createUser(@Body() UserDto: CreateUserRequestDto): Promise<UserResponseDto> {
    return this.registerService.createUser(UserDto);
  }

  // @ApiOperation({ description: 'Create new guest' })
  // @ApiGlobalResponse(UserResponseDto)
  // @ApiConflictResponse({ description: 'User already exists' })
  // @ApiGlobalResponse(UserResponseDto)
  // // @Permissions('admin.access.users.create')
  // @Post()
  // public createGuest(@Body() UserDto: CreateUserRequestDto): Promise<UserResponseDto> {
  //   return this.registerService.createGuest(UserDto);
  // }

  @ApiOperation({ description: 'Update user by id' })
  @ApiGlobalResponse(UserResponseDto)
  @ApiConflictResponse({ description: 'User already exists' })
  // @Permissions('admin.access.users.update')
  @Put('/:id')
  public updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) UserDto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    return this.registerService.updateUser(id, UserDto);
  }

  
//   @ApiOperation({ description: 'Change user password' })
//   @ApiGlobalResponse(UserResponseDto)
//   @Post('/change/password')
//   changePassword(
//     @Body(ValidationPipe) changePassword: ChangePasswordRequestDto,
//     @CurrentUser() user: UserEntity,
//   ): Promise<UserResponseDto> {
//     return this.registerService.changePassword(changePassword, user.id);
//   }
// /** 
//   * Delete user by id
//   * @param id {string}
//   * @returns {Promise<void>}
//   */
//  @Delete(':id')
//  public async deleteUser(@Param('id') id: string): Promise<void> {
//    return this.registerService.deleteUser(id);
//  }
}
