import { GitHub } from '@beelzebub/types'
import { Field, InputType } from '@nestjs/graphql'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { Transform } from 'class-transformer'

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
}

@InputType()
export class CreateRepositoryDto {
  @Field()
  @IsString()
  @IsNotEmpty()
  name: string
}
