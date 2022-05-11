import { Field, ObjectType } from '@nestjs/graphql';
import { BaseModel } from 'src/misc/base.model';
import { Column, Entity } from 'typeorm';
import { Model } from '@black/share';

@Entity()
@ObjectType()
export class ConfigModel extends BaseModel implements Model.Config {
  @Field()
  @Column({ type: 'boolean', default: true, unique: true })
  unique: true;

  @Field()
  @Column()
  display_name: string;

  @Field()
  @Column()
  avatar: string;
}
