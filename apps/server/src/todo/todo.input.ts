import { Model } from '@beelzebub/types'
import { Field, InputType, PartialType, OmitType } from '@nestjs/graphql'
import { IsDate, IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

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

  @Field(() => Date, { nullable: true })
  @IsDate()
  @IsOptional()
  deadline: Date
}

@InputType()
export class UpdateTodo extends PartialType(
  OmitType(CreateTodo, ['deadline']),
) {}
