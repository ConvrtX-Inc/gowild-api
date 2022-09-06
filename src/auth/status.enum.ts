export enum StatusEnum {
  Cancelled = 'cancelled',
  Active = 'active',
  Disabled = 'disabled',
  Approved = 'approved',
  Refunded = 'refunded',
  Rejected = 'rejected',
  Completed = 'completed',
  Pending = 'pending',
  Inactive = 'inactive',
}

export const statusEnumsNames = Object.values(StatusEnum)
  .filter((i) => typeof i === 'string')
  .map((e) => e as string);
