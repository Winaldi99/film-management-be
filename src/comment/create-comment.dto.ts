import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCommentDTO {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  filmId: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  comment: string;
}