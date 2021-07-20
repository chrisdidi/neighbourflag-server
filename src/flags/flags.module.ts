import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FlagColors } from './entities/flag-colors.entities';
import { Flags } from './entities/flags.entities';
import { FlagsService } from './flags.service';
import { FlagsResolver } from './flags.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Flags, FlagColors])],
  providers: [FlagsService, FlagsResolver],
})
export class FlagsModule {}
