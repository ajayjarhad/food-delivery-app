import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import AuthUser from 'src/auth/auth.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { LoginInput, LoginOutput } from 'src/common/dtos/login.dto';
import { CreateAccountInput, CreateAccountOutput } from './dtos/create-account';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';

import { Users } from './entities/users.entity';
import { UsersService } from './users.service';

@Resolver((of) => Users)
export class UsersResolvers {
  constructor(private readonly usersService: UsersService) {}

  // @Query((returns) => Users)
  // @UseGuards(AuthGuard)
  // // NOTE: FOR REFERENCE
  // me(@AuthUser() authUser: Users) {
  //   return authUser;
  // }
  @Query((returns) => UserProfileOutput)
  @UseGuards(AuthGuard)
  async user(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    try {
      const user = await this.usersService.findById(userProfileInput.userId);
      if (!user) {
        throw new Error();
      }
      return {
        ok: true,
        user,
      };
    } catch (error) {
      return {
        ok: false,
        error: 'User not found',
      };
    }
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

  @Mutation((returns) => EditProfileOutput)
  async editProfile(
    @AuthUser() authUser: Users,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    try {
      await this.usersService.editProfile(authUser.id, editProfileInput);
      return {
        ok: true,
      };
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
}
