import { Model } from '@black/share'
import { Field, ObjectType } from '@nestjs/graphql'
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@ObjectType()
export abstract class BaseModel implements Model.Base {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Field()
  @CreateDateColumn()
  created_at: Date

  @Field()
  @UpdateDateColumn()
  updated_at: Date
}
