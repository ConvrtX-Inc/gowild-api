import {Injectable} from '@nestjs/common';
import {CreateCardDto} from './dto/create-card.dto';
import {UpdateCardDto} from './dto/update-card.dto';
import {Card} from "./entities/card.entity";
import {StatusService} from "../statuses/status.service";
import {StatusEnum} from "../auth/status.enum";
import {DeepPartial} from "../common/types/deep-partial.type";
import {UserEntity} from "../users/user.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class CardsService {
  constructor(
      @InjectRepository(Card)
      private readonly cardRepository: Repository<Card>,
      private readonly statusService: StatusService) {
  }
  async createCard(createCardDto: CreateCardDto) {
    let addCard = new Card();
    addCard.cardTitle = createCardDto.cardTitle;
    addCard.cardSponsor = createCardDto.cardSponsor;
    addCard.cardUrlLink = createCardDto.cardUrlLink;
    addCard.description = createCardDto.description;
    addCard.picture = createCardDto.picture;

    addCard.status = await this.statusService.findByEnum(StatusEnum.Active)
    await this.saveEntity(addCard);
    return{
      data: addCard
    }
  }

  findAll() {
    return `This action returns all cards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }


  async saveEntity(data: DeepPartial<Card>) {
    return this.cardRepository.save(this.cardRepository.create(data));
  }
}

