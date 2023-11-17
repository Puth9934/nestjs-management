import { ValidationPipe, ParseUUIDPipe, Controller, UseGuards, Param, Post, Body, Get, Put, Delete } from '@nestjs/common';
import { ApiPaginatedResponse, PaginationParams, PaginationRequest, PaginationResponseDto, } from '@libs/pagination';
import {CreateCompanyRequestDto, UpdatecompanyRequestDto, CompanyResponseDto } from './dtos';
import { ApiConflictResponse, ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CurrentUser, Permissions, TOKEN_NAME } from '@auth';
import { ApiGlobalResponse } from '@common/decorators';
import { companyService } from './company.service';
import { CompanyEntity } from './company.entity';
import { CompanyMapper } from './company.mapper';

@ApiTags('Company')
@ApiBearerAuth(TOKEN_NAME)
@Controller({
  path: 'access/company',
  version: '1',
})
export class companyController {
  constructor(private CompanyService: companyService) {}

  // @ApiOperation({ description: 'Get a paginated user list' })
  // @ApiPaginatedResponse(CompanyResponseDto)
  // @ApiQuery({
  //   name: 'search',
  //   type: 'string',
  //   required: false,
  //   example: 'admin',
  // })
  // @Permissions('admin.access.company.read', 'admin.access.company.create', 'admin.access.company.update')
  // @Get()
  // public getCompany(@PaginationParams() pagination: PaginationRequest): Promise<PaginationResponseDto<CompanyResponseDto>> {
  //   return this.CompanyService.getCompany(pagination);
  // }
 
  @ApiOperation({ description: 'Create new company' })
  @ApiGlobalResponse(CompanyResponseDto)
  @ApiConflictResponse({ description: 'company already exists' })
  // @UseGuards(SuperUserGuard)
  @Permissions('admin.access.company.create')
  @Post()
  public createcompany(
    @Body(ValidationPipe) companyDto: CreateCompanyRequestDto,
  ): Promise<CompanyResponseDto> {
    return this.CompanyService.createCompany(companyDto);
  }

}
