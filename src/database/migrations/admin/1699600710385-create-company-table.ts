import {MigrationInterface, QueryRunner, Table} from "typeorm";
import { commonFields } from '../common.fields';


const tableName = 'admin.company'
export class createCompanyTable1699600710385 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
            await queryRunner.createTable(
              new Table({
                name: tableName,
                columns: [
                  {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    isNullable: false,
                  },
                  {
                    name: 'companyName',
                    type: 'varchar',
                    length: '20',
                    isUnique: true,
                    isNullable: false,
                  },
                  {
                    name: 'companyLogo',
                    type: 'varchar',
                    length: '100',
                    isNullable: false,
                  },
                  {
                    name: 'companyDescription',
                    type: 'varchar',
                    length: '100',
                    isNullable: false,
                  },
                  {
                    name: 'company_servcie_detail',
                    type: 'varchar',
                    isNullable: false,
                  },
                  {
                    name: 'companyAddress',
                    type: 'varchar',
                    isNullable: false,
                  },
                  ...commonFields,
                ],
              }),
              true,
            );
          
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(tableName, true);
    }

}
