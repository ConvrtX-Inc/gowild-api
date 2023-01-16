import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card } from './entities/card.entity';
import { StatusService } from '../statuses/status.service';
import { StatusEnum } from '../auth/status.enum';
import { DeepPartial } from '../common/types/deep-partial.type';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { NotFoundException } from '../exceptions/not-found.exception';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(Card)
    private readonly cardRepository: Repository<Card>,
    private readonly statusService: StatusService,
  ) {}

  public async createCard(createCardDto: CreateCardDto) {
    let addCard = new Card();
    addCard.cardTitle = createCardDto.cardTitle;
    addCard.cardSponsor = createCardDto.cardSponsor;
    addCard.cardUrlLink = createCardDto.cardUrlLink;
    addCard.description = createCardDto.description;
    addCard.picture = createCardDto.picture;

    addCard.status = await this.statusService.findByEnum(StatusEnum.Active);
    addCard = await this.saveEntity(addCard);
    return {
      data: addCard,
    };
  }

  public async updatePicture(id: string, image: string) {
    const card = await this.cardRepository.findOne({
      where: { id: id },
    });

    if (!card) {
      throw new NotFoundException({
        errors: [
          {
            user: 'Card does not exist',
          },
        ],
      });
    }

    card.picture = image;
    return {
      message: 'Card Image Updated Successfully!',
      data: await card.save(),
    };
  }

  async findOneCard(id: string) {
    const getCard = await this.cardRepository.findOne({
      where: { id: id },
    });
    if (!getCard) {
      return { message: 'Card does not Exist!' };
    }

    const container: {
      id: string;
      cardTitle: string;
      cardSponsor: string;
      cardUrlLink: string;
      description: string;
      picture: string;
    } = {
      id: id,
      cardTitle: getCard.cardTitle,
      cardSponsor: getCard.cardSponsor,
      cardUrlLink: getCard.cardUrlLink,
      description: getCard.description,
      picture: getCard.picture,
    };
    return container;
  }

  async findAllCards() {
    const getCards = this.cardRepository.find({
      relations: ['status'],
    });
    return getCards;
  }

  async updateCard(id: string, dto: UpdateCardDto) {
    const updateCard = await this.cardRepository.findOne({
      where: { id: id },
    });

    if (!updateCard) {
      throw new NotFoundException({
        errors: [
          {
            message: 'Card does not exist',
          },
        ],
      });
    }

    updateCard.cardTitle = dto.cardTitle;
    updateCard.cardSponsor = dto.cardSponsor;
    updateCard.cardUrlLink = dto.cardUrlLink;
    updateCard.description = dto.description;
    updateCard.picture = dto.picture;

    await updateCard.save();
    return updateCard;
  }

  async removeCard(id: string) {
    const cardData = await this.cardRepository.findOne(id);
    if (cardData) {
      await getConnection()
        .createQueryBuilder()
        .delete()
        .from(Card)
        .where('id = :id', { id: id })
        .execute();

      return {
        message: 'Card deleted Successfully',
      };
    } else {
      return { message: 'Card not deleted' };
    }
  }

  async saveEntity(data: DeepPartial<Card>) {
    return this.cardRepository.save(this.cardRepository.create(data));
  }
}
