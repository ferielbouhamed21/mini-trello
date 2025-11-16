import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Card extends Document {
  @Prop({ type: String, required: true })
  listId: string;

  @Prop({ type: String, required: true })
  boardId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop()
  dueDate?: Date;

  @Prop({ type: [String], default: [] })
  labels?: string[];

  @Prop({ required: true, default: 0 })
  position: number;
}

export const CardSchema = SchemaFactory.createForClass(Card);
