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
import { FlagsSupportedTypes } from './entities/flags-supported-types.entities';
import { Flags } from './entities/flags.entities';

@Injectable()
export class FlagsService {
  constructor(
    @InjectRepository(FlagColors)
    private readonly flagColors: Repository<FlagColors>,
    @InjectRepository(Flags) private readonly flags: Repository<Flags>,
    @InjectRepository(FlagsSupportedTypes)
    private readonly flagsSupportedType: Repository<FlagsSupportedTypes>,
  ) {}

  async findFlagColors(): Promise<FindFlagColorsOutput> {
    try {
      const flagColors = await this.flagColors.find();
      if (flagColors.length > 0) {
        for (let i = 0; i < flagColors.length; i++) {
          const color = flagColors[i];
          if (color.allowedFormTypes.length > 0) {
            for (let k = 0; k < color.allowedFormTypes.length; k++) {
              const allowedType = color.allowedFormTypes[k];
              if (!allowedType.isOn) {
                flagColors[i].allowedFormTypes.splice(k, 1);
                i--;
              }
            }
          }
        }
      }
      return {
        ok: true,
        flagColors,
      };
    } catch (error) {
      throwCommonError();
    }
  }

  async insertFlagColor({
    allowedFormTypes,
    flagColor,
    name,
  }: InsertFlagColorInput): Promise<InsertFlagColorOutput> {
    try {
      const allowedTypes = [];
      for (let i = 0; i < allowedFormTypes.length; i++) {
        const formType = allowedFormTypes[i];
        const newType = await this.flagsSupportedType.save(
          this.flagsSupportedType.create(formType),
        );
        allowedTypes.push(newType);
      }

      await this.flagColors.save(
        this.flagColors.create({
          flagColor,
          name,
          allowedFormTypes: allowedTypes,
        }),
      );
      return {
        ok: true,
      };
    } catch (error) {
      throwCommonError();
    }
  }
}
