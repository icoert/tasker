import { AbastractDocument } from '@app/common/database/abstract.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

/**
 * ReservationDocument schema represents a reservation record in the database.
 * This schema is derived from the AbstractDocument to include shared fields or functionality.
 */
@Schema({ versionKey: false }) // Disables the __v version key in MongoDB
export class ReservationDocument extends AbastractDocument {
  @Prop()
  timestamp: Date;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop()
  userId: string;

  @Prop()
  invoiceId: string;
}

/**
 * The ReservationSchema is the Mongoose schema generated from the ReservationDocument class.
 * This schema is used to define the structure of reservation documents in MongoDB.
 */
export const ReservationSchema =
  SchemaFactory.createForClass(ReservationDocument);
