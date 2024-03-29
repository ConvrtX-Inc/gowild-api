import { Module } from '@nestjs/common';
import { ShareService } from './share.service';
import { ShareController } from './share.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Share } from './entities/share.entity';

@Module({
  controllers: [ShareController],
  providers: [ShareService],
  imports: [TypeOrmModule.forFeature([Share])],
})
export class ShareModule {}
