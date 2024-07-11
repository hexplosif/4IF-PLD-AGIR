import { Module } from '@nestjs/common';
import { AuthService } from './authentification.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './authentification.controller';
import { jwtConstants } from './constants';
import { BookletModule } from '../booklet/booklet.module';
import { BookletService } from '../booklet/booklet.service';
import { Green_IT_Booklet } from '@app/entity/green_it_booklet';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/entity/user';
import { forwardRef } from '@nestjs/common';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    BookletModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
    }),
    TypeOrmModule.forFeature([Green_IT_Booklet, User]),
  ],
  providers: [AuthService,BookletService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

