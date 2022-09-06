import { PartialType } from '@nestjs/swagger';
import { CreateTicketMessageDto } from './create-ticket-message.dto';

export class UpdateTicketMessageDto extends PartialType(CreateTicketMessageDto) {
}
