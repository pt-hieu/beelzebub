import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  Optional,
  PipeTransform,
} from '@nestjs/common'
import { Field, InputType } from '@nestjs/graphql'
import { UUIDVersion, isUUID } from 'class-validator'

type ParseTodoUUIDPipeOptions = {
  version?: UUIDVersion
}

@InputType()
export class ParseTodoUUIDPipeReturnType {
  @Field()
  id: string

  @Field()
  instanceNumber: number
}

@Injectable()
export class ParseTodoUUIDPipe
  implements PipeTransform<string, ParseTodoUUIDPipeReturnType>
{
  #version: UUIDVersion

  constructor(@Optional() options?: ParseTodoUUIDPipeOptions) {
    const { version = '4' } = options || {}
    this.#version = version
  }

  transform(
    value: string,
    { data }: ArgumentMetadata,
  ): ParseTodoUUIDPipeReturnType {
    let [id, instanceNumber] = value.split('/#') as unknown as readonly [
      string,
      string | number,
    ]

    instanceNumber = Number(instanceNumber)

    if (isUUID(id, this.#version) && !Number.isNaN(instanceNumber)) {
      return { id, instanceNumber }
    }

    throw new BadRequestException(`${data} is not a valid Todo UUID`)
  }
}
