import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class List extends Document {
  @Prop({ type: String, required: true })
  boardId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, default: 0 })
  position: number;
}

export const ListSchema = SchemaFactory.createForClass(List);
