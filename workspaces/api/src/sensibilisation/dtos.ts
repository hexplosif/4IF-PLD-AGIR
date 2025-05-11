import { Actor } from "@shared/common/Cards";
import { Language } from "@shared/common/Languages";
import { Type } from "class-transformer";
import { IsInt, IsBoolean, IsString, IsEnum, isEnum, IsNotEmptyObject, IsArray, ValidateNested } from "class-validator";

export class QuestionDto {
    @IsString()
    language: string;

    @IsString()
    description: string;

    @IsArray()
    @IsString({ each: true })
    responses: string[];

    @IsInt()
    correct_response: number;
}

export class QuestionResponse {
    id : number;
    correct_response: number;
    contents: Record<string, QuestionContent>;
}

export interface QuestionContent {
    description: string;
    responses: string[];
}