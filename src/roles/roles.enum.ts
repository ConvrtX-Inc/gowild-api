export enum RoleEnum {
  SUPER_ADMIN = 'superadmin',
  ADMIN = 'admin',
  USER = 'user',
}

export const roleEnumsNames = Object.values(RoleEnum)
  .filter((i) => typeof i === 'string')
  .map((e) => e as string);
