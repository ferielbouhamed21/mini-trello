import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ListsService } from './lists.service';
import { CreateListDto, UpdateListDto } from './dto/list.dto';

@Controller()
export class ListsController {
  constructor(private readonly listsService: ListsService) {}

  @Get('boards/:id/lists')
  findByBoard(@Param('id') boardId: string) {
    return this.listsService.findByBoard(boardId);
  }

  @Post('boards/:id/lists')
  create(@Param('id') boardId: string, @Body() createListDto: CreateListDto) {
    return this.listsService.create(boardId, createListDto);
  }

  @Put('lists/:id')
  update(@Param('id') id: string, @Body() updateListDto: UpdateListDto) {
    return this.listsService.update(id, updateListDto);
  }

  @Delete('lists/:id')
  delete(@Param('id') id: string) {
    return this.listsService.delete(id);
  }
}
