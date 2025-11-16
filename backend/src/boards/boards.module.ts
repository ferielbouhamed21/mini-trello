import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { Board, BoardSchema } from './schemas/board.schema';
import { List, ListSchema } from '../lists/schemas/list.schema';
import { Card, CardSchema } from '../cards/schemas/card.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Board.name, schema: BoardSchema },
      { name: List.name, schema: ListSchema },
      { name: Card.name, schema: CardSchema },
    ]),
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
