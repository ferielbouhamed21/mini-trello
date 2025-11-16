import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ListsController } from './lists.controller';
import { ListsService } from './lists.service';
import { List, ListSchema } from './schemas/list.schema';
import { Board, BoardSchema } from '../boards/schemas/board.schema';
import { Card, CardSchema } from '../cards/schemas/card.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: List.name, schema: ListSchema },
      { name: Board.name, schema: BoardSchema },
      { name: Card.name, schema: CardSchema },
    ]),
  ],
  controllers: [ListsController],
  providers: [ListsService],
})
export class ListsModule {}
