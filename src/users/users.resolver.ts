import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import {
  RequestVerificationInput,
  RequestVerificationOuput,
} from './dtos/request-verification';
import { SignInInput, SignInOutput } from './dtos/sign-in.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import { Users } from './entities/user.entities';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(returns => Users)
  me(@AuthUser() authUser: Users) {
    return authUser;
  }

  @Mutation(returns => CreateAccountOutput)
  createAccount(@Args('input') input: CreateAccountInput) {
    return this.usersService.createAccount(input);
  }

  @Mutation(returns => SignInOutput)
  signIn(@Args('input') input: SignInInput) {
    return this.usersService.signIn(input);
  }

  @Mutation(returns => RequestVerificationOuput)
  requestVerification(@Args('input') input: RequestVerificationInput) {
    return this.usersService.requestVerificationCode(input);
  }

  @Mutation(returns => VerifyEmailOutput)
  verifyEmail(@Args('input') input: VerifyEmailInput) {
    return this.usersService.verifyEmail(input);
  }
}
