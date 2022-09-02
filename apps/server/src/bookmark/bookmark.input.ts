import { Field, InputType } from '@nestjs/graphql'
import { Allow } from 'class-validator'
import { type FileUpload } from 'graphql-upload'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js'

@InputType()
export class ImportBookmarkDto {
  @Field(() => GraphQLUpload)
  @Allow()
  file: Promise<FileUpload>
}
