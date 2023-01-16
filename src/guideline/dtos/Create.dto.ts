import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { GuidelineTypesEnum } from '../guideline.enum';

export class CreateGuidelineDto {
  @ApiProperty({ example: ' termsAndConditions, faq , eWaiver , huntEWaiver ' })
  @IsNotEmpty()
  @IsEnum(GuidelineTypesEnum)
  type: GuidelineTypesEnum;

  @ApiProperty({ example: 'string' })
  @IsNotEmpty()
  description: string;
}
