import { PartialType } from '@nestjs/mapped-types';
import { CreateLeaderBoardDto } from './create-leader-board.dto';

export class UpdateLeaderBoardDto extends PartialType(CreateLeaderBoardDto) {}
