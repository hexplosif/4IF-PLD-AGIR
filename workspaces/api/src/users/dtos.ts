import {IsNumber, IsString, MaxLength, MinLength } from 'class-validator';
export class UsersDto
{
    @IsString()
    user_id: string ;
}

export class UsersTokenDto
{
    @IsString()
    token: string ;
}