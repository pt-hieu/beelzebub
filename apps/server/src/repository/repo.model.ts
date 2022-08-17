import { Model } from '@beelzebub/types'
import { Field, ObjectType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { BaseModel } from 'src/misc/base.model'
import { Column, Entity } from 'typeorm'

@ObjectType()
@Entity({ name: 'repo' })
export class RepoModel extends BaseModel implements Model.Repo {
  @Column({ unique: true })
  @Field()
  name: string

  @Column({ type: 'jsonb', default: {} })
  @Field(() => GraphQLJSON)
  data: Record<string, unknown>

  @Column()
  @Field()
  synced_at: Date

  @Column({ default: false })
  @Field()
  outdated: boolean
}
