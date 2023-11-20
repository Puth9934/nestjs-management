import { ArrayNotEmpty, IsAlphanumeric, IsArray, IsEnum, IsInt, IsNotEmpty, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// import { UserStatus } from '../user-status.enum';

export class UpdatecompanyRequestDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @ApiProperty({
    example: 'ABA',
  })
  companyName: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'jpg',
  })
  companyLogo: string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'Write about your company',
  })
  companyDescription: string;
  
  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example:'Your company service details',
  })
  companyServiceDetails: string;

  // @ApiProperty({ example: [1, 2] })
  // @ArrayNotEmpty()
  // @IsArray()
  // @IsInt({ each: true })
  // permissions: number[];

  // @ApiProperty({ example: [1, 2] })
  // @ArrayNotEmpty()
  // @IsArray()
  // @IsInt({ each: true })
  // roles: number[];

  // @IsEnum(UserStatus)
  // @ApiProperty({
  //   example: UserStatus.Active,
  // })
  // status: UserStatus;

  @MaxLength(100)
  @ApiProperty({
    example: 'company address',
  })
  companyAddress : string;
}
