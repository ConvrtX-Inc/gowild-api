import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsValidTime(validationOptions: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidTime',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (!value) {
            return true;
          }
          return /^(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d$/.test(value);
        },
      },
    });
  };
}
