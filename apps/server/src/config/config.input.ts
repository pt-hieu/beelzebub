import { Model } from '@beelzebub/types'

import { Field, InputType, PartialType } from '@nestjs/graphql'
import { IsNotEmpty } from 'class-validator'

@InputType()
class CreateConfig implements Omit<Model.Config, keyof Model.Base | 'unique'> {
  @Field()
  @IsNotEmpty()
  display_name: string

  @Field()
  @IsNotEmpty()
  avatar: string

  @Field()
  @IsNotEmpty()
  github_token: string
}

@InputType()
export class UpdateConfig extends PartialType(CreateConfig) {}
