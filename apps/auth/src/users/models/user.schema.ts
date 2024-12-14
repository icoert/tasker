import { AbastractDocument } from '@app/common/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * UserDocument schema represents a user record in the MongoDB database.
 * This schema extends AbstractDocument to include shared fields or functionality.
 */
@Schema({ versionKey: false }) // Disables the __v version key in MongoDB
export class UserDocument extends AbastractDocument {
  /**
   * The email address of the user.
   * @type {string}
   */
  @Prop()
  email: string;

  /**
   * The hashed password of the user.
   * @type {string}
   */
  @Prop()
  password: string;
}

/**
 * The UserSchema is the Mongoose schema generated from the UserDocument class.
 * It is used to define the structure of user documents in the MongoDB database.
 */
export const UserSchema = SchemaFactory.createForClass(UserDocument);
