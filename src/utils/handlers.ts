import { InternalServerErrorException } from '@nestjs/common';
import { commonErrorMessage } from './constants';

export const throwCommonError = () => {
  throw new InternalServerErrorException(commonErrorMessage);
};
