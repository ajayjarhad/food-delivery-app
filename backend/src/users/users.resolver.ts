import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LoginInput, LoginOutput } from 'src/common/dtos/login.dto';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account';
import { Users } from './entities/users.entity';
import { UsersService } from './users.service';

@Resolver((of) => Users)
export class UsersResolvers {
  constructor(private readonly usersService: UsersService) {}

  @Query((returns) => String)
  hello() {
    return 'hello';
  }

  @Mutation((returns) => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    try {
      return await this.usersService.createAccount(createAccountInput);
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      return await this.usersService.login(loginInput);
    } catch (error) {
      return { ok: false, error, token: null };
    }
  }
}
