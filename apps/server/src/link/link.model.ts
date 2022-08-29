import { Model } from '@beelzebub/types'

import { Field, ObjectType } from '@nestjs/graphql'
import { nanoid } from 'nanoid'
import { BeforeInsert, Column, Entity } from 'typeorm'

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
  @Column()
  title: string | null

  @Field({ nullable: true })
  @Column()
  image: string | null

  @Field({ nullable: true })
  @Column()
  description: string | null

  @Field()
  @Column({ default: 'WIP', enum: ['Done', 'WIP', 'Error'] })
  scrapeStatus: 'Done' | 'WIP' | 'Error'

  @BeforeInsert()
  generateId() {
    if (this.alias) return
    this.alias = nanoid(6)
  }
}
