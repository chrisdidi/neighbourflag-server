import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Role } from 'src/auth/role.decorator';
import { FindFlagColorsOutput } from './dtos/find-flag-colors.dto';
import {
  InsertFlagColorInput,
  InsertFlagColorOutput,
} from './dtos/insert-flag-color.dto';
import { FlagsService } from './flags.service';

@Resolver()
export class FlagsResolver {
  constructor(private readonly flagsService: FlagsService) {}

  @Query(() => FindFlagColorsOutput)
  findFlagColors() {
    return this.flagsService.findFlagColors();
  }

  @Mutation(() => InsertFlagColorOutput)
  @Role(['Admin'])
  insertFlagColor(@Args('input') input: InsertFlagColorInput) {
    return this.flagsService.insertFlagColor(input);
  }
}
