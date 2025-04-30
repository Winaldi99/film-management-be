import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateFilmDTO {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  title: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  director: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  genreId: number;

  @ApiProperty()
  imageUrl: string;
}