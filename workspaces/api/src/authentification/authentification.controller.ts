
import { Body, Controller, Post, HttpCode, HttpStatus, Req, Get } from '@nestjs/common';
import { AuthService } from './authentification.service';
import { SignInDto } from './dtos';
import { SignUpDto } from './dtos';
 
@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

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
  signOut( @Req() request: Request ) {
    const token = this.extractTokenFromHeader(request);
    return this.authService.signOut(token);
  }

  @HttpCode(HttpStatus.OK)
  @Get('isConnected')
  testAccess( @Req() request: Request ) {
    const token = this.extractTokenFromHeader(request);
    return this.authService.isConnected(token);
  }

  private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers['authorization']?.split(' ') ?? [];
		return type === 'Bearer' ? token : undefined;
	}
}
