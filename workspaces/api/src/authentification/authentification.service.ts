
import { BadRequestException, HttpStatus, Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BookletService } from '../booklet/booklet.service';
import { Inject, forwardRef } from '@nestjs/common';
import { defaultAdmin, SALT_OR_ROUNDS } from './constants';
import { UserRole } from '@app/entity/user';
import { AppException } from '@app/exceptions/app.exception';
import { AuthErrorCode } from '@app/exceptions/enums';

@Injectable()
export class AuthService implements OnModuleInit {
	private validTokens: Map<string, string> = new Map();
	constructor(
		@Inject(forwardRef(() => UsersService))
		private usersService: UsersService,
		private bookletService : BookletService,
		private jwtService: JwtService
	) { }

	async signIn( mail: string, pass: string): Promise<{ access_token: string, role: UserRole }> {
		const user = await this.usersService.findOne(mail);
		if (!user) {
			throw new AppException(AuthErrorCode.INVALID_MAIL, HttpStatus.UNAUTHORIZED);
		}

		const isPasswordValid = await bcrypt.compare(pass, user.password);
		if (!isPasswordValid) {
			throw new AppException(AuthErrorCode.INVALID_PASSWORD, HttpStatus.UNAUTHORIZED);
		}

		const payload = { sub: user.id, mail: user.mail};
		const token = await this.jwtService.signAsync(payload, { expiresIn: '2h' });
		this.validTokens.set(token, user.mail);

		return { access_token: token, role: user.role, };
	}


	async signUp(
		mail: string,
		password: string,
		lastname: string,
		firstname: string
	): Promise<{ success: boolean; message?: string }> {
		// Vérifiez si l'utilisateur existe déjà
		const existingUser = await this.usersService.findOne(mail);
		if (existingUser) {
			throw new AppException(AuthErrorCode.MAIL_ALREADY_USED, HttpStatus.BAD_REQUEST);
		}

		// Hash du mot de passe
		const hashedPassword = await bcrypt.hash(password, SALT_OR_ROUNDS);
		let user_id = await this.usersService.createUser(mail, hashedPassword, lastname, firstname, UserRole.USER);

		// Création du booklet
		await this.bookletService.createBooklet(user_id.user_id);

		console.log("[Authentification.service] User created with email: " + mail);
		return { success: true };
	}


	async signOut(token: string): Promise<{ success: boolean }> {
	    // Vérifiez si le jeton est dans le map
		if (!this.validTokens.has(token)) {
			throw new AppException(AuthErrorCode.NOT_LOGGED_IN, HttpStatus.UNAUTHORIZED);
		}

		// Vérifiez si le token est expiré
		if (this.isTokenExpired(token)) {
			throw new AppException(AuthErrorCode.TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED);
		}

		this.validTokens.delete(token);
		return { success: true };
	}


	async isConnected(token: string): Promise<{ connected: boolean, role?: UserRole }> {
		// Vérifiez si le jeton est dans le map
		if (!this.validTokens.has(token)) {
			throw new AppException(AuthErrorCode.NOT_LOGGED_IN, HttpStatus.UNAUTHORIZED);
		}

		// Vérifiez si le token est expiré
		if (this.isTokenExpired(token)) {
			throw new AppException(AuthErrorCode.TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED);
		}

		let mail = this.validTokens.get(token);
		const user = await this.usersService.findOne(mail);
		if (user) {
			return { connected: true, role: user.role };
		} 
		return { connected: false, role: null };
	}


	async getUserByToken (token: string): Promise<number>{
		if (token==undefined){
		console.log("[authService getUserByToken] access_token undefined ");
		}
		const mail = this.validTokens.get(token);
		const user = await this.usersService.findOne(mail);
		return user.id;
	}
	

	async onModuleInit() {
		// add default admin
		let user = await this.usersService.findOne(defaultAdmin.mail);
		if (!user) {
			let admin_id = await this.usersService.createUser(
				defaultAdmin.mail,
				await bcrypt.hash(defaultAdmin.password, 10),
				defaultAdmin.lastname,
				defaultAdmin.firstname,
				UserRole.ADMIN
			);
			console.log('Default admin created');
		}
	}

	private isTokenExpired(token: string): boolean {
		const payload = this.jwtService.decode(token);
		if (!payload) {
			this.validTokens.delete(token);
			return true;
		}
		return false;
	}

}


