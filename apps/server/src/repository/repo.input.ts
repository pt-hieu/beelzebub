import { GitHub } from '@beelzebub/types'

import { Field, InputType } from '@nestjs/graphql'
import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator'

@InputType()
export class UpdateRepositoryDto implements GitHub.UpdateRepository {
  @Field({ nullable: true })
  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  is_template?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  archived?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @Transform(({ value }) => JSON.parse(value))
  private?: boolean

  @Field({ nullable: true })
  @IsOptional()
  @ValidateIf((_, value) => value !== null)
  @IsString()
  @IsNotEmpty()
  path?: string
}

@InputType()
export class CreateRepositoryDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string
}
