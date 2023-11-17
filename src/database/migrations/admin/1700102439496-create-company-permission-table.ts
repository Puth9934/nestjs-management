import {MigrationInterface, QueryRunner , Table} from "typeorm";

const tableName = 'admin.permission_company',
usersTableName = 'admin.permissions',
companyTableName = 'admin.company';

export class createCompanyTable1700102439496 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
              name: tableName,
              columns: [
                {
                  name: 'permission_id',
                  type: 'integer',
                  isPrimary: true,
                  isNullable: false,
                },
                {
                  name: 'company_id',
                  type: 'integer',
                  isPrimary: true,
                  isNullable: false,
                },
              ],
              foreignKeys: [
                {
                  columnNames: ['company_id'],
                  referencedColumnNames: ['id'],
                  referencedTableName: companyTableName,
                  onUpdate: 'CASCADE',
                },
                {
                  columnNames: ['permission_id'],  // Corrected column name here
                  referencedColumnNames: ['id'],
                  referencedTableName: usersTableName,
                  onUpdate: 'CASCADE',
                },
              ],
            }),
            true,
          );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(tableName, true, true);
    }

}
