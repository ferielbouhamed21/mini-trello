import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export const CreateListSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  position: z.number().optional(),
});

export class CreateListDto extends createZodDto(CreateListSchema) {}

export const UpdateListSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  position: z.number().optional(),
});

export class UpdateListDto extends createZodDto(UpdateListSchema) {}
