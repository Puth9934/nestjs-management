import { InternalServerErrorException, RequestTimeoutException, NotFoundException, Injectable ,} from '@nestjs/common';
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
export class companyService {
  constructor(
    @InjectRepository(CompanyRepository)
    private companyRepository: CompanyRepository,
  ) {}
   /**
   * @param companyDto {CreateCompanyRequestDto}
   * @returns {Promise<CompanyResponseDto>}
   */
   public async createCompany(companyDto: CreateCompanyRequestDto): Promise<CompanyResponseDto> {
    try {
      let companyEntity = CompanyMapper.toCreateEntity(companyDto);
      companyEntity = await this.companyRepository.save(companyEntity);
      return CompanyMapper.toDto(companyEntity);
    } catch (error) {
      if (error.code == DBErrorCode.PgUniqueConstraintViolation) {
        throw new UserExistsException(companyDto.companyName);
      }
      if (error instanceof TimeoutError) {
        throw new RequestTimeoutException();
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
 
}
