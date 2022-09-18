import { Model } from '@beelzebub/types'

import { Field, InputType, PartialType } from '@nestjs/graphql'
import { Transform, Type } from 'class-transformer'
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPositive,
} from 'class-validator'

import { toBoolean } from '../misc/transform.js'

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

  @Field({ nullable: true })
  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  weekly: boolean | null
}

@InputType()
export class GetManyTodo {
  @Field(() => Date, { nullable: true })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  from?: Date

  @Field(() => Date, { nullable: true })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  to?: Date
}

@InputType()
export class UpdateTodo extends PartialType(CreateTodo) {}
