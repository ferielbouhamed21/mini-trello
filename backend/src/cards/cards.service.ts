import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Card } from './schemas/card.schema';
import { List } from '../lists/schemas/list.schema';
import { CreateCardDto, UpdateCardDto, MoveCardDto } from './dto/card.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectModel(Card.name) private cardModel: Model<Card>,
    @InjectModel(List.name) private listModel: Model<List>,
  ) {}

  async findByList(listId: string): Promise<Card[]> {
    return this.cardModel.find({ listId }).sort('position').exec();
  }

  async create(listId: string, createCardDto: CreateCardDto): Promise<Card> {
    // Check if list exists
    const list = await this.listModel.findById(listId);
    if (!list) {
      throw new NotFoundException(`List with ID ${listId} not found`);
    }

    // Get the highest position for cards in this list
    const maxPosition = await this.cardModel
      .findOne({ listId })
      .sort('-position')
      .exec();

    const position =
      createCardDto.position ?? (maxPosition ? maxPosition.position + 1 : 0);

    const card = new this.cardModel({
      ...createCardDto,
      listId,
      boardId: list.boardId,
      position,
    });

    return card.save();
  }

  async update(id: string, updateCardDto: UpdateCardDto): Promise<Card> {
    const card = await this.cardModel.findByIdAndUpdate(id, updateCardDto, {
      new: true,
    });

    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    return card;
  }

  async move(id: string, moveCardDto: MoveCardDto): Promise<Card> {
    const card = await this.cardModel.findById(id);
    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    // Check if target list exists
    const targetList = await this.listModel.findById(moveCardDto.listId);
    if (!targetList) {
      throw new NotFoundException(
        `List with ID ${moveCardDto.listId} not found`,
      );
    }

    // Get position for card in new list
    let position = moveCardDto.position;
    if (position === undefined) {
      const maxPosition = await this.cardModel
        .findOne({ listId: moveCardDto.listId })
        .sort('-position')
        .exec();
      position = maxPosition ? maxPosition.position + 1 : 0;
    }

    // Update card with new list, board, and position
    const updatedCard = await this.cardModel.findByIdAndUpdate(
      id,
      {
        listId: moveCardDto.listId,
        boardId: moveCardDto.boardId,
        position: position,
      },
      { new: true },
    );

    if (!updatedCard) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    return updatedCard;
  }

  async delete(id: string): Promise<void> {
    const card = await this.cardModel.findById(id);
    if (!card) {
      throw new NotFoundException(`Card with ID ${id} not found`);
    }

    await this.cardModel.findByIdAndDelete(id);
  }
}
