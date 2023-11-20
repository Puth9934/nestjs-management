// import { ApiProperty } from '@nestjs/swagger';

// export class CompanyResponseDto{
//   @ApiProperty()
//   id: string;

//   @ApiProperty()
//   companyName: string;

//   @ApiProperty()
//   companyLogo: string;
  
//   @ApiProperty()
//   companyDescription: string;
  
//   @ApiProperty()
//   companyService: string;

//   @ApiProperty()
//   companyAddress: string;
// }
import { ApiProperty } from '@nestjs/swagger';
import { PermissionResponseDto } from '../../permissions/dtos';
import { RoleResponseDto } from '../../roles/dtos';


export class CompanyResponseDto {
  @ApiProperty()
    id: string;
  
    @ApiProperty()
    companyName: string;
  
    @ApiProperty()
    companyLogo: string;
    
    @ApiProperty()
    companyDescription: string;
    
    @ApiProperty()
    companyServiceDetails: string;
  
    @ApiProperty()
    companyAddress: string;

  // @ApiProperty()
  // isApproved: boolean;

  // @ApiProperty()
  // parentId: boolean;

 
}
