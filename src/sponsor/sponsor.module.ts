import { Module } from '@nestjs/common';
import { SponsorService } from './sponsor.service';
import { SponsorController } from './sponsor.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sponsor } from './entities/sponsor.entity';

@Module({
  controllers: [SponsorController],
  providers: [SponsorService],
  imports: [TypeOrmModule.forFeature([Sponsor])],
})
export class SponsorModule {
}
