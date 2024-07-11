import {IsString} from 'class-validator';
export class BookletDto
{
    @IsString()
    user_id: string ;
}
