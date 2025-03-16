import { IsInt, IsBoolean, IsString } from "class-validator";

export class AddCardDto {
    @IsInt()
    id: number;

    @IsString()
    cardType: string;

    @IsInt()
    carbon_loss: number;

    @IsString()
    language: string; // TODO: check if we need a list instead, and combine with title, contents

    @IsString()
    title: string;

    @IsString()
    contents: string; 

    @IsString()
    link: string;

    @IsString()
    actorType: string; // TODO: check if we need a list instead

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