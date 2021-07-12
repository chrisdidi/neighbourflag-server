import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import * as Joi from 'joi';
import { Users } from './users/entities/user.entities';
import { GraphQLModule } from '@nestjs/graphql';
import { JwtModule } from './jwt/jwt.module';

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
      entities: [Users],
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
    UsersModule,
    CommonModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
