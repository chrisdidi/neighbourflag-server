import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AllowedItems } from './entities/allowed-items.entities';
import { ItemsRequestBy } from './entities/items-requested-by.entities.dto';
import { RequestItems } from './entities/request-items.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([AllowedItems, ItemsRequestBy, RequestItems]),
  ],
  providers: [ItemsService, ItemsResolver],
})
export class ItemsModule {}
