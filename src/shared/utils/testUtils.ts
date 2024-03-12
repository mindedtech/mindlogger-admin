import { MaybeNull } from 'shared/types';

export const testif = (condition: boolean) => (condition ? test : test.skip);

export const requireEntity = <T>(entity: MaybeNull<T>) => {
  if (entity === null) throw Error('Entity is required!');

  return entity;
};
