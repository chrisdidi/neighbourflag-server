import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throwCommonError } from 'src/utils/handlers';
import { Repository, Raw } from 'typeorm';
import {
  FindAllowedItemsByNameInput,
  FindAllowedItemsByNameOutput,
} from './dtos/find-allowed-items-by-name.dto';
import {
  InsertAllowedItemsInput,
  InsertAllowedItemsOutput,
} from './dtos/insert_allowed-items.dto';
import {
  RequestAddItemsInput,
  RequestAddItemsOutput,
} from './dtos/request-add-items.dto';
import { AllowedItems } from './entities/allowed-items.entities';
import { ItemsRequestBy } from './entities/items-requested-by.entities.dto';
import { RequestItems } from './entities/request-items.entities';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(AllowedItems)
    private readonly allowedItems: Repository<AllowedItems>,
    @InjectRepository(RequestItems)
    private readonly requestItems: Repository<RequestItems>,
    @InjectRepository(ItemsRequestBy)
    private readonly itemsRequestBy: Repository<ItemsRequestBy>,
  ) {}

  nameToCode = (name: string) => {
    return name
      .toLowerCase()
      .split(' ')
      .join('');
  };
  async findAllowedItemsByName({
    queryText,
    page = 1,
    limit = 8,
  }: FindAllowedItemsByNameInput): Promise<FindAllowedItemsByNameOutput> {
    if (page <= 0) {
      page = 1;
    }
    try {
      const allowedItems = await this.allowedItems.find({
        where: {
          name: Raw(alias => `${alias} ILIKE '${queryText}%'`),
          show: true,
        },
        order: { popularity: 'DESC' },
        skip: (page - 1) * limit,
        take: limit,
      });
      return {
        ok: true,
        allowedItems,
      };
    } catch (error) {
      throwCommonError();
    }
  }

  async insertAllowedItems({
    name,
    popularity,
  }: InsertAllowedItemsInput): Promise<InsertAllowedItemsOutput> {
    try {
      const code = this.nameToCode(name);
      const exists = await this.allowedItems.findOne({
        code,
      });
      if (exists) {
        return {
          ok: false,
          error: 'The item already exists!',
        };
      }
      await this.allowedItems.save(
        this.allowedItems.create({
          name,
          popularity,
          code,
        }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      throwCommonError();
    }
  }

  async requestAddItem(
    userId: number,
    { items }: RequestAddItemsInput,
  ): Promise<RequestAddItemsOutput> {
    try {
      if (items.length > 0) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const code = this.nameToCode(item);
          const inAllowedItems = await this.allowedItems.findOne({ code });
          if (inAllowedItems) {
            continue;
          }
          const exist = await this.requestItems.findOne({ code });
          if (exist) {
            const checkUserRequested = {
              userId,
              requestItemId: exist.id,
            };
            const userRequested = await this.itemsRequestBy.findOne(
              checkUserRequested,
            );
            if (userRequested) {
              continue;
            }
            await this.itemsRequestBy.save(
              this.itemsRequestBy.create(checkUserRequested),
            );
            exist.requestCounts = exist.requestCounts + 1;
            await this.requestItems.save(exist);
          }
          const newItemRequest = await this.requestItems.save(
            this.requestItems.create({
              code,
              name: item,
              requestCounts: 1,
            }),
          );
          await this.itemsRequestBy.save(
            this.itemsRequestBy.create({
              userId,
              requestItemId: newItemRequest.id,
            }),
          );
        }
      }
      return {
        ok: true,
      };
    } catch (error) {
      throwCommonError();
    }
  }
}
