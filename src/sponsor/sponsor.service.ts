import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Sponsor } from './entities/sponsor.entity';
import { Repository } from 'typeorm';
import { CreateSponsorDto } from './dto/create-sponsor.dto';
import { NotFoundException } from 'src/exceptions/not-found.exception';
import { DeepPartial } from '../common/types/deep-partial.type';
import { FileEntity } from 'src/files/file.entity';

@Injectable()
export class SponsorService extends TypeOrmCrudService<Sponsor> {
  constructor(
    @InjectRepository(Sponsor)
    private sponsorRepository: Repository<Sponsor>,
  ) {
    super(sponsorRepository);
  }

  async saveOne(data) {
    return await this.sponsorRepository.save(
      this.sponsorRepository.create(data),
    );
  }

  async createSponsor(dto: CreateSponsorDto) {
    return await this.saveOne(dto);
  }

  public async updateImage(id: string, image: string) {
    const sponser = await this.sponsorRepository.findOne({
      where: { id: id },
    });

    if (!sponser) {
      throw new NotFoundException({
        errors: [
          {
            user: 'Sponser does not exist',
          },
        ],
      });
    }

    sponser.img = image;
    return {
      message: 'Sponser Image Updated Successfully!',
      data: await sponser.save(),
    };
  }

  async getmanySponsors(treasure_chest_id: string) {
    const allSponsors = await this.sponsorRepository.find({
      where: {
        treasure_chest: treasure_chest_id,
      },
    });
    return allSponsors;
  }

  async softDelete(id: string) {
    await this.sponsorRepository.softDelete(id);
    return {
      message: 'Sponsor deleted',
    };
  }
}
