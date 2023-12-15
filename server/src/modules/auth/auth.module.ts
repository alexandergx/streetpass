import { Module } from '@nestjs/common'
import { AuthGuard, AuthService, } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/schemas/user.schema'
import { PassportModule } from '@nestjs/passport'
import { JwtModule, } from '@nestjs/jwt'
import { UserRecords, UserRecordsSchema } from 'src/schemas/userRecords.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, collection: User.name, schema: UserSchema, },
      { name: UserRecords.name, collection: UserRecords.name, schema: UserRecordsSchema, },
    ]),
    JwtModule.register({ secret: process.env.JWT_SECRET, }),
    PassportModule,
  ],
  exports: [AuthGuard],
  providers: [AuthService, AuthGuard, AuthResolver]
})
export class AuthModule {}
