import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import * as Joi from 'joi';
import { Users } from './users/entities/user.entities';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from './jwt/jwt.module';
import { MailModule } from './mail/mail.module';
import { Verification } from './users/entities/verification.entities';
import { JwtMiddleware } from './jwt/jwt.middleware';
import { ItemsModule } from './items/items.module';
import { AllowedItems } from './items/entities/allowed-items.entities';
import { AuthModule } from './auth/auth.module';
import { RequestItems } from './items/entities/request-items.entities';
import { ItemsRequestBy } from './items/entities/items-requested-by.entities.dto';
import { FlagsModule } from './flags/flags.module';
import { FlagColors } from './flags/entities/flag-colors.entities';
import { FlagsSupportedTypes } from './flags/entities/flags-supported-types.entities';
import { Flags } from './flags/entities/flags.entities';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.dev',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      validationOptions: Joi.object({
        NODE_ENV: Joi.string().valid('production', 'development'),
        DB_HOST: Joi.string(),
        DB_PORT: Joi.string(),
        DB_USERNAME: Joi.string(),
        DB_PASSWORD: Joi.string(),
        DB_NAME: Joi.string(),
        MAILGUN_API_KEY: Joi.string(),
        MAILGUN_DOMAIN_NAME: Joi.string(),
        MAILGUN_FROM_EMAIL: Joi.string(),
        MAILGUN_HELP_EMAIL: Joi.string(),
        JWT_KEY: Joi.string(),
        ADMIN_EMAIL: Joi.string(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'production',
      entities: [
        Users,
        Verification,
        AllowedItems,
        ItemsRequestBy,
        RequestItems,
        Flags,
        FlagsSupportedTypes,
        FlagColors,
      ],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({ req }) => ({
        user: req['user'],
        token: req.headers['x-jwt'],
      }),
    }),
    JwtModule.forRoot({
      privateKey: process.env.JWT_KEY,
    }),
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN_NAME,
      fromEmail: process.env.MAILGUN_FROM_EMAIL,
      helpEmail: process.env.MAILGUN_HELP_EMAIL,
    }),
    AuthModule,
    UsersModule,
    CommonModule,
    ItemsModule,
    FlagsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
