import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throwCommonError } from 'src/utils/handlers';
import { Repository } from 'typeorm';
import { FindFlagColorsOutput } from './dtos/find-flag-colors.dto';
import {
  InsertFlagColorInput,
  InsertFlagColorOutput,
} from './dtos/insert-flag-color.dto';
import { FlagColors } from './entities/flag-colors.entities';
import { Flags } from './entities/flags.entities';

@Injectable()
export class FlagsService {
  constructor(
    @InjectRepository(FlagColors)
    private readonly flagColors: Repository<FlagColors>,
    @InjectRepository(Flags) private readonly flags: Repository<Flags>,
  ) {}

  async findFlagColors(): Promise<FindFlagColorsOutput> {
    try {
      const flagColors = await this.flagColors.find({
        on: true,
      });
      return {
        ok: true,
        flagColors,
      };
    } catch (error) {
      throwCommonError();
    }
  }

  async insertFlagColor(
    input: InsertFlagColorInput,
  ): Promise<InsertFlagColorOutput> {
    try {
      await this.flagColors.save(this.flagColors.create(input));
      return {
        ok: true,
      };
    } catch (error) {
      throwCommonError();
    }
  }
}
