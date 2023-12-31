import { Module } from '@nestjs/common'
import { AuthGuard, AuthService, } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/schemas/user.schema'
import { PassportModule } from '@nestjs/passport'
import { JwtModule, } from '@nestjs/jwt'
import { Blocked, BlockedSchema } from 'src/schemas/blocked.schema'
import { UserRecords, UserRecordsSchema } from 'src/schemas/userRecords.schema'
import { Streetpasses, StreetpassesSchema } from 'src/schemas/streetpasses.schema'
import { Streetpassed, StreetpassedSchema } from 'src/schemas/streetpassed.schema'
import { Matches, MatchesSchema } from 'src/schemas/matches.schema'
import { Matched, MatchedSchema } from 'src/schemas/matched.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, collection: User.name, schema: UserSchema, },
      { name: UserRecords.name, collection: UserRecords.name, schema: UserRecordsSchema, },
      { name: Streetpasses.name, collection: Streetpasses.name, schema: StreetpassesSchema, },
      { name: Streetpassed.name, collection: Streetpassed.name, schema: StreetpassedSchema, },
      { name: Matches.name, collection: Matches.name, schema: MatchesSchema, },
      { name: Matched.name, collection: Matched.name, schema: MatchedSchema, },
      { name: Blocked.name, collection: Blocked.name, schema: BlockedSchema, },
    ]),
    JwtModule.register({ secret: process.env.JWT_SECRET, }),
    PassportModule,
  ],
  exports: [AuthGuard],
  providers: [AuthService, AuthGuard, AuthResolver]
})
export class AuthModule {}
