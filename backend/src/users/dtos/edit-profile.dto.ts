import {
  Field,
  InputType,
  ObjectType,
  PartialType,
  PickType,
} from '@nestjs/graphql';
import { MutationOutput } from 'src/common/dtos/output.dto';
import { Users } from '../entities/users.entity';

@InputType()
export class EditProfileInput extends PartialType(
  PickType(Users, ['email', 'password']),
) {}

@ObjectType()
export class EditProfileOutput extends MutationOutput {}
