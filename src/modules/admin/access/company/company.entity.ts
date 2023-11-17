import { BaseEntity } from '@database/entities';
import { Entity, Column, PrimaryGeneratedColumn , PrimaryColumn , ManyToMany, JoinTable} from 'typeorm';
import { PermissionEntity } from '../permissions/permission.entity';


@Entity({ schema: 'admin', name: 'company' })
export class CompanyEntity extends BaseEntity {
  @PrimaryColumn({ name: 'id', type: 'uuid', generated: 'uuid' })
  id?: string;


  @Column({
    name: 'companyName',
    type: 'varchar',
    nullable: false,
    unique: true,
    length: 60,
  })
  companyName: string;

  @Column({
    name: 'companyLogo',
    type: 'varchar',
    nullable: false,
    length: 160,
  })
  companyLogo: string;

  @Column({
    name: 'companyDescription',
    type: 'boolean',
    nullable: false,
    default: true,
  })
  companyDescription: string;

  @Column({
    name: 'companyServiceDetails',
    type: 'varchar',
    nullable: false,
    length: 160,
  })
  companyService: string;

  @Column({
    name: 'companyAddress',
    type: 'varchar',
    nullable: false,
    length: 160,
  })
  companyAddress: string;
  

  // constructor(permission?: Partial<CompanyEntity>) {
  //   super();
  //   Object.assign(this, permission);
  
  // @ManyToMany(() => PermissionEntity, (permission) => permission.id, {
  //   lazy: true,
  //   cascade: true,
  // })
  // @JoinTable({
  //   name: 'company_permissions',
  //   joinColumn: {
  //     name: 'company_id',
  //     referencedColumnName: 'id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'permission_id',
  //     referencedColumnName: 'id',
  //   },
  // })
  // permissions: Promise<PermissionEntity[]>;

  // constructor(company?: Partial<CompanyEntity>) {
  //   super();
  //   Object.assign(this, company);
  // }
}
