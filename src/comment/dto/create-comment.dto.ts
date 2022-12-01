import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';



export class CreateCommentDto {  
  
    @ApiProperty({ example: '54ba206c-2563-48a7-a29e-acf3ce6dc5e5' })
    @IsNotEmpty()
    postfeed_id: string;

    @ApiProperty({example:"string"})
    @IsNotEmpty()
    message: string;
}
