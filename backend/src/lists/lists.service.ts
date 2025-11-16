import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { List } from './schemas/list.schema';
import { Board } from '../boards/schemas/board.schema';
import { Card } from '../cards/schemas/card.schema';
import { CreateListDto, UpdateListDto } from './dto/list.dto';

@Injectable()
export class ListsService {
  constructor(
    @InjectModel(List.name) private listModel: Model<List>,
    @InjectModel(Board.name) private boardModel: Model<Board>,
    @InjectModel(Card.name) private cardModel: Model<Card>,
  ) {}

  async findByBoard(boardId: string): Promise<List[]> {
    return this.listModel.find({ boardId }).sort('position').exec();
  }

  async create(boardId: string, createListDto: CreateListDto): Promise<List> {
    // Check if board exists
    const board = await this.boardModel.findById(boardId);
    if (!board) {
      throw new NotFoundException(`Board with ID ${boardId} not found`);
    }

    // Get the highest position for lists in this board
    const maxPosition = await this.listModel
      .findOne({ boardId })
      .sort('-position')
      .exec();

    const position =
      createListDto.position ?? (maxPosition ? maxPosition.position + 1 : 0);

    const list = new this.listModel({
      ...createListDto,
      boardId,
      position,
    });

    return list.save();
  }

  async update(id: string, updateListDto: UpdateListDto): Promise<List> {
    const list = await this.listModel.findByIdAndUpdate(id, updateListDto, {
      new: true,
    });

    if (!list) {
      throw new NotFoundException(`List with ID ${id} not found`);
    }

    return list;
  }

  async delete(id: string): Promise<void> {
    const list = await this.listModel.findById(id);
    if (!list) {
      throw new NotFoundException(`List with ID ${id} not found`);
    }

    // Delete all cards in this list
    await this.cardModel.deleteMany({ listId: id });
    await this.listModel.findByIdAndDelete(id);
  }
}
