import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { ME_UPDATES, PUB_SUB } from 'src/common/common.constants';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { MeUpdatesInput } from './dtos/me-updates.dto';
import { RequestVerificationOuput } from './dtos/request-verification';
import { SignInInput, SignInOutput } from './dtos/sign-in.dto';
import {
  UpdateProfileInput,
  UpdateProfileOutput,
} from './dtos/update-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import { Users } from './entities/user.entities';
import { UsersService } from './users.service';

@Resolver(of => Users)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => Users)
  me(@AuthUser() authUser: Users) {
    return authUser;
  }

  @Subscription(() => Users, {
    filter: (
      {
        updateMe: {
          user: { id },
        },
      },
      _,
      { user },
    ) => {
      return id === user?.id;
    },
    resolve: ({ updateMe: { user } }) => user,
  })
  @Role(['Any'])
  meUpdates() {
    return this.pubSub.asyncIterator(ME_UPDATES);
  }

  @Mutation(() => CreateAccountOutput)
  createAccount(@Args('input') input: CreateAccountInput) {
    return this.usersService.createAccount(input);
  }

  @Mutation(() => SignInOutput)
  signIn(@Args('input') input: SignInInput) {
    return this.usersService.signIn(input);
  }

  @Mutation(() => RequestVerificationOuput)
  requestVerification(@AuthUser() authUser: Users) {
    return this.usersService.requestVerificationCode(authUser?.email);
  }

  @Mutation(() => UpdateProfileOutput)
  updateProfile(
    @AuthUser() authUser: Users,
    @Args('input') input: UpdateProfileInput,
  ) {
    if (!authUser) {
      return {
        ok: false,
        error: 'You are not authorized!',
      };
    }
    return this.usersService.updateProfile(authUser.id, input);
  }

  @Mutation(() => VerifyEmailOutput)
  verifyEmail(@AuthUser() user: Users, @Args('input') input: VerifyEmailInput) {
    return this.usersService.verifyEmail(user.id, input);
  }
}
