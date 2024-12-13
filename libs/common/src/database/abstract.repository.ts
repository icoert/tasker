import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { AbastractDocument } from './abstract.schema';
import { Logger, NotFoundException } from '@nestjs/common';

/**
 * Abstract repository class to provide common database operations.
 * @template TDocument - The document type that extends AbastractDocument.
 */
export abstract class AbstractRepository<TDocument extends AbastractDocument> {
  /**
   * Logger instance for the repository.
   */
  protected abstract readonly logger: Logger;

  /**
   * Constructor to initialize the repository with a Mongoose model.
   * @param model - The Mongoose model for the document type.
   */
  constructor(protected readonly model: Model<TDocument>) {}

  /**
   * Creates a new document in the database.
   * @param document - The document data to create, excluding the `_id` field.
   * @returns The created document as a plain object.
   */
  async create(document: Omit<TDocument, '_id'>): Promise<TDocument> {
    const createDocument = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    return (await createDocument.save()).toJSON() as unknown as TDocument;
  }

  /**
   * Finds a single document that matches the specified filter query.
   * @param filterQuery - The query to filter documents.
   * @throws NotFoundException if the document is not found.
   * @returns The found document as a plain object.
   */
  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model
      .findOne(filterQuery)
      .lean<TDocument>(true); //hydrated document, so we want only the plain object

    if (!document) {
      this.logger.warn('Docuemnt was not found with filterQuery', filterQuery);

      throw new NotFoundException('Document was not found!');
    }

    return document;
  }

  /**
   * Finds a single document that matches the specified filter query and updates it.
   * @param filterQuery - The query to filter documents.
   * @param update - The update operations to apply to the document.
   * @throws NotFoundException if the document is not found.
   * @returns The updated document as a plain object.
   */
  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    update: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const document = await this.model
      .findOneAndUpdate(filterQuery, update, {
        new: true,
      })
      .lean<TDocument>(true);

    if (!document) {
      this.logger.warn('Docuemnt was not found with filterQuery', filterQuery);

      throw new NotFoundException('Document was not found!');
    }

    return document;
  }

  /**
   * Finds multiple documents that match the specified filter query.
   * @param filterQuery - The query to filter documents.
   * @returns An array of found documents as plain objects.
   */
  async find(filterQuery: FilterQuery<TDocument>): Promise<TDocument[]> {
    return this.model.find(filterQuery).lean<TDocument[]>(true);
  }

  /**
   * Finds a single document that matches the specified filter query and deletes it.
   * @param filterQuery - The query to filter documents.
   * @returns The deleted document as a plain object, or null if no document is found.
   */
  async findOneAndDelete(
    filterQuery: FilterQuery<TDocument>,
  ): Promise<TDocument> {
    return this.model.findOneAndDelete(filterQuery).lean<TDocument>(true);
  }
}
