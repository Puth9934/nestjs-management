import { MigrationInterface, QueryRunner, Table } from "typeorm";

const tableName = 'admin.users_company',
  usersTableName = 'admin.users',
  companyTableName = 'admin.company';

export class createUsersCompanyTable1699868755550 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: tableName,
        columns: [
          {
            name: 'user_id',
            type: 'uuid',
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
            columnNames: ['user_id'],  // Corrected column name here
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
