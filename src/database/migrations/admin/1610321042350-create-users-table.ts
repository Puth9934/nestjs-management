import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { commonFields } from '../common.fields';

const tableName = 'admin.users';

export class createUsersTable1610321042350 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: tableName,
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            // generationStrategy: 'integer',
            isGenerated: true,
            isNullable: false,
          },
          {
            name: 'username',
            type: 'varchar',
            length: '20',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'first_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'last_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'companyId',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'is_super_user',
            type: 'boolean',
            isNullable: false,
            default: false,
          },
          {
            name: 'status',
            type: 'user_status',
            isNullable: false,
          },
          {
            name: 'approveBy_Id',
            type: 'varchar',
            isNullable: true,
          },
          // {
          //   name: 'isApproved',
          //   type:'boolean',
          //   isNullable: false,
          // },
          {
            name: 'parentId',
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
