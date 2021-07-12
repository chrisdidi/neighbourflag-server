import { UnauthorizedException } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { Users } from 'src/users/entities/user.entities';
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
import { ItemsService } from './items.service';

@Resolver()
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Query(() => FindAllowedItemsByNameOutput)
  findAllowedItems(@Args('input') input: FindAllowedItemsByNameInput) {
    return this.itemsService.findAllowedItemsByName(input);
  }

  @Mutation(() => InsertAllowedItemsOutput)
  @Role(['Admin'])
  insertAllowedItems(@Args('input') input: InsertAllowedItemsInput) {
    return this.itemsService.insertAllowedItems(input);
  }

  @Mutation(() => RequestAddItemsOutput)
  requestAddItems(
    @AuthUser() authUser: Users,
    @Args('input') input: RequestAddItemsInput,
  ) {
    if (!authUser) {
      throw new UnauthorizedException();
    }
    return this.itemsService.requestAddItem(authUser.id, input);
  }
}
