import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateCardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional().or(z.date().optional()),
  labels: z.array(z.string()).optional(),
  position: z.number().optional(),
});

export class CreateCardDto extends createZodDto(CreateCardSchema) {}

export const UpdateCardSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  dueDate: z.string().datetime().optional().or(z.date().optional()),
  labels: z.array(z.string()).optional(),
  position: z.number().optional(),
});

export class UpdateCardDto extends createZodDto(UpdateCardSchema) {}

export const MoveCardSchema = z.object({
  listId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  boardId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId'),
  position: z.number().optional(),
});

export class MoveCardDto extends createZodDto(MoveCardSchema) {}
