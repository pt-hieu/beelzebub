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

  @BeforeInsert()
  generateId() {
    if (this.alias) return
    this.alias = nanoid(6)
  }
}
