import { PaginationRequest } from '@libs/pagination';
import { EntityRepository, Repository } from 'typeorm';
import { CompanyEntity } from './company.entity';

@EntityRepository(CompanyEntity)
export class CompanyRepository extends Repository<CompanyEntity> {
  /**
   * Get users list
   * @param pagination {PaginationRequest}
   * @returns [userEntities: CompanyEntity[], totalUsers: number]
   */
  public async getCompanyAndCount(
    pagination: PaginationRequest,
  ): Promise<[companyEntities: CompanyEntity[], totalCompany: number]> {
    const {
      skip,
      limit: take,
      order,
      params: { search },
    } = pagination;
    const query = this.createQueryBuilder('u')
      .skip(skip)
      .take(take)
      .orderBy(order);

    if (search) {
      query.where(
        `
            u.companyName ILIKE :search
            OR u.companyDescription ILIKE :search
            `,
        { search: `%${search}%` },
      );
    }

    return query.getManyAndCount();
  }

 /**
   * Find company by ID with specified relations
   * @param id {string}
   * @param relations {string[]}
   * @returns Promise<CompanyEntity>
   */
 public async findCompanyById(id: string, relations: string[] = []): Promise<CompanyEntity | undefined> {
  return this.findOne(id, { relations });
}
}
