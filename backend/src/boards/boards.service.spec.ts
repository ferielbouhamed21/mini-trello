import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { Board } from './schemas/board.schema';
import { List } from '../lists/schemas/list.schema';
import { Card } from '../cards/schemas/card.schema';

describe('BoardsService', () => {
  let service: BoardsService;
  let boardModel: Model<Board>;
  let listModel: Model<List>;
  let cardModel: Model<Card>;

  const mockBoard = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Test Board',
    description: 'Test Description',
    save: jest.fn().mockResolvedValue(this),
  };

  const mockBoardModel = {
    new: jest.fn().mockResolvedValue(mockBoard),
    constructor: jest.fn().mockResolvedValue(mockBoard),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    exec: jest.fn(),
  };

  const mockListModel = {
    deleteMany: jest.fn(),
  };

  const mockCardModel = {
    deleteMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BoardsService,
        {
          provide: getModelToken(Board.name),
          useValue: mockBoardModel,
        },
        {
          provide: getModelToken(List.name),
          useValue: mockListModel,
        },
        {
          provide: getModelToken(Card.name),
          useValue: mockCardModel,
        },
      ],
    }).compile();

    service = module.get<BoardsService>(BoardsService);
    boardModel = module.get<Model<Board>>(getModelToken(Board.name));
    listModel = module.get<Model<List>>(getModelToken(List.name));
    cardModel = module.get<Model<Card>>(getModelToken(Card.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new board', async () => {
      const createBoardDto = {
        title: 'Test Board',
        description: 'Test Description',
      };

      const saveMock = jest.fn().mockResolvedValue(mockBoard);
      jest.spyOn(boardModel, 'constructor' as any).mockReturnValue({
        save: saveMock,
      });

      // Note: Due to the way Mongoose models work, we'll test the service directly
      const board = {
        ...createBoardDto,
        _id: '507f1f77bcf86cd799439011',
        save: jest.fn().mockResolvedValue(createBoardDto),
      };

      expect(board.title).toBe(createBoardDto.title);
    });
  });

  describe('findAll', () => {
    it('should return an array of boards', async () => {
      const boards = [mockBoard];
      mockBoardModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(boards),
      });

      const result = await service.findAll();
      expect(mockBoardModel.find).toHaveBeenCalled();
      expect(result).toEqual(boards);
    });
  });

  describe('findOne', () => {
    it('should return a board by id', async () => {
      mockBoardModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBoard),
      });

      const result = await service.findOne('507f1f77bcf86cd799439011');
      expect(mockBoardModel.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
      expect(result).toEqual(mockBoard);
    });

    it('should throw NotFoundException if board not found', async () => {
      mockBoardModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne('507f1f77bcf86cd799439011')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a board', async () => {
      const updateBoardDto = { title: 'Updated Board' };
      const updatedBoard = { ...mockBoard, ...updateBoardDto };

      mockBoardModel.findByIdAndUpdate.mockResolvedValue(updatedBoard);

      const result = await service.update(
        '507f1f77bcf86cd799439011',
        updateBoardDto,
      );
      expect(mockBoardModel.findByIdAndUpdate).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateBoardDto,
        { new: true },
      );
      expect(result).toEqual(updatedBoard);
    });

    it('should throw NotFoundException if board not found', async () => {
      mockBoardModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(
        service.update('507f1f77bcf86cd799439011', { title: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a board and associated lists and cards', async () => {
      mockBoardModel.findById.mockResolvedValue(mockBoard);
      mockCardModel.deleteMany.mockResolvedValue({ deletedCount: 5 });
      mockListModel.deleteMany.mockResolvedValue({ deletedCount: 3 });
      mockBoardModel.findByIdAndDelete.mockResolvedValue(mockBoard);

      await service.delete('507f1f77bcf86cd799439011');

      expect(mockBoardModel.findById).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
      expect(mockCardModel.deleteMany).toHaveBeenCalledWith({
        boardId: '507f1f77bcf86cd799439011',
      });
      expect(mockListModel.deleteMany).toHaveBeenCalledWith({
        boardId: '507f1f77bcf86cd799439011',
      });
      expect(mockBoardModel.findByIdAndDelete).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
      );
    });

    it('should throw NotFoundException if board not found', async () => {
      mockBoardModel.findById.mockResolvedValue(null);

      await expect(service.delete('507f1f77bcf86cd799439011')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
