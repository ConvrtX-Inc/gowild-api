import { Module } from '@nestjs/common';
import { RouteCluesService } from './route-clues.service';
import { RouteCluesController } from './route-clues.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RouteClue } from './entities/route-clue.entity';
import { FilesModule } from '../files/files.module';

@Module({
  controllers: [RouteCluesController],
  providers: [RouteCluesService],
  imports: [TypeOrmModule.forFeature([RouteClue]), FilesModule],
})
export class RouteCluesModule {}
