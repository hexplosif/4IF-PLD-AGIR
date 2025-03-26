
import {
    CanActivate,
    ExecutionContext,
    forwardRef,
    Inject,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './authentification.service';
  
@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @Inject(forwardRef(() => AuthService))
        private readonly authService: AuthService,
    ) {}
  
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('Not signed in or missing token.');
        }

        const { connected, role } = await this.authService.isConnected(token);

        if (!connected) {
            throw new UnauthorizedException('Invalid token.');
        }

        request.user = { role };
        return true;
    }
  
    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
  }
  