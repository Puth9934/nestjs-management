import { ArrayNotEmpty, IsAlphanumeric, IsArray, IsInt, IsNotEmpty, Length, Matches, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

const passwordRegex = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
export class CreateCompanyRequestDto {
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
    example: 'Your company service detail',
  })
  companyService : string;

  @IsNotEmpty()
  @MaxLength(100)
  @ApiProperty({
    example: 'Your company address',
  })
  companyAddress : string;

}
