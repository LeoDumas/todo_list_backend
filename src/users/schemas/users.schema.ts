import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema()
export class Users extends Document {
  // Unique cause primary key
  @Prop({ required: true, unique: true })
  username: string;
  // Unique cause primary key too
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;
}

export const UsersSchema = SchemaFactory.createForClass(Users);

// Action that execute before saving user to database
UsersSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  // Add salt to the password for security
  const salt = await bcrypt.genSalt(10);
  // Hash the password
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
