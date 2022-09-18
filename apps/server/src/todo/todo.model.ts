import { Model } from '@beelzebub/types'

import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'
import { Column, Entity } from 'typeorm'

import { BaseModel } from '../misc/base.model.js'

registerEnumType(Model.TodoCategorization, {
  name: 'TodoCategorization',
})

@ObjectType()
@Entity({ name: 'todo' })
export class TodoModel extends BaseModel implements Model.Todo {
  @Column({ nullable: true })
  @Field({ nullable: true })
  title: string | null

  @Column()
  @Field()
  content: string

  @Column({ type: 'enum', enum: Model.TodoCategorization, array: true })
  @Field(() => [Model.TodoCategorization])
  categorization: Model.TodoCategorization[]

  @Column()
  @Field(() => Date)
  startTime: Date

  @Column({ nullable: true })
  @Field({ nullable: true })
  duration: number | null

  @Column({ default: false })
  @Field()
  weekly: boolean
}
