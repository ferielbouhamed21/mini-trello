import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateBoardSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
});

export class CreateBoardDto extends createZodDto(CreateBoardSchema) {}

export const UpdateBoardSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
});

export class UpdateBoardDto extends createZodDto(UpdateBoardSchema) {}
