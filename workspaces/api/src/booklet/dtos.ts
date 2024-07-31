import {IsNumber, IsOptional, IsString} from 'class-validator';
export class BookletDto
{
    @IsString()
    user_id: string ;

    @IsOptional()
    @IsNumber()
    order?:number;

    @IsOptional()
    @IsString()
    typePractices?:string;
}

export class ExportDto {
    filename: string;
    format: 'pdf' | 'csv';
    data: any[];
}
