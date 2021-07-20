import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PubSub } from 'graphql-subscriptions';
import { ME_UPDATES, PUB_SUB, USER_OPTIONS } from 'src/common/common.constants';
import { JwtService } from 'src/jwt/jwt.service';
import { MailService } from 'src/mail/mail.service';
import { padWithChar } from 'src/utils/algo';
import { commonErrorMessage } from 'src/utils/constants';
import { throwCommonError } from 'src/utils/handlers';
import { Repository } from 'typeorm';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { FindByIdOutput } from './dtos/find-by-id.dto';
import { RequestVerificationOuput } from './dtos/request-verification';
import { SignInInput, SignInOutput } from './dtos/sign-in.dto';
import {
  UpdateProfileInput,
  UpdateProfileOutput,
} from './dtos/update-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import { AllowedAuthType, UserRole, Users } from './entities/user.entities';
import { Verification } from './entities/verification.entities';
import { UsersModuleOptions } from './users.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private readonly users: Repository<Users>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
    @Inject(USER_OPTIONS) private readonly options: UsersModuleOptions,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
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
          role:
            email === this.options.adminEmail ? UserRole.Admin : UserRole.User,
        }),
      );
      if (!user)
        return {
          ok: true,
          error: 'Failed to created account, please try again.',
        };
      const newCode = await this.verifications.save(
        this.verifications.create({ user }),
      );
      await this.mailService.sendVerificationEmail(user.email, newCode.code);
      const accessToken = this.jwtService.sign(user.id);
      return {
        ok: true,
        accessToken,
        user: {
          id: user.id,
          email,
          name,
          emailVerified: user.emailVerified,
          createdAt: user.createdAt,
          active: user.active,
          authType: user.authType,
          contact_no: user.contact_no,
          profile_picture: user.profile_picture,
          role: user.role,
        },
      };
    } catch (e) {
      throwCommonError();
    }
  }

  async requestVerificationCode(email): Promise<RequestVerificationOuput> {
    try {
      if (!email) {
        return {
          ok: false,
          error: 'Please sign in again!',
        };
      }
      email = email.toLowerCase();
      if (!email) {
        return {
          ok: false,
          error: 'Please sign out and try again.',
        };
      }
      const user = await this.users.findOne({ email });
      const existingCodes = await this.verifications.find({
        where: {
          user,
        },
        relations: ['user'],
        order: { id: 'DESC' },
        take: 1,
      });
      if (existingCodes && existingCodes[0]) {
        const expireDate = existingCodes[0].expire_at;
        const now = new Date();
        if (expireDate > now) {
          const diff = Math.abs(expireDate.getTime() - now.getTime());
          const diffInSeconds = parseInt(diff / 1000 + '');
          const minutes = diffInSeconds / 60 + '';
          const seconds = diffInSeconds % 60;
          return {
            ok: false,
            error: `You have previously requested for a code! Please wait for another: ${
              minutes.split('.')[0]
            }:${padWithChar(seconds, 2, 0)} minutes`,
          };
        }
      }
      const newCode = await this.verifications.save(
        this.verifications.create({ user }),
      );
      if (newCode) {
        await this.mailService.sendVerificationEmail(email, newCode.code);
        return {
          ok: true,
        };
      }
      return {
        ok: false,
        error: "We couldn't send a new code to you! Please try again.",
      };
    } catch (error) {
      console.log(error);
      throwCommonError();
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
            'createdAt',
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
      throwCommonError();
    }
  }

  async updateProfile(
    id: number,
    { contact_no, email, name }: UpdateProfileInput,
  ): Promise<UpdateProfileOutput> {
    try {
      const user = await this.users.findOne(id);
      if (email) {
        email = email.toLowerCase();
        const emailExists = await this.users.findOne({ email });
        if (emailExists) {
          return {
            ok: false,
            error: 'The email address is taken! Please try a different one.',
          };
        }
        user.email = email;
        user.emailVerified = false;
      }
      if (name) user.name = name;
      if (contact_no) user.contact_no = contact_no;

      await this.users.save(user);
      await this.pubSub.publish(ME_UPDATES, { getMe: { user } });
      return {
        ok: true,
      };
    } catch (error) {
      throwCommonError();
    }
  }

  async verifyEmail(
    userId,
    { code }: VerifyEmailInput,
  ): Promise<VerifyEmailOutput> {
    try {
      const user = await this.users.findOne(userId);
      const verifications = await this.verifications.find({
        where: {
          user,
        },
        relations: ['user'],
        order: { id: 'DESC' },
        take: 1,
      });

      if (!verifications || (verifications && verifications.length === 0)) {
        return {
          ok: false,
          error: 'This is not a valid e-mail!',
        };
      }
      const now = new Date();
      const verification = verifications[0];
      if (now > verification.expire_at)
        return {
          ok: false,
          error: 'The verification code has expired! Please request a new one!',
        };
      if ('' + code !== '' + verification.code)
        return {
          ok: false,
          error: 'The six-digit code is incorrect! Please try again!',
        };

      if (!user) {
        return {
          ok: false,
          error: 'Your account has been deleted! Please create a new one!',
        };
      }
      user.emailVerified = true;
      await this.users.save(user);
      await this.pubSub.publish(ME_UPDATES, { updateMe: { user } });
      return {
        ok: true,
      };
    } catch (error) {
      throwCommonError();
    }
  }

  async onUpdateUser(user: Users) {
    await this.pubSub.publish(ME_UPDATES, { getMe: { user } });
  }
}
