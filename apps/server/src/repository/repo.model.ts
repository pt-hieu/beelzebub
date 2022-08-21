import { Model } from '@beelzebub/types'
import { Field, ObjectType } from '@nestjs/graphql'
import { Column, Entity } from 'typeorm'
import { GraphQLJSON } from '../json.scalar.js'
import { BaseModel } from '../misc/base.model.js'

@ObjectType()
@Entity({ name: 'repo' })
export class RepoModel extends BaseModel implements Model.Repo {
  @Column({ unique: true })
  @Field()
  name: string

  @Column({ type: 'jsonb', default: {} })
  @Field(() => GraphQLJSON)
  data: Record<string, unknown>

  @Column({ type: 'jsonb', default: [] })
  @Field(() => GraphQLJSON)
  collabs: Record<string, unknown>[]

  @Column()
  @Field()
  synced_at: Date

  @Column({ default: false })
  @Field()
  outdated: boolean
}
