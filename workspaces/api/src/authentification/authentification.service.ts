
import { Injectable, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BookletService } from '../booklet/booklet.service';
import { Inject, forwardRef } from '@nestjs/common';
import { defaultAdmin } from './constants';
import { UserRole } from '@app/entity/user';

@Injectable()
export class AuthService implements OnModuleInit {
  private validTokens: Map<string, string> = new Map();
  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private bookletService : BookletService,
    private jwtService: JwtService
  ) { }

  async signIn(
    mail: string,
    pass: string,
  ): Promise<{ access_token: string, role: UserRole }> {

    const user = await this.usersService.findOne(mail);
    if (!user) {
      throw new UnauthorizedException('Invalid mail');
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }
    const payload = { sub: user.id, mail: user.mail};
    const token = await this.jwtService.signAsync(payload, { expiresIn: '2h' });
    this.validTokens.set(token, user.mail);
    console.log('Token:', token, 'for payload', payload);
    return {
      access_token: token,
      role: user.role,
    };
  }

  async signUp(
    mail: string,
    password: string,
    lastname: string,
    firstname: string
  ): Promise<{ success: boolean; message?: string }> {
    try {
      // Vérifiez si l'utilisateur existe déjà
      const existingUser = await this.usersService.findOne(mail);
      if (existingUser) {
        return { success: false, message: 'Mail already exists'};
      }
      // Hash du mot de passe
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      // Création de l'utilisateur dans la base de données avec le mot de passe hashé
      let user_id = await this.usersService.createUser(mail, hashedPassword, lastname, firstname, UserRole.USER);
      
      let booklet = await this.bookletService.createBooklet(user_id.user_id);
      console.log('User created');

      return { success: true };
    } catch (error) {
      console.error('Error creating user:', error.message);
      return { success: false, message: 'An error occurred while creating the user' };
    }
  }

  async signOut(token: string): Promise<{ success: boolean }> {
    try {

      this.validTokens.delete(token);
      return { success: true }
    }
    catch {
      throw new Error('deconnection failed');
    }
  }

  async isConnected(access_token: string): Promise<{ connected: boolean, role?: UserRole }> {
    let mail = this.validTokens.get(access_token);
    const user = await this.usersService.findOne(mail);
    if (mail) {
      return { connected: true, role: user.role };
    } 
    return { connected: false, role: null };
  }

  async getUserByToken (access_token: string): Promise<number>{
    if (access_token==undefined){
    console.log("[authService getUserByToken] access_token undefined ");
    }
    const mail = this.validTokens.get(access_token);
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

}


