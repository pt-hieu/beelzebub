import { Model } from '@beelzebub/types'

import { Field, ObjectType } from '@nestjs/graphql'
import { nanoid } from 'nanoid'
import { Column, Entity } from 'typeorm'

import { BaseModel } from '../misc/base.model.js'

@ObjectType()
@Entity({ name: 'link' })
export class LinkModel extends BaseModel implements Model.Link {
  @Field()
  @Column()
  url: string

  @Field()
  @Column({ unique: true })
  alias: string

  @Field({ nullable: true })
  @Column({ nullable: true })
  title: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  image: string | null

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string | null

  @Field()
  @Column({ default: 'WIP', enum: ['Done', 'WIP', 'Error'] })
  scrapeStatus: 'Done' | 'WIP' | 'Error'
}
