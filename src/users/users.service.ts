import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from 'src/jwt/jwt.service';
import { commonErrorMessage } from 'src/utils/constants';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { FindByIdOutput } from './dtos/find-by-id.dto';
import { SignInInput, SignInOutput } from './dtos/sign-in.dto';
import { AllowedAuthType, Users } from './entities/user.entities';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly users: Repository<Users>,
    private readonly jwtService: JwtService,
  ) {}
  async findById(id: number): Promise<FindByIdOutput> {
    try {
      const user = await this.users.findOne(id);
      return {
        ok: true,
        user,
        message: user === undefined ? 'User not found!' : undefined,
      };
    } catch (e) {
      return {
        ok: false,
        error: commonErrorMessage,
      };
    }
  }

  async createAccount({
    email,
    name,
    password,
  }: CreateAccountInput): Promise<CreateAccountOutput> {
    try {
      email = email.toLowerCase();
      const userExists = await this.users.findOne({ email });
      if (userExists)
        return {
          ok: false,
          error: 'Seems like you already have an account! Sign in now!',
        };
      const user = await this.users.save(
        this.users.create({
          email,
          name,
          password,
          authType: AllowedAuthType.email,
        }),
      );
      if (!user)
        return {
          ok: true,
          error: 'Failed to created account, please try again.',
        };
      return {
        ok: true,
        user: {
          id: user.id,
          email,
          name,
        },
      };
    } catch (e) {
      throw new InternalServerErrorException(commonErrorMessage);
    }
  }

  async signIn({ email, password }: SignInInput): Promise<SignInOutput> {
    try {
      email = email.toLowerCase();
      const user = await this.users.findOne(
        { email },
        {
          select: [
            'id',
            'password',
            'active',
            'email',
            'name',
            'authType',
            'created_at',
            'emailVerified',
          ],
        },
      );
      if (!user) {
        return {
          ok: false,
          error:
            'Your e-mail is not registered, create an account to continue.',
        };
      }
      if (!user.active) {
        return {
          ok: false,
          error: 'Account has been suspended!',
        };
      }
      if (user.authType !== AllowedAuthType.email) {
        return {
          ok: false,
          error:
            'You created your account with Google, please sign in with Google.',
        };
      }
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Password Incorrect! Please try again.',
        };
      }
      const accessToken = this.jwtService.sign(user.id);
      return {
        ok: true,
        accessToken,
        id: user.id,
      };
    } catch (error) {
      return {
        ok: false,
        error: commonErrorMessage,
      };
    }
  }
}
