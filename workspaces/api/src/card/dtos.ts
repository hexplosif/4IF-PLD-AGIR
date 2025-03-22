import { Actor } from "@shared/common/Cards";
import { Language } from "@shared/common/Languages";
import { Type } from "class-transformer";
import { IsInt, IsBoolean, IsString, IsEnum, isEnum, IsNotEmptyObject, IsArray, ValidateNested } from "class-validator";

export class AddCardDto {
    @IsInt()
    id: number;

    @IsString()
    cardType: string;

    @IsInt()
    carbon_loss: number;

    @IsNotEmptyObject()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LanguageContent)
    languageContents: LanguageContent[];

    @IsString()
    link: string;

    @IsBoolean()
    network_gain: boolean;

    @IsBoolean()
    memory_gain: boolean;

    @IsBoolean()
    cpu_gain: boolean;

    @IsBoolean()
    storage_gain: boolean;

    @IsInt()
    difficulty: number;
}

class LanguageContent {
    @IsEnum(Language)
    language: Language;

    @IsString()
    actorName: string;

    @IsEnum(Actor)
    actorType: Actor;

    @IsString()
    title: string;

    @IsString()
    description: string;
}