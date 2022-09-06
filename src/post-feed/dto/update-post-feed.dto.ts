import { PartialType } from '@nestjs/swagger';
import { CreatePostFeedDto } from './create-post-feed.dto';

export class UpdatePostFeedDto extends PartialType(CreatePostFeedDto) {
}
