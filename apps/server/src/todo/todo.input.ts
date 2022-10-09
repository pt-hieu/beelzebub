import { Model } from '@beelzebub/types'

import { BadRequestException } from '@nestjs/common'
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

import { TransformFucntion, toBoolean } from '../misc/transform.js'

@InputType()
export class CreateTodo implements Omit<Model.Todo, keyof Model.Base | 'meta'> {
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

  @Field(() => Model.RemindType, { nullable: true })
  @IsEnum(Model.RemindType)
  @IsOptional()
  remind: Model.RemindType
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

class UpdateTodoOptionsTransformer {
  static targetDate: TransformFucntion<UpdateTodoOptions> = ({
    key,
    value,
    obj,
  }) => {
    if (key !== 'targetDate') return
    if (obj.updateOnlyTarget && !value)
      throw new BadRequestException('Target Date is missing!')

    return value
  }
}

@InputType()
export class UpdateTodoOptions {
  @Field({ nullable: true })
  @IsBoolean()
  @Transform(toBoolean)
  @IsOptional()
  updateOnlyTarget: boolean

  @Field({ nullable: true })
  @IsOptional()
  @Transform(UpdateTodoOptionsTransformer.targetDate)
  @Type(() => Date)
  @IsDate()
  targetDate: Date
}
