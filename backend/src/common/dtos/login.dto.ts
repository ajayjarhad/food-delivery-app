import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { Users } from 'src/users/entities/users.entity';
import { MutationOutput } from './output.dto';

@InputType()
export class LoginInput extends PickType(Users, ['email', 'password']) {}

@ObjectType()
export class LoginOutput extends MutationOutput {
  @Field((type) => String, { nullable: true })
  token?: string;
}
