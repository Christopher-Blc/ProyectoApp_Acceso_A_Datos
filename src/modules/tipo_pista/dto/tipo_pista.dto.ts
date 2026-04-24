import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class TipoPistaDto {
    @IsString()
    @ApiProperty({
        description: 'Sport type name',
        example: 'Tennis',
    })
    nombre: string;

    @ApiProperty({
        description: 'Sport type picture',
        example: 'todavia no hay example porque no se pueden subir desde el front',
    })
    imagen: string;
}

