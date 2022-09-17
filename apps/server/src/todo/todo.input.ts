import { Model } from '@beelzebub/types'

import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql'
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator'

@InputType()
export class CreateTodo implements Omit<Model.Todo, keyof Model.Base> {
  @Field({ nullable: true })
  @IsNotEmpty()
  @IsOptional()
  title: string

  @Field()
  @IsNotEmpty()
  content: string

  @Field(() => [Model.TodoCategorization])
  @IsEnum(Model.TodoCategorization, { each: true })
  categorization: Model.TodoCategorization[]

  @Field(() => Date)
  @IsDate()
  startTime: Date

  @Field({ nullable: true })
  @IsPositive()
  @IsOptional()
  duration: number | null
}

@InputType()
export class UpdateTodo extends PartialType(CreateTodo) {}
