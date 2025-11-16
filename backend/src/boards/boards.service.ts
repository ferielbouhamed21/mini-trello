import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Board } from './schemas/board.schema';
import { List } from '../lists/schemas/list.schema';
import { Card } from '../cards/schemas/card.schema';
import { CreateBoardDto, UpdateBoardDto } from './dto/board.dto';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel(Board.name) private boardModel: Model<Board>,
    @InjectModel(List.name) private listModel: Model<List>,
    @InjectModel(Card.name) private cardModel: Model<Card>,
  ) {}

  async create(createBoardDto: CreateBoardDto): Promise<Board> {
    const board = new this.boardModel(createBoardDto);
    return board.save();
  }

  async findAll(): Promise<Board[]> {
    return this.boardModel.find().exec();
  }

  async findOne(id: string): Promise<Board> {
    const board = await this.boardModel.findById(id).exec();
    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
    return board;
  }

  async update(id: string, updateBoardDto: UpdateBoardDto): Promise<Board> {
    const board = await this.boardModel.findByIdAndUpdate(id, updateBoardDto, {
      new: true,
    });
    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }
    return board;
  }

  async delete(id: string): Promise<void> {
    const board = await this.boardModel.findById(id);
    if (!board) {
      throw new NotFoundException(`Board with ID ${id} not found`);
    }

    // Delete all cards and lists associated with this board
    await this.cardModel.deleteMany({ boardId: id });
    await this.listModel.deleteMany({ boardId: id });
    await this.boardModel.findByIdAndDelete(id);
  }
}
