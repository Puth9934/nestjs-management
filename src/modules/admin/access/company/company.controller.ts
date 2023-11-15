import { ValidationPipe, ParseUUIDPipe, Controller, UseGuards, Param, Post, Body, Get, Put } from '@nestjs/common';
import { ApiPaginatedResponse, PaginationParams, PaginationRequest, PaginationResponseDto } from '@libs/pagination';
import { CreateCompanyRequestDto, UpdatecompanyRequestDto, CompanyResponseDto } from './dtos';
import { ApiConflictResponse, ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CurrentUser, Permissions, TOKEN_NAME } from '@auth';
import { ApiGlobalResponse } from '@common/decorators';
import { CompanyService } from './company.service';
import { CompanyEntity } from './company.entity';

@ApiTags('company')
@ApiBearerAuth(TOKEN_NAME)
@Controller({
  path: 'access/company',
  version: '1',
})
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @ApiOperation({ description: 'Get a paginated company list' })
  @ApiPaginatedResponse(CompanyResponseDto)
  @ApiQuery({
    name: 'search',
    type: 'string',
    required: false,
    example: 'ABA',
  })
  @Permissions('admin.access.company.read', 'admin.access.company.create', 'admin.access.company.update')
  @Get()
  public getCompany(@PaginationParams() pagination: PaginationRequest): Promise<PaginationResponseDto<CompanyResponseDto>> {
    return this.companyService.getCompany(pagination);
  }

  @ApiOperation({ description: 'Get company by id' })
  @ApiGlobalResponse(CompanyResponseDto)
  @Permissions('admin.access.company.read', 'admin.access.company.create', 'admin.access.company.update')
  @Get('/:id')
  public getCompanyById(@Param('id', ParseUUIDPipe) id: string): Promise<CompanyResponseDto> {
    return this.companyService.getCompanyById(id);
  }

  @ApiOperation({ description: 'Create new company' })
  @ApiGlobalResponse(CompanyResponseDto)
  @ApiConflictResponse({ description: 'company already exists' })
  @ApiGlobalResponse(CompanyResponseDto)
  @Permissions('admin.access.company.create')
  @Post()
  public createCompany (@Body(ValidationPipe) companyDto: CreateCompanyRequestDto): Promise<CompanyResponseDto> {
    return this.companyService.createCompany(companyDto);
  }

  @ApiOperation({ description: 'Update company by id' })
  @ApiGlobalResponse(CompanyResponseDto)
  @ApiConflictResponse({ description: 'User already exists' })
  @Permissions('admin.access.company.update')
  @Put('/:id')
  public updateCompany(
    @Param('id', ParseUUIDPipe) id: string,
    @Body(ValidationPipe) companyDto: UpdatecompanyRequestDto,
  ): Promise<CompanyResponseDto> {
    return this.companyService.updateCompany(id, companyDto);
  }


  // @ApiOperation({ description: 'Change user password' })
  // @ApiGlobalResponse(CompanyResponseDto)
  // @Post('/change/password')
  // changePassword(
  //   @Body(ValidationPipe) changePassword: ChangePasswordRequestDto,
  //   @CurrentUser() user: UserEntity,
  // ): Promise<UserResponseDto> {
  //   return this.companyService.changePassword(changePassword, user.id);
  // }
}
