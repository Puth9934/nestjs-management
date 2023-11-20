import { InternalServerErrorException, RequestTimeoutException, NotFoundException, Injectable } from '@nestjs/common';
import { CreateCompanyRequestDto, CompanyResponseDto,UpdatecompanyRequestDto } from './dtos';
import { UserExistsException } from '@common/http/exceptions';
import { Pagination, PaginationRequest, PaginationResponseDto } from '@libs/pagination';
import { CompanyRepository } from './company.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { DBErrorCode } from '@common/enums';
import { CompanyMapper } from './company.mapper';
import { TimeoutError } from 'rxjs';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(CompanyRepository)
    private companyRepository: CompanyRepository,
  ) {}

  /**
   * Create a new company
   * @param companyDto {CreateCompanyRequestDto}
   * @returns {Promise<CompanyResponseDto>}
   */
  public async createCompany(companyDto: CreateCompanyRequestDto): Promise<CompanyResponseDto> {
    try {
      let companyEntity = CompanyMapper.toCreateEntity(companyDto);
      companyEntity = await this.companyRepository.save(companyEntity);
      return CompanyMapper.toDto(companyEntity);
    } catch (error) {
      if (error.code === DBErrorCode.PgUniqueConstraintViolation) {
        throw new UserExistsException(companyDto.companyName);
      }
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        // Log the error for further analysis
        console.error('Error in createCompany:', error);
        throw new InternalServerErrorException();
      }
    }
  }

  /**
   * Get a paginated company list
   * @param pagination {PaginationRequest}
   * @returns {Promise<PaginationResponseDto<CompanyResponseDto>>}
   */
  public async getCompany(pagination: PaginationRequest): Promise<PaginationResponseDto<CompanyResponseDto>> {
    try {
      const [companyEntities, totalCompany] = await this.companyRepository.getCompanyAndCount(pagination);

      const companyDtos = await Promise.all(companyEntities.map(CompanyMapper.toDtoWithRelations));
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
   * Update company by ID
   * @param id {string}
   * @param companyDto {UpdateCompanyRequestDto}
   * @returns {Promise<CompanyResponseDto>}
   */
   public async updateCompany(id: string, companyDto: UpdatecompanyRequestDto): Promise<CompanyResponseDto> {
    let companyEntity = await this.companyRepository.findOne(id);
    if (!companyEntity) {
      throw new NotFoundException('Company not found');
    }

    try {
      companyEntity = CompanyMapper.toUpdateEntity(companyEntity, companyDto);
      companyEntity = await this.companyRepository.save(companyEntity);
      return CompanyMapper.toDto(companyEntity);
    } catch (error) {
      // Handle specific error scenarios based on your application logic
      throw new InternalServerErrorException('Failed to update company');
    }
  }

  /**
   * Get company by ID
   * @param id {string}
   * @returns {Promise<CompanyResponseDto>}
   */
  public async getCompanyById(id: string): Promise<CompanyResponseDto> {
    const companyEntity = await this.companyRepository.findOne(id);

    if (!companyEntity) {
      throw new NotFoundException('Company not found');
    }

    return CompanyMapper.toDtoWithRelations(companyEntity);
  }

  /**
   * Delete company by ID
   * @param id {string}
   * @returns {Promise<void>}
   */
  public async deleteCompany(id: string): Promise<void> {
    const companyEntity = await this.companyRepository.findOne(id);

    if (!companyEntity) {
      throw new NotFoundException('Company not found');
    }

    await this.companyRepository.remove(companyEntity);
  }
}
