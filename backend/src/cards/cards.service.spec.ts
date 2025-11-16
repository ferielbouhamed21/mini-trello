import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { CardsService } from './cards.service';
import { Card } from './schemas/card.schema';
import { List } from '../lists/schemas/list.schema';

describe('CardsService', () => {
  let service: CardsService;
  let cardModel: Model<Card>;
  let listModel: Model<List>;

  const mockListId = new Types.ObjectId();
  const mockBoardId = new Types.ObjectId();
  const mockCardId = new Types.ObjectId();

  const mockCard = {
    _id: mockCardId,
    listId: mockListId,
    boardId: mockBoardId,
    title: 'Test Card',
    description: 'Test Description',
    position: 0,
    labels: ['bug', 'urgent'],
    save: jest.fn().mockResolvedValue(this),
  };

  const mockList = {
    _id: mockListId,
    boardId: mockBoardId,
    title: 'To Do',
    position: 0,
  };

  const mockCardModel = {
    new: jest.fn().mockResolvedValue(mockCard),
    constructor: jest.fn().mockResolvedValue(mockCard),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    deleteMany: jest.fn(),
    exec: jest.fn(),
  };

  const mockListModel = {
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CardsService,
        {
          provide: getModelToken(Card.name),
          useValue: mockCardModel,
        },
        {
          provide: getModelToken(List.name),
          useValue: mockListModel,
        },
      ],
    }).compile();

    service = module.get<CardsService>(CardsService);
    cardModel = module.get<Model<Card>>(getModelToken(Card.name));
    listModel = module.get<Model<List>>(getModelToken(List.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new card', async () => {
      const createCardDto = {
        title: 'Test Card',
        description: 'Test Description',
        labels: ['bug'],
      };

      mockListModel.findById.mockResolvedValue(mockList);
      mockCardModel.findOne.mockReturnValue({
        sort: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        }),
      });

      const saveMock = jest.fn().mockResolvedValue(mockCard);
      jest.spyOn(cardModel, 'constructor' as any).mockReturnValue({
        save: saveMock,
      });

      // Test that list exists check works
      await expect(
        service.create(mockListId.toString(), createCardDto),
      ).resolves.toBeDefined();
    });

    it('should throw NotFoundException if list not found', async () => {
      mockListModel.findById.mockResolvedValue(null);

      await expect(
        service.create(mockListId.toString(), { title: 'Test Card' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a card', async () => {
      const updateCardDto = {
        title: 'Updated Card',
        description: 'Updated Description',
      };
      const updatedCard = { ...mockCard, ...updateCardDto };

      mockCardModel.findByIdAndUpdate.mockResolvedValue(updatedCard);

      const result = await service.update(mockCardId.toString(), updateCardDto);
      expect(mockCardModel.findByIdAndUpdate).toHaveBeenCalledWith(
        mockCardId.toString(),
        updateCardDto,
        { new: true },
      );
      expect(result).toEqual(updatedCard);
    });

    it('should throw NotFoundException if card not found', async () => {
      mockCardModel.findByIdAndUpdate.mockResolvedValue(null);

      await expect(
        service.update(mockCardId.toString(), { title: 'Updated' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('move', () => {
    it('should move a card to a different list', async () => {
      const newListId = new Types.ObjectId();
      const moveCardDto = {
        listId: newListId.toString(),
        boardId: mockBoardId.toString(),
        position: 1,
      };

      const mockTargetList = {
        _id: newListId,
        boardId: mockBoardId,
        title: 'Doing',
      };

      mockCardModel.findById.mockResolvedValue(mockCard);
      mockListModel.findById.mockResolvedValue(mockTargetList);
      mockCard.save.mockResolvedValue(mockCard);

      const result = await service.move(mockCardId.toString(), moveCardDto);

      expect(mockCardModel.findById).toHaveBeenCalledWith(
        mockCardId.toString(),
      );
      expect(mockListModel.findById).toHaveBeenCalledWith(newListId.toString());
      expect(mockCard.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if card not found', async () => {
      mockCardModel.findById.mockResolvedValue(null);

      await expect(
        service.move(mockCardId.toString(), {
          listId: mockListId.toString(),
          boardId: mockBoardId.toString(),
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if target list not found', async () => {
      mockCardModel.findById.mockResolvedValue(mockCard);
      mockListModel.findById.mockResolvedValue(null);

      await expect(
        service.move(mockCardId.toString(), {
          listId: mockListId.toString(),
          boardId: mockBoardId.toString(),
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete a card', async () => {
      mockCardModel.findById.mockResolvedValue(mockCard);
      mockCardModel.findByIdAndDelete.mockResolvedValue(mockCard);

      await service.delete(mockCardId.toString());

      expect(mockCardModel.findById).toHaveBeenCalledWith(
        mockCardId.toString(),
      );
      expect(mockCardModel.findByIdAndDelete).toHaveBeenCalledWith(
        mockCardId.toString(),
      );
    });

    it('should throw NotFoundException if card not found', async () => {
      mockCardModel.findById.mockResolvedValue(null);

      await expect(service.delete(mockCardId.toString())).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
