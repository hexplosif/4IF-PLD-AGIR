import { IsInt, IsBoolean, IsString } from "class-validator";

export class AddCardDto {
    @IsInt()
    id: number;

    @IsString()
    cardType: string;

    @IsInt()
    cardbonLoss: number;

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
    networkGain: boolean;

    @IsBoolean()
    memoryGain: boolean;

    @IsBoolean()
    cpuGain: boolean;

    @IsBoolean()
    storageGain: boolean;

    @IsInt()
    difficulty: number;
}