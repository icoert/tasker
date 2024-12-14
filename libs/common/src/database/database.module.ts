import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';

/**
 * DatabaseModule handles the database connection and provides a way to define and use Mongoose models.
 */
@Module({
  imports: [
    // Asynchronous database connection setup using Mongoose and ConfigService
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        /**
         * Retrieves the MongoDB URI from the configuration service.
         * The URI is defined in environment variables and managed by ConfigService.
         */
        uri: configService.get('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  /**
   * forFeature method is a static utility that allows modules to register specific Mongoose models.
   * @param {ModelDefinition[]} models - An array of Mongoose model definitions.
   * @returns {DynamicModule} - A dynamic module with the specified models registered.
   */
  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}
