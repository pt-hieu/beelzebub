import { Field, InputType, PartialType } from '@nestjs/graphql'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator'

@InputType()
export class CreateLinkDto {
  @Field()
  @IsUrl()
  url: string

  @Field({ nullable: true })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  alias: string
}

@InputType()
export class UpdateLinkDto extends PartialType(CreateLinkDto) {}
