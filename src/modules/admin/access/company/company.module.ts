import { Module } from '@nestjs/common';
import { companyService } from './company.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { companyController } from './company.controller';
import { CompanyRepository } from './company.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyRepository])],
  controllers: [companyController],
  providers: [companyService],
})
export class companyModule {}
