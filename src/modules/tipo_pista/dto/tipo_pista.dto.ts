import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class TipoPistaDto {
    @IsString()
    @ApiProperty({
        description: 'Sport type name',
        example: 'Tennis',
    })
    nombre: string;
}

