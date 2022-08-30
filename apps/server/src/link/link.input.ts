import { Field, InputType, PartialType } from '@nestjs/graphql'
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  ValidateIf,
} from 'class-validator'
import { nanoid } from 'nanoid'

@InputType()
export class CreateLinkDto {
  @Field()
  @IsUrl()
  url: string

  @Field({ nullable: true })
  @IsNotEmpty()
  @IsOptional()
  @IsString()
  alias: string = nanoid(3)
}

@InputType()
export class UpdateLinkDto extends PartialType(CreateLinkDto) {}
