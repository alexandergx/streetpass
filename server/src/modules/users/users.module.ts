import { Module } from '@nestjs/common'
import {  UsersService, } from './users.service'
import { UsersResolver } from './users.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/schemas/user.schema'
import { JwtModule, } from '@nestjs/jwt'
import { UserRecords, UserRecordsSchema } from 'src/schemas/userRecords.schema'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, collection: User.name, schema: UserSchema, },
      { name: UserRecords.name, collection: UserRecords.name, schema: UserRecordsSchema, },
    ]),
    JwtModule.register({ secret: process.env.JWT_SECRET, }),
    AuthModule,
  ],
  exports: [UsersService],
  providers: [UsersResolver, UsersService]
})
export class UsersModule {}
