
import { Body, Controller, Post, HttpCode, HttpStatus, Get } from '@nestjs/common';
import { AuthService } from './authentification.service';
import { SignInDto } from './dtos';
import { SignUpDto } from './dtos';
import { SignOutDto } from './dtos';
import { isConnectedDto } from './dtos';
import { getUserIdByTokenDto } from './dtos';
 
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {
    
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    return this.authService.signIn(signInDto.mail, signInDto.password);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signup')
  signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto.mail, signUpDto.password, signUpDto.lastname, signUpDto.firstname);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signout')
  signOut(@Body() signOutDto: SignOutDto) {
    return this.authService.signOut(signOutDto.token);
  }

  @HttpCode(HttpStatus.OK)
  @Post('isConnected')
  testAccess(@Body() isConnectedDto: isConnectedDto) {
    return this.authService.isConnected(isConnectedDto.mail);
  }

  @Get('userIdByToken')
  getUserIdByToken(@Body() getUserIdByTokenDto: getUserIdByTokenDto) {
    return this.authService.getUserByToken(getUserIdByTokenDto.token);
  }
}
