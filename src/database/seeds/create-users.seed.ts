import { Factory, Seeder } from 'typeorm-seeding';
import { Connection, In } from 'typeorm';
import * as _ from 'lodash';
import { UserStatus, approveBy } from '../../modules/admin/access/users/user-status.enum';
import { UserEntity } from '../../modules/admin/access/users/user.entity';
import { RoleEntity } from '../../modules/admin/access/roles/role.entity';
import { PermissionEntity } from '../../modules/admin/access/permissions/permission.entity';
import { CompanyEntity } from '@modules/admin/access/company/company.entity';
import { HashHelper } from '../../helpers';

const users = [
  {
    firstName: 'Manager',
    lastName: 'Manager',
    companyId: '1',
    password: 'Hello123',
    username: 'Manager',
    isSuperUser: true,
    approveBy : approveBy.Manager,
    status: UserStatus.Active,
    parentId: '1',
  },
];
// const company= [
//   {
//   companyName: "BMW",
//   companyLogo: "Jpg.png",
//   companyDescription: "string",
//   companyServiceDetails: "string",
//   companyAddress: "Phnom Penh",
//   },
// ];
const rolePermissions = {
  Manager: [
    { slug: 'admin.access.users.read', description: 'Read users' },
    { slug: 'admin.access.users.create', description: 'Create users' },
    { slug: 'admin.access.users.update', description: 'Update users' },
    { slug: 'admin.access.users.delete', description: 'Update users' },
    { slug: 'admin.access.roles.read', description: 'Read Roles' },
    { slug: 'admin.access.roles.create', description: 'Create Roles' },
    { slug: 'admin.access.roles.update', description: 'Update Roles' },
    { slug: 'admin.access.permissions.read', description: 'Read permissions' },
    {
      slug: 'admin.access.permissions.create',
      description: 'Create permissions',
    },
    {
      slug: 'admin.access.permissions.update',
      description: 'Update permissions',
    },
    { slug: 'admin.access.company.read', description: 'read company' },
    { slug: 'admin.access.company.create', description:'create company'},
    { slug: 'admin.access.company.update', description:'update company'},
    { slug: 'admin.access.company.delete', description:'update delete'},
  ],
  Admin: [
    { slug: 'admin.access.users.read', description: 'Read users' },
    { slug: 'admin.access.users.create', description: 'Create users' },
    { slug: 'admin.access.users.update', description: 'Update users' },
    { slug: 'admin.access.roles.read', description: 'Read Roles' },
    { slug: 'admin.access.roles.create', description: 'Create Roles' },
    { slug: 'admin.access.roles.update', description: 'Update Roles' },
    { slug: 'admin.access.company.read', description: 'read company' },
  ],
  HR: [
    { slug: 'admin.access.users.read', description: 'Read users' },
    { slug: 'admin.access.users.update', description: 'Update users' },
    { slug: 'admin.access.roles.read', description: 'Read Roles' },
    { slug: 'admin.access.company.read', description: 'read company' },
  ],
  Stuff: [
    { slug: 'admin.access.users.read', description: 'Read users' },
    { slug: 'admin.access.roles.read', description: 'Read Roles' },
    { slug: 'admin.access.company.read', description: 'read company' },
  ],
};


export default class CreateUsersSeed implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const roleNames = Object.keys(rolePermissions);
    // Distinct permissions contained in all roles
    const permissions = _.uniqBy(
      roleNames.reduce((acc, roleName) => {
        return acc.concat(rolePermissions[roleName]);
      }, []),
      'slug',
    );
    // Getting slugs form permissions
    const permissionSlugs = permissions.map((p) => p.slug);
    // Getting existing permissions from the DB
    const existingPermissions = await connection.manager.find(PermissionEntity, {
      where: { slug: In(permissionSlugs) },
    });
    // Mapping all permissions to permission entities
    const validPermissions = permissions.map((p) => {
      const existing = existingPermissions.find((e) => e.slug === p.slug);
      if (existing) {
        return existing;
      }
      return new PermissionEntity(p);
    });
    // Creating / updating permissions
    const savedPermissions = (await connection.manager.save(validPermissions)).reduce((acc, p) => {
      return { ...acc, [p.slug]: p };
    }, {});

    // Creating roles
    const roles = roleNames.map((name) => {
      const permissions = Promise.resolve(rolePermissions[name].map((p) => savedPermissions[p.slug]));
      return new RoleEntity({ name, permissions });
    });
    const savedRoles = await connection.manager.save(roles);
    
    // Creating users
    const entities = await Promise.all(
      users.map(async (u) => {
        const roles = Promise.resolve(savedRoles);
        const password = await HashHelper.encrypt(u.password);
        const user = new UserEntity({ ...u, password, roles });
        return user;
      }),
    );
    await connection.manager.save(entities);



  //  // Creating company
  //  const Company = await Promise.all(
  //   company.map(async (u) => {
  //     const company = new CompanyEntity(u);
  //     return company;
  //   }),
  // );

  // await connection.manager.save(Company);
}
   
}
