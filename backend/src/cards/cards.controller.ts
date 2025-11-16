import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto, UpdateCardDto, MoveCardDto } from './dto/card.dto';

@Controller()
export class CardsController {
  constructor(private readonly cardsService: CardsService) {}

  @Get('lists/:id/cards')
  findByList(@Param('id') listId: string) {
    return this.cardsService.findByList(listId);
  }

  @Post('lists/:id/cards')
  create(@Param('id') listId: string, @Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(listId, createCardDto);
  }

  @Put('cards/:id')
  update(@Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(id, updateCardDto);
  }

  @Put('cards/:id/move')
  move(@Param('id') id: string, @Body() moveCardDto: MoveCardDto) {
    return this.cardsService.move(id, moveCardDto);
  }

  @Delete('cards/:id')
  delete(@Param('id') id: string) {
    return this.cardsService.delete(id);
  }
}
