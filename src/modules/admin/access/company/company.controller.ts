import { ValidationPipe, Controller, Param, Post, Body, Get, Delete ,Put,NotFoundException} from '@nestjs/common';
import { ApiPaginatedResponse, PaginationParams, PaginationRequest, PaginationResponseDto } from '@libs/pagination';
import { CreateCompanyRequestDto, CompanyResponseDto, UpdatecompanyRequestDto } from './dtos';
import { ApiConflictResponse, ApiBearerAuth, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Permissions, TOKEN_NAME } from '@auth';
import { ApiGlobalResponse } from '@common/decorators';
import { CompanyService } from './company.service';

@ApiTags('Company')
@ApiBearerAuth(TOKEN_NAME)
@Controller({
  path: 'access/company',
  version: '1',
})
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @ApiOperation({ description: 'Get a paginated user list' })
  @ApiPaginatedResponse(CompanyResponseDto)
  @ApiQuery({
    name: 'search',
    type: 'string',
    required: false,
    example: 'admin',
  })
  @Permissions('admin.access.company.read', 'admin.access.company.create', 'admin.access.company.update')
  @Get()
  public getCompany(@PaginationParams() pagination: PaginationRequest): Promise<PaginationResponseDto<CompanyResponseDto>> {
    return this.companyService.getCompany(pagination);
  }

  @ApiOperation({ description: 'Create new company' })
  @ApiGlobalResponse(CompanyResponseDto)
  @ApiConflictResponse({ description: 'Company already exists' })
  @Permissions('admin.access.company.create')
  // @UseGuards(SuperUserGuard) // Uncomment if needed
  @Post()
  public createCompany(@Body(ValidationPipe) companyDto: CreateCompanyRequestDto): Promise<CompanyResponseDto> {
    return this.companyService.createCompany(companyDto);
  }

  // Uncomment and update if needed
  // @ApiOperation({ description: 'Get a specific company by ID' })
  // @ApiGlobalResponse(CompanyResponseDto)
  // @Permissions('admin.access.company.read')
  // @Get(':id')
  // public getCompanyById(@Param('id') id: string): Promise<CompanyResponseDto> {
  //   return this.companyService.getCompanyById(id);
  // }

  // Uncomment and update if needed
  // @ApiOperation({ description: 'Delete a specific company by ID' })
  // @ApiGlobalResponse(CompanyResponseDto)
  // @Permissions('admin.access.company.delete')
  // @Delete(':id')
  // public deleteCompany(@Param('id') id: string): Promise<CompanyResponseDto> {
  //   return this.companyService.deleteCompany(id);
  // }


    /**
   * Update company by ID
   * @param id {string}
   * @param companyDto {UpdateCompanyRequestDto}
   * @returns {Promise<CompanyResponseDto>}
   */
    @ApiOperation({ description: 'Update an existing company' })
    @ApiGlobalResponse(CompanyResponseDto)
    @Permissions('admin.access.company.update')
    @Put(':id')
    public async updateCompany(
      @Param('id') id: string,
      @Body() companyDto: UpdatecompanyRequestDto,
    ): Promise<CompanyResponseDto> {
      try {
        const updatedCompany = await this.companyService.updateCompany(id, companyDto);
        return updatedCompany;
      } catch (error) {
        if (error instanceof NotFoundException) {
          // Handle not found error (e.g., return a specific response)
          throw new NotFoundException('Company not found');
        }
  
        // Handle other errors as needed
        throw error;
      }
    }

     /**
   * Get company by ID
   * @param id {string}
   * @returns {Promise<CompanyResponseDto>}
   */
  @ApiOperation({ description: 'Get a specific company by ID' })
  @ApiGlobalResponse(CompanyResponseDto)
  @Permissions('admin.access.company.read')
  @Get(':id')
  public async getCompanyById(@Param('id') id: string): Promise<CompanyResponseDto> {
    try {
      const company = await this.companyService.getCompanyById(id);
      return company;
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Handle not found error (e.g., return a specific response)
        throw new NotFoundException('Company not found');
      }

      // Handle other errors as needed
      throw error;
    }
  }

  
  @ApiOperation({ description: 'Delete a specific company by ID' })
  @ApiGlobalResponse(CompanyResponseDto)
  @Permissions('admin.access.company.delete')
  @Delete(':id')
  public deleteCompany(@Param('id') id: string): Promise<void> {
    return this.companyService.deleteCompany(id);
  }
}
