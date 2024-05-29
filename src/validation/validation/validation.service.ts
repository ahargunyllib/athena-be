import { Injectable } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ValidationService {
  validate<T>(schema: ZodType<T>, data: T): T {
    try {
      schema.parse(data);
      return data;
    } catch (error) {
      throw new Error(error.errors[0]);
    }
  }
}
