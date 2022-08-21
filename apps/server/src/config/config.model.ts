import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity } from 'typeorm'
import { Model } from '@beelzebub/types'
import { BaseModel } from '../misc/base.model.js'

@ObjectType()
@Entity({ name: 'config' })
export class ConfigModel extends BaseModel implements Model.Config {
  @Field()
  @Column({ type: 'boolean', default: true, unique: true })
  unique: true

  @Field()
  @Column()
  display_name: string

  @Field()
  @Column()
  avatar: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  github_token: string
}
